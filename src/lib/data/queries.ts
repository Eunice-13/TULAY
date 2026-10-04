import "server-only";

/*
 * READS for the professional portal. Every page gets its data from here.
 *
 * BACKEND TEAM: replace the body of each function with the real authorized
 * query (Supabase server client + RLS, or the API route). Keep the signature
 * and the pages keep working. Each function lists the rule it must enforce.
 * Do not import @/lib/preview/* anywhere else once a function is connected.
 */

import {
  PREVIEW_TODAY,
  findReferral,
  previewActivationRequests,
  previewAppointments,
  previewPrescriptions,
  previewReferrals,
  previewTimeBlocks,
} from "@/lib/preview/mock-data";
import { requireRole } from "@/lib/auth/guards";
import { formatDate, formatDateTime } from "@/lib/format";
import { loadMedicineCatalog } from "@/lib/medicine-catalog";
import { createClient } from "@/lib/supabase/server";
import type {
  PortalRole,
  PreviewAppointment,
  PreviewClinic,
  PreviewFacilityProfile,
  PreviewMedicineReport,
  PreviewPrescription,
  PreviewReferral,
  PreviewStaffAccount,
  PreviewTimeBlock,
} from "@/lib/preview/types";

import type { AssignedPatient, PendingActivationDetail, PendingActivationRow } from "./types";

/* ---------------- Account / workspace ---------------- */

/**
 * Signed-in staff account for the header and profile form. The role and profile
 * come from the authenticated Supabase user, never from the page URL.
 */
export async function getSignedInStaff(role: PortalRole): Promise<PreviewStaffAccount> {
  const trustedProfile = await requireRole(role);
  const supabase = await createClient();
  const [{ data: userData }, { data: profile, error }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("profiles").select("display_name").eq("id", trustedProfile.id).single(),
  ]);

  if (error) throw new Error("Unable to load the staff profile.");

  const email = userData.user?.email ?? "";
  const roleLabels: Record<PortalRole, string> = {
    clinic_staff: "Clinic Staff",
    doctor: "Doctor",
    pharmacy_staff: "Pharmacy Staff",
  };

  return {
    fullName: profile.display_name?.trim() || "TULAY staff member",
    username: email ? email.split("@")[0] : "staff",
    staffId: trustedProfile.id,
    email,
    roleLabel: roleLabels[role],
  };
}

/**
 * The clinic assigned to the signed-in Clinic Staff profile.
 */
