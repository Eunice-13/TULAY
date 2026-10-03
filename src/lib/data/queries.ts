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
  PREVIEW_PHARMACY_ID,
  PREVIEW_TODAY,
  findActivation,
  findPatient,
  findReferral,
  prescriptionsForPatient,
  previewActivationRequests,
  previewAppointments,
  previewClinicMedicines,
  previewClinicStaff,
  previewClinics,
  previewDoctor,
  previewPatients,
  previewPharmacyFacility,
  previewPharmacyMedicines,
  previewPharmacyStaff,
  previewPrescriptions,
  previewReferrals,
  previewTimeBlocks,
} from "@/lib/preview/mock-data";
import { getPreviewClinic } from "@/lib/preview/session";
import type {
  PortalRole,
  PreviewAppointment,
  PreviewClinic,
  PreviewFacilityProfile,
  PreviewMedicineReport,
  PreviewPatient,
  PreviewPrescription,
  PreviewReferral,
  PreviewStaffAccount,
  PreviewTimeBlock,
} from "@/lib/preview/types";

import type { PendingActivationDetail, PendingActivationRow } from "./types";

/* ---------------- Account / workspace ---------------- */

/**
 * Signed-in staff account for the header and profile form.
 * TODO(backend): read from getCurrentProfile() (src/lib/auth/current-profile.ts)
 * and throw/redirect if the trusted role is not `role`.
 */
export async function getSignedInStaff(role: PortalRole): Promise<PreviewStaffAccount> {
  if (role === "doctor") return previewDoctor;
  if (role === "clinic_staff") return previewClinicStaff;
  return previewPharmacyStaff;
}

/**
 * Clinics the signed-in Clinic Staff account is assigned to (workplace picker).
 * TODO(backend): only the caller's assignments, with the dispensing permission flag.
 */
export async function listAssignedClinics(): Promise<PreviewClinic[]> {
  return previewClinics;
}

/**
 * Current Clinic Staff workplace, or null if none is selected yet.
 * PREVIEW reads a demo cookie. TODO(backend): read the server-side assignment;
 * never trust a browser value for permissions.
 */
export async function getClinicWorkspace(): Promise<PreviewClinic | null> {
  return getPreviewClinic();
}

/* ---------------- Doctor ---------------- */

/**
 * Patients assigned to the doctor's clinic (active and pending).
 * TODO(backend): RLS — only beneficiaries assigned to the caller's clinic.
 */
export async function listDoctorPatients(): Promise<PreviewPatient[]> {
  return previewPatients;
}

/**
 * One patient record. Return null when not found OR not assigned to the
 * doctor's clinic (same response for both, so records can't be probed).
 */
export async function getPatientForDoctor(beneficiaryId: string): Promise<PreviewPatient | null> {
  return findPatient(beneficiaryId) ?? null;
}

/** Issued prescriptions for an assigned patient, newest first. Drafts excluded. */
export async function listPrescriptionsForPatient(beneficiaryId: string): Promise<PreviewPrescription[]> {
  return prescriptionsForPatient(beneficiaryId);
}

/** Supported medicines the doctor can prescribe (formulary). */
export async function listPrescribableMedicines(): Promise<Array<{ id: string; label: string }>> {
  return previewPharmacyMedicines.map((m) => ({
    id: m.id,
    label: `${m.genericName} ${m.strength} · ${m.dosageForm}`,
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
  return previewActivationRequests.flatMap((r) => {
    const p = findPatient(r.patientId);
    return p
      ? [
          {
            beneficiaryId: p.id,
            displayName: p.displayName,
            mockPhilHealthId: p.philHealthId,
            registeredAt: r.registeredAt,
            recordMatch: r.recordMatch,
          },
        ]
      : [];
  });
}

/** Pending record for in-person review, or null if not pending at the caller's clinic. */
export async function getPendingActivation(beneficiaryId: string): Promise<PendingActivationDetail | null> {
  const request = findActivation(beneficiaryId);
  const patient = request ? findPatient(request.patientId) : undefined;
  if (!request || !patient || patient.status !== "pending") return null;
  return {
    lookup: {
      beneficiaryId: patient.id,
      displayName: patient.displayName,
      mockPhilHealthId: patient.philHealthId,
      birthDate: patient.birthDate,
      accountStatus: "pending",
      assignedClinicId: "demo-clinic-a",
    },
    patient,
    registeredAt: request.registeredAt,
    recordMatch: request.recordMatch,
    selectedClinic: request.selectedClinic,
  };
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
  if (scope === "pharmacy") return { facilityId: PREVIEW_PHARMACY_ID, medicines: previewPharmacyMedicines };
  const clinic = await getPreviewClinic();
  return { facilityId: clinic?.id ?? "unknown", medicines: previewClinicMedicines };
}

export async function getOwnFacilityProfile(): Promise<{ facilityId: string; profile: PreviewFacilityProfile }> {
  return { facilityId: PREVIEW_PHARMACY_ID, profile: previewPharmacyFacility };
}

/* ---------------- Preview helpers (delete when connected) ---------------- */

/** Demo values shown as hints so reviewers can try the lookups. Remove for launch. */
export async function getPreviewHints(): Promise<{ upsc: string; verificationReference: string } | null> {
  return {
    upsc: previewPrescriptions[0].mockUpsc,
    verificationReference: previewActivationRequests[0].verificationReference,
  };
}
