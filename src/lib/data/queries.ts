import "server-only";

import { cookies } from "next/headers";
import { getProfessionalContext } from "@/lib/auth/professional-context";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type { PendingActivationDetail, PendingActivationRow } from "./types";
import type { PortalRole, PreviewAppointment, PreviewClinic, PreviewFacilityProfile, PreviewMedicineReport, PreviewPatient, PreviewPrescription, PreviewReferral, PreviewStaffAccount, PreviewTimeBlock } from "@/lib/preview/types";

type Row = Record<string, unknown>;
const REFERENCE_COOKIE = "tulay_pending_reference";
function obj(value: unknown): Row { return Array.isArray(value) ? obj(value[0]) : typeof value === "object" && value !== null ? value as Row : {}; }
function names(displayName: string) { const parts = displayName.trim().split(/\s+/); return { first: parts[0] ?? "Patient", last: parts.slice(1).join(" ") || "Not stored" }; }
function patient(row: Row): PreviewPatient {
  const displayName = typeof row.display_name === "string" ? row.display_name : "Patient";
  const parsed = names(displayName);
  return { id: String(row.id), firstName: parsed.first, lastName: parsed.last, middleInitial: "", affix: null, displayName,
    philHealthId: typeof row.mock_philhealth_id === "string" ? row.mock_philhealth_id : "Protected registry value",
    status: row.account_status === "active" ? "active" : "pending", birthDate: typeof row.birth_date === "string" ? row.birth_date : "Not stored",
    sex: "Not stored", age: null, street: "Not stored", barangay: "Not stored", cityProvincePostal: "Not stored",
    membership: "Not stored", email: "Not exposed", contact: null, lastVisit: null, dependents: [] };
}

export async function getSignedInStaff(role: PortalRole): Promise<PreviewStaffAccount> {
  const context = await getProfessionalContext(role);
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { fullName: context.userName, username: data.user?.email ?? "", staffId: context.profile.id,
    email: data.user?.email ?? "", roleLabel: role === "clinic_staff" ? "Clinic Staff" : role === "pharmacy_staff" ? "Pharmacy Staff" : "Doctor" };
}

export async function listAssignedClinics(): Promise<PreviewClinic[]> {
  const context = await getProfessionalContext("clinic_staff");
  return [{ id: context.profile.facilityId!, name: context.facilityName, hasDispensary: false }];
}

export async function getClinicWorkspace(): Promise<PreviewClinic | null> {
  const clinics = await listAssignedClinics(); return clinics[0] ?? null;
}

export async function listDoctorPatients(): Promise<PreviewPatient[]> {
  await requireRole("doctor");
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("id, display_name, account_status").eq("role", "beneficiary").order("display_name");
  if (error) throw new Error("Unable to load assigned patients.");
  return (data ?? []).map((row: Row) => patient(row));
}

export async function getPatientForDoctor(id: string): Promise<PreviewPatient | null> {
  await requireRole("doctor");
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("id, display_name, account_status").eq("id", id).eq("role", "beneficiary").maybeSingle();
  if (error) throw new Error("Unable to load the assigned patient.");
  return data ? patient(data as Row) : null;
}

function rx(row: Row): PreviewPrescription {
  const doctor = obj(row.doctor); const clinic = obj(row.clinic); const items = Array.isArray(row.items) ? row.items : [];
  const issued = String(row.issued_at);
  return { id: String(row.id), patientId: String(row.beneficiary_id), mockUpsc: String(row.mock_upsc), fileName: null,
    issuedAtIso: issued, issuedAt: new Date(issued).toLocaleDateString(), issuedTime: new Date(issued).toLocaleTimeString(),
    doctorId: String(row.doctor_id), doctorName: String(doctor.display_name ?? "Assigned doctor"), clinicId: String(row.clinic_id), clinicName: String(clinic.name ?? "Assigned clinic"), note: "",
    items: items.map((value) => { const item = obj(value); const medicine = obj(item.medicine); return { medicineId: String(item.medicine_id), prescribedQuantity: typeof item.prescribed_quantity === "number" ? item.prescribed_quantity : null, genericName: String(medicine.generic_name), strength: String(medicine.strength), dosageForm: String(medicine.dosage_form), instructions: String(item.instructions) }; }) };
}

export async function listPrescriptionsForPatient(beneficiaryId: string): Promise<PreviewPrescription[]> {
  await requireRole("doctor"); const supabase = await createClient();
  const { data, error } = await supabase.from("prescriptions").select(`id, beneficiary_id, doctor_id, clinic_id, mock_upsc, issued_at, doctor:profiles!prescriptions_doctor_id_fkey(display_name), clinic:facilities!prescriptions_clinic_id_fkey(name), items:prescription_items(medicine_id, prescribed_quantity, instructions, medicine:medicines!prescription_items_medicine_id_fkey(generic_name, strength, dosage_form))`).eq("beneficiary_id", beneficiaryId).order("issued_at", { ascending: false });
  if (error) throw new Error("Unable to load patient prescriptions."); return (data ?? []).map((row: Row) => rx(row));
}