export async function listAssignedClinics(): Promise<PreviewClinic[]> {
  const profile = await requireRole("clinic_staff");
  if (!profile.facilityId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("facilities")
    .select("id, name, has_dispensary")
    .eq("id", profile.facilityId)
    .eq("kind", "clinic")
    .maybeSingle();

  if (error) throw new Error("Unable to load the assigned clinic.");
  return data ? [{ id: data.id, name: data.name, hasDispensary: data.has_dispensary }] : [];
}

/**
 * Current Clinic Staff workplace from the trusted facility assignment.
 */
export async function getClinicWorkspace(): Promise<PreviewClinic | null> {
  return (await listAssignedClinics())[0] ?? null;
}

/** Facility assigned to a doctor or pharmacy account. */
export async function getAssignedFacility(role: "doctor" | "pharmacy_staff"): Promise<PreviewClinic | null> {
  const profile = await requireRole(role);
  if (!profile.facilityId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("facilities")
    .select("id, name, has_dispensary")
    .eq("id", profile.facilityId)
    .maybeSingle();

  if (error) throw new Error("Unable to load the assigned facility.");
  return data ? { id: data.id, name: data.name, hasDispensary: data.has_dispensary } : null;
}

/* ---------------- Doctor ---------------- */

/**
 * Patients assigned to the doctor's clinic (active and pending).
 * TODO(backend): RLS — only beneficiaries assigned to the caller's clinic.
 */
export async function listDoctorPatients(): Promise<AssignedPatient[]> {
  const beneficiaries = await loadAssignedBeneficiaries();
  return beneficiaries.map((patient) => ({
    id: patient.beneficiaryId,
    displayName: patient.displayName,
    firstName: patient.displayName.trim().split(/\s+/)[0] || patient.displayName,
    philHealthId: patient.mockPhilHealthId,
    status: patient.accountStatus,
    birthDate: formatDate(patient.birthDate),
    registeredAt: formatDateTime(patient.registeredAt),
    lastVisit: null,
  }));
}

/**
 * One patient record. Return null when not found OR not assigned to the
 * doctor's clinic (same response for both, so records can't be probed).
 */
export async function getPatientForDoctor(beneficiaryId: string): Promise<AssignedPatient | null> {
  return (await listDoctorPatients()).find((patient) => patient.id === beneficiaryId) ?? null;
}

/** Issued prescriptions for an assigned patient, newest first. Drafts excluded. */
export async function listPrescriptionsForPatient(beneficiaryId: string): Promise<PreviewPrescription[]> {
  const [patient, staff, facility] = await Promise.all([
    getPatientForDoctor(beneficiaryId),
    getSignedInStaff("doctor"),
    getAssignedFacility("doctor"),
  ]);
  if (!patient || !facility) return [];

  const supabase = await createClient();
  const { data: prescriptions, error } = await supabase
    .from("prescriptions")
    .select("id, mock_upsc, issued_at, doctor_id, clinic_id")
    .eq("beneficiary_id", beneficiaryId)
    .order("issued_at", { ascending: false });
  if (error) throw new Error("Unable to load the patient's prescriptions.");
  if (prescriptions.length === 0) return [];

  const prescriptionIds = prescriptions.map((row) => row.id);
  const { data: items, error: itemsError } = await supabase
    .from("prescription_items")
    .select("prescription_id, medicine_id, prescribed_quantity, instructions")
    .in("prescription_id", prescriptionIds);
  if (itemsError) throw new Error("Unable to load prescription items.");

  const catalog = await loadMedicineCatalog();
  if (!catalog.data) throw new Error(catalog.error.message);
  const medicines = new Map(catalog.data.map((medicine) => [medicine.id, medicine]));

  return prescriptions.map((row) => {
    const issued = new Date(row.issued_at);
    return {
      id: row.id,
      patientId: beneficiaryId,
      mockUpsc: row.mock_upsc,
      fileName: null,
      issuedAtIso: row.issued_at,
      issuedAt: formatDate(row.issued_at),
      issuedTime: Number.isNaN(issued.getTime())
        ? row.issued_at
        : issued.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Manila" }),
      doctorId: row.doctor_id,
      doctorName: staff.fullName,
      clinicId: row.clinic_id,
      clinicName: facility.name,
      note: "Structured e-reseta",
      items: items
        .filter((item) => item.prescription_id === row.id)
        .map((item) => {
          const medicine = medicines.get(item.medicine_id);
          return {
            medicineId: item.medicine_id,
            prescribedQuantity: item.prescribed_quantity,
            genericName: medicine?.genericName ?? "Medicine",
            strength: medicine?.strength ?? "",
            dosageForm: medicine?.dosageForm ?? "",
            instructions: item.instructions,
          };
        }),
    };
  });
}

/** Supported medicines the doctor can prescribe (formulary). */
export async function listPrescribableMedicines(): Promise<Array<{ id: string; label: string }>> {
  await requireRole("doctor");
  const catalog = await loadMedicineCatalog();
  if (!catalog.data) throw new Error(catalog.error.message);
  return catalog.data.map((medicine) => ({
    id: medicine.id,
    label: `${medicine.genericName} ${medicine.strength} · ${medicine.dosageForm}`,
  }));
}

export async function getDoctorDashboard(): Promise<{
  todayAppointments: PreviewAppointment[];
  incomingReferrals: number;
  awaitingReview: number;
  eresetaSentToday: number;
}> {
  const incoming = previewReferrals.filter((r) => r.direction === "incoming");
  return {
    todayAppointments: previewAppointments.filter((a) => a.date === PREVIEW_TODAY),
    incomingReferrals: incoming.length,
    awaitingReview: incoming.filter((r) => r.status === "Incoming · Pending").length,
    eresetaSentToday: previewPrescriptions.filter((rx) => rx.issuedAtIso.startsWith(PREVIEW_TODAY)).length,
  };
}

/*
 * MOCK-ONLY FEATURES (not in docs/api-contracts.md): appointments, time slots,
 * referrals. Approved as labelled mock UI. Connect only if the team adds them.
 */
export async function listAppointments(): Promise<{ today: string; appointments: PreviewAppointment[] }> {
  return { today: PREVIEW_TODAY, appointments: previewAppointments };
}

export async function listTimeBlocks(): Promise<PreviewTimeBlock[]> {
  return previewTimeBlocks;
}

export async function listReferrals(): Promise<PreviewReferral[]> {
  return previewReferrals;
}

export async function getReferral(id: string): Promise<PreviewReferral | null> {
  return findReferral(id) ?? null;
}

/* ---------------- Clinic Staff ---------------- */

/**
 * Walk-in activation queue for the staff member's clinic.
 * TODO(backend): RLS — pending beneficiaries assigned to the caller's clinic only.
 */
export async function listPendingActivations(): Promise<PendingActivationRow[]> {
  const beneficiaries = await loadAssignedBeneficiaries();
  return beneficiaries
    .filter((row) => row.accountStatus === "pending")
    .map((row) => ({
      beneficiaryId: row.beneficiaryId,
      displayName: row.displayName,
      mockPhilHealthId: row.mockPhilHealthId,
      registeredAt: row.registeredAt,
      recordMatch: "Matched · Pending",
    }));
}

/** Pending record for in-person review, or null if not pending at the caller's clinic. */
export async function getPendingActivation(beneficiaryId: string): Promise<PendingActivationDetail | null> {
  const [beneficiaries, clinic] = await Promise.all([
    loadAssignedBeneficiaries(),
    getClinicWorkspace(),
  ]);
  const patient = beneficiaries.find(
    (row) => row.beneficiaryId === beneficiaryId && row.accountStatus === "pending",
  );
  if (!patient?.verificationReference || !clinic) return null;

  return {
    lookup: {
      beneficiaryId: patient.beneficiaryId,
      displayName: patient.displayName,
      mockPhilHealthId: patient.mockPhilHealthId,
      birthDate: patient.birthDate,
      accountStatus: "pending",
      assignedClinicId: clinic.id,
    },
    registeredAt: patient.registeredAt,
    recordMatch: "Matched · Pending",
    selectedClinic: clinic.name,
    verificationReference: patient.verificationReference,
  };
}

interface AssignedBeneficiaryRow {
  beneficiaryId: string;
  displayName: string;
  mockPhilHealthId: string;
  birthDate: string;
  accountStatus: "pending" | "active";
  registeredAt: string;
  verificationReference: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadAssignedBeneficiaries(): Promise<AssignedBeneficiaryRow[]> {
  await requireRole("clinic_staff", "doctor");
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_assigned_beneficiaries");
  if (error) throw new Error("Unable to load assigned beneficiaries.");
  if (!Array.isArray(data)) return [];

  return data.flatMap((value) => {
    if (
      !isRecord(value) ||
      typeof value.beneficiaryId !== "string" ||
      typeof value.displayName !== "string" ||
      typeof value.mockPhilHealthId !== "string" ||
      typeof value.birthDate !== "string" ||
      (value.accountStatus !== "pending" && value.accountStatus !== "active") ||
      typeof value.registeredAt !== "string"
    ) {
      return [];
    }

    return [{
      beneficiaryId: value.beneficiaryId,
      displayName: value.displayName,
      mockPhilHealthId: value.mockPhilHealthId,
      birthDate: value.birthDate,
      accountStatus: value.accountStatus,
      registeredAt: value.registeredAt,
      verificationReference:
        typeof value.verificationReference === "string" ? value.verificationReference : null,
    }];
  });
}

/* ---------------- Availability (pharmacy + clinic dispensary) ---------------- */

/**
 * Availability reports for the caller's own facility.
 * TODO(backend): GET availability filtered to the caller's facility.
 */
export async function listOwnAvailability(scope: "pharmacy" | "clinic"): Promise<{
  facilityId: string;
  medicines: PreviewMedicineReport[];
}> {
  const profile = await requireRole(scope === "pharmacy" ? "pharmacy_staff" : "clinic_staff");
  if (!profile.facilityId) throw new Error("Your account is not assigned to a facility.");

  const [catalog, availability] = await Promise.all([
    loadMedicineCatalog(),
    (await createClient())
      .from("medicine_availability")
      .select("medicine_id, status, updated_at")
      .eq("facility_id", profile.facilityId),
  ]);
  if (!catalog.data) throw new Error(catalog.error.message);
  if (availability.error) throw new Error("Unable to load medicine availability.");

  const reports = new Map(availability.data.map((row) => [row.medicine_id, row]));
  return {
    facilityId: profile.facilityId,
    medicines: catalog.data.map((medicine) => {
      const report = reports.get(medicine.id);
      return {
        id: medicine.id,
        genericName: medicine.genericName,
        strength: medicine.strength,
        dosageForm: medicine.dosageForm,
        status: report?.status ?? "unreported",
        lastReport: report ? formatDateTime(report.updated_at) : "Not reported yet",
      };
    }),
  };
}

export async function getOwnFacilityProfile(): Promise<{ facilityId: string; profile: PreviewFacilityProfile }> {
  const assigned = await requireRole("pharmacy_staff");
  if (!assigned.facilityId) throw new Error("Your account is not assigned to a pharmacy.");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("facilities")
    .select("id, name, address, public_contact, operating_hours")
    .eq("id", assigned.facilityId)
    .eq("kind", "pharmacy")
    .maybeSingle();
  if (error || !data) throw new Error("Unable to load the assigned pharmacy.");
  return {
    facilityId: data.id,
    profile: {
      name: data.name,
      address: data.address,
      contact: data.public_contact ?? "",
      email: "",
      services: "YAKAP medicine dispensing",
      hours: data.operating_hours ?? "Not provided",
      notice: "",
      updatedAt: "from the facility directory",
    },
  };
}

/* ---------------- Preview helpers (delete when connected) ---------------- */

/** Demo values shown as hints so reviewers can try the lookups. Remove for launch. */
export async function getPreviewHints(): Promise<{ upsc: string; verificationReference: string } | null> {
  return {
    upsc: previewPrescriptions[0].mockUpsc,
    verificationReference: previewActivationRequests[0].verificationReference,
  };
}
