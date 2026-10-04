"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import { activateBeneficiary as activateByReference, lookupPendingBeneficiary } from "@/app/(clinic)/verification-actions";
import { issuePrescription as issueDoctorPrescription } from "@/app/(doctor)/prescription-actions";
import { setMedicineAvailability } from "@/app/(pharmacy)/availability-actions";
import { lookupPrescriptionByUpsc } from "@/app/(pharmacy)/prescription-actions";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { createClient } from "@/lib/supabase/server";
import type { PortalRole } from "@/lib/preview/types";
import type { ActivateBeneficiaryResponse, ApiResult, IssuePrescriptionRequest, IssuePrescriptionResponse, MedicineAvailability, PendingBeneficiaryLookup } from "@/types/domain";
import { fail } from "./result";
import type { ChangePasswordRequest, DenyActivationRequest, DenyActivationResponse, PrescriptionLookupResult, SignInResult, UpdateAvailabilityRequest, UpdateFacilityProfileRequest, UpdateStaffProfileRequest } from "./types";

const REFERENCE_COOKIE = "tulay_pending_reference";

export async function signInProfessional(
  requestedRole: PortalRole,
  input: { email: string; password: string },
): Promise<ApiResult<SignInResult>> {
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@") || !input.password) return fail("VALIDATION", "Enter your assigned email and password.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: input.password });
  if (error) return fail("INVALID_CREDENTIALS", "Invalid email or password.");

  const profile = await getCurrentProfile();
  if (!profile || profile.role === "beneficiary" || profile.role !== requestedRole) {
    await supabase.auth.signOut();
    return fail("ROLE_MISMATCH", "This account is not assigned to the selected professional role.");
  }

  const next: Record<PortalRole, string> = {
    doctor: "/doctor/dashboard",
    clinic_staff: "/clinic/dashboard",
    pharmacy_staff: "/pharmacy/dashboard",
  };
  return { data: { role: profile.role, next: next[profile.role] } };
}

export async function selectWorkplace(): Promise<void> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "clinic_staff" || !profile.facilityId) redirect("/login");
  redirect("/clinic/dashboard");
}

export async function signOutProfessional(): Promise<void> {
  await signOut();
  redirect("/login");
}

export function issuePrescription(req: IssuePrescriptionRequest): Promise<ApiResult<IssuePrescriptionResponse>> {
  return issueDoctorPrescription(req);
}

export async function lookupPrescription(code: string): Promise<ApiResult<PrescriptionLookupResult>> {
  const formData = new FormData();
  formData.set("mockUpsc", code);
  return lookupPrescriptionByUpsc(formData);
}

export async function lookupVerificationReference(reference: string): Promise<ApiResult<PendingBeneficiaryLookup>> {
  const formData = new FormData();
  formData.set("verificationReference", reference);
  const result = await lookupPendingBeneficiary(formData);
  if (result.data) {
    const store = await cookies();
    store.set(REFERENCE_COOKIE, reference.trim().toUpperCase(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
  }
  return result;
}

export async function activateBeneficiary(_beneficiaryId: string): Promise<ApiResult<ActivateBeneficiaryResponse>> {
  const store = await cookies();
  const reference = store.get(REFERENCE_COOKIE)?.value;
  if (!reference) return fail("REFERENCE_REQUIRED", "Look up the patient's verification reference again.");
  const formData = new FormData();
  formData.set("verificationReference", reference);
  const result = await activateByReference(formData);
  if (result.data) store.delete(REFERENCE_COOKIE);
  return result;
}

export async function denyActivation(_req: DenyActivationRequest): Promise<ApiResult<DenyActivationResponse>> {
  return fail("NOT_IMPLEMENTED", "Activation denial is not stored by the current database schema.");
}

export async function updateAvailability(req: UpdateAvailabilityRequest): Promise<ApiResult<MedicineAvailability>> {
  return setMedicineAvailability({ medicineId: req.medicineId, status: req.status });
}

export async function updateStaffProfile(_req: UpdateStaffProfileRequest): Promise<ApiResult<{ updatedAt: string }>> {
  return fail("NOT_IMPLEMENTED", "Profile editing is not available in the current database schema.");
}

export async function changePassword(_req: ChangePasswordRequest): Promise<ApiResult<{ changedAt: string }>> {
  return fail("NOT_IMPLEMENTED", "Password changes are not available from this screen.");
}

export async function updateFacilityProfile(_req: UpdateFacilityProfileRequest): Promise<ApiResult<{ updatedAt: string }>> {
  return fail("NOT_IMPLEMENTED", "Facility editing is not available in the current database schema.");
}