export async function listPrescribableMedicines() { await requireRole("doctor"); const supabase = await createClient(); const { data, error } = await supabase.from("medicines").select("id, generic_name, strength, dosage_form").order("generic_name"); if (error) throw new Error("Unable to load medicines."); return (data ?? []).map((m: Row) => ({ id: String(m.id), label: `${m.generic_name} ${m.strength} • ${m.dosage_form}` })); }

export async function getDoctorDashboard() { const context = await getProfessionalContext("doctor"); const supabase = await createClient(); const start = new Date(); start.setHours(0,0,0,0); const { count, error } = await supabase.from("prescriptions").select("id", { count: "exact", head: true }).eq("clinic_id", context.profile.facilityId!).gte("issued_at", start.toISOString()); if (error) throw new Error("Unable to load dashboard data."); return { todayAppointments: [] as PreviewAppointment[], incomingReferrals: 0, awaitingReview: 0, eresetaSentToday: count ?? 0 }; }
export async function listAppointments(): Promise<{ today: string; appointments: PreviewAppointment[] }> { await requireRole("doctor"); return { today: new Date().toISOString().slice(0,10), appointments: [] }; }
export async function listTimeBlocks(): Promise<PreviewTimeBlock[]> { await requireRole("doctor"); return []; }
export async function listReferrals(): Promise<PreviewReferral[]> { await requireRole("doctor"); return []; }
export async function getReferral(_id: string): Promise<PreviewReferral | null> { await requireRole("doctor"); return null; }

export async function listPendingActivations(): Promise<PendingActivationRow[]> { const context = await getProfessionalContext("clinic_staff"); const supabase = await createClient(); const { data, error } = await supabase.from("profiles").select("id, display_name, created_at").eq("role", "beneficiary").eq("account_status", "pending").eq("assigned_clinic_id", context.profile.facilityId!); if (error) throw new Error("Unable to load pending patients."); return (data ?? []).map((p: Row) => ({ beneficiaryId: String(p.id), displayName: String(p.display_name ?? "Pending patient"), mockPhilHealthId: "Enter reference to review", registeredAt: String(p.created_at), recordMatch: "Matched · Pending" })); }

export async function getPendingActivation(beneficiaryId: string): Promise<PendingActivationDetail | null> { await requireRole("clinic_staff"); const reference = (await cookies()).get(REFERENCE_COOKIE)?.value; if (!reference) return null; const formData = new FormData(); formData.set("verificationReference", reference); const { lookupPendingBeneficiary } = await import("@/app/(clinic)/verification-actions"); const result = await lookupPendingBeneficiary(formData); if (!result.data || result.data.beneficiaryId !== beneficiaryId) return null; const context = await getProfessionalContext("clinic_staff"); const p = patient({ id: result.data.beneficiaryId, display_name: result.data.displayName, account_status: "pending", mock_philhealth_id: result.data.mockPhilHealthId, birth_date: result.data.birthDate }); return { lookup: result.data, patient: p, registeredAt: "Pending database record", recordMatch: "Matched · Pending", selectedClinic: context.facilityName }; }

export async function listOwnAvailability(_scope: "pharmacy" | "clinic"): Promise<{ facilityId: string; medicines: PreviewMedicineReport[] }> { const profile = await requireRole("pharmacy_staff"); const supabase = await createClient(); const { data, error } = await supabase.from("medicine_availability").select(`medicine_id, status, updated_at, medicine:medicines!medicine_availability_medicine_id_fkey(generic_name, strength, dosage_form)`).eq("facility_id", profile.facilityId!); if (error) throw new Error("Unable to load facility availability."); return { facilityId: profile.facilityId!, medicines: (data ?? []).map((r: Row) => { const m = obj(r.medicine); return { id: String(r.medicine_id), genericName: String(m.generic_name), strength: String(m.strength), dosageForm: String(m.dosage_form), status: r.status as "available" | "out_of_stock", lastReport: new Date(String(r.updated_at)).toLocaleString() }; }) }; }

export async function getOwnFacilityProfile(): Promise<{ facilityId: string; profile: PreviewFacilityProfile }> { const context = await getProfessionalContext("pharmacy_staff"); const supabase = await createClient(); const { data, error } = await supabase.from("facilities").select("address, operating_hours, public_contact").eq("id", context.profile.facilityId!).single(); if (error) throw new Error("Unable to load facility."); return { facilityId: context.profile.facilityId!, profile: { name: context.facilityName, address: data.address, contact: data.public_contact ?? "Not provided", email: "Not stored", services: "Medicine availability reporting", hours: data.operating_hours ?? "Not provided", notice: "", updatedAt: "Live database record" } }; }
export async function getPreviewHints(): Promise<{ upsc: string; verificationReference: string } | null> { return null; }
