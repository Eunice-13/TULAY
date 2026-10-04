"use server";

/*
 * WRITES and restricted LOOKUPS for the professional portal (server actions).
 * Connected operations delegate to role-checked server actions and Supabase
 * RLS/RPCs. Proposed settings that are outside the MVP return NOT_CONNECTED and
 * remain visibly unsaved.
 */

import { redirect } from "next/navigation";

import {
  activateBeneficiary as activateBeneficiaryAction,
  lookupPendingBeneficiary,
} from "@/app/(clinic)/verification-actions";
import { issuePrescription as issuePrescriptionAction } from "@/app/(doctor)/prescription-actions";
import { setMedicineAvailability } from "@/app/(pharmacy)/availability-actions";
import { lookupPrescriptionByUpsc } from "@/app/(pharmacy)/prescription-actions";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import type { PortalRole } from "@/lib/preview/types";
import { createClient } from "@/lib/supabase/server";
import type {
  ActivateBeneficiaryResponse,
  ApiResult,
  IssuePrescriptionRequest,
  IssuePrescriptionResponse,
  MedicineAvailability,
  PendingBeneficiaryLookup,
} from "@/types/domain";

import { fail, notConnected, ok } from "./result";
import type {
  ChangePasswordRequest,
  DenyActivationRequest,
  DenyActivationResponse,
  PrescriptionLookupResult,
  ProfessionalCredentials,
  SignInResult,
  UpdateAvailabilityRequest,
  UpdateFacilityProfileRequest,
  UpdateStaffProfileRequest,
} from "./types";

const ROLES: PortalRole[] = ["doctor", "clinic_staff", "pharmacy_staff"];

/* ---------------- Auth ---------------- */

/**
 * Professional sign-in uses Supabase Auth. The requested role only identifies
 * the login screen; navigation is decided from the trusted profiles row.
 */
export async function signInProfessional(
  requestedRole: PortalRole,
  input: ProfessionalCredentials,
): Promise<ApiResult<SignInResult>> {
  if (!ROLES.includes(requestedRole)) return fail("INVALID_ROLE", "Choose a workspace.");
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@") || !input.password) {
    return fail("VALIDATION", "Enter a valid email and password.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error || !data.user) {
    return fail("INVALID_CREDENTIALS", "Email or password does not match.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, facility_id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role === "beneficiary") {
    await supabase.auth.signOut();
    return fail("PROFESSIONAL_ACCOUNT_REQUIRED", "Use an assigned professional account.");
  }

  if (profile.role !== requestedRole) {
    await supabase.auth.signOut();
    return fail("ROLE_MISMATCH", "This account is not assigned to the selected workspace.");
  }

  if (!profile.facility_id) {
    await supabase.auth.signOut();
    return fail("FACILITY_REQUIRED", "This account is not assigned to a facility.");
  }

  const nextByRole: Record<PortalRole, string> = {
    clinic_staff: "/clinic/dashboard",
    doctor: "/doctor/dashboard",
    pharmacy_staff: "/pharmacy/dashboard",
  };

  return ok({ role: profile.role, next: nextByRole[profile.role] });
}

/**
 * Kept for compatibility with the existing workplace page. A staff member's
 * facility comes from their trusted profile and cannot be chosen client-side.
 */
export async function selectWorkplace(formData: FormData): Promise<void> {
  const profile = await getCurrentProfile();
  if (profile?.role !== "clinic_staff") redirect("/login?role=clinic_staff");
  if (!profile.facilityId || profile.facilityId !== formData.get("clinicId")) {
    redirect("/login/workplace?error=1");
  }
  redirect("/clinic/dashboard");
}

export async function signOutProfessional(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/* ---------------- Prescriptions ---------------- */

/**
 * POST /api/prescriptions — assigned doctor, ACTIVE patient at their clinic.
 * The backend generates the unique random mock UPSC and returns it.
 * Note: the optional e-reseta file attachment is not in the contract yet.
 */
export async function issuePrescription(
  req: IssuePrescriptionRequest,
): Promise<ApiResult<IssuePrescriptionResponse>> {
  return issuePrescriptionAction(req);
}

/**
 * POST /api/pharmacy/prescriptions/lookup — exact mock UPSC, authorized
 * pharmacy or dispensing clinic staff only. Returns only required fields.
 * Must NOT mark the code as consumed.
 */
export async function lookupPrescription(code: string): Promise<ApiResult<PrescriptionLookupResult>> {
  const normalized = code.trim().toUpperCase();
  const formData = new FormData();
  formData.set("mockUpsc", normalized);
  return lookupPrescriptionByUpsc(formData);
}

/* ---------------- Activation ---------------- */

/**
 * POST /api/clinic/verification/lookup — random reference from the patient's QR.
 * Assigned clinic staff only. Locating a record never activates it.
 */
export async function lookupVerificationReference(
  reference: string,
): Promise<ApiResult<PendingBeneficiaryLookup>> {
  const formData = new FormData();
  formData.set("verificationReference", reference);
  return lookupPendingBeneficiary(formData);
}

/**
 * POST /api/clinic/activation — explicit in-person approval by assigned staff.
 * Backend records approving staff and timestamp.
 */
export async function activateBeneficiary(
  verificationReference: string,
): Promise<ApiResult<ActivateBeneficiaryResponse>> {
  const formData = new FormData();
  formData.set("verificationReference", verificationReference);
  return activateBeneficiaryAction(formData);
}

/** PROPOSED operation (see DenyActivationRequest in ./types). */
export async function denyActivation(req: DenyActivationRequest): Promise<ApiResult<DenyActivationResponse>> {
  if (!req.reason || !req.nextStep.trim()) {
    return fail("VALIDATION", "Choose a reason and describe the next step for the patient.");
  }
  return notConnected("Activation denial");
}

/* ---------------- Availability ---------------- */

/**
 * PATCH /api/medicines/availability — staff of that facility only.
 * Out of stock -> available must create one deduplicated restock event.
 */
export async function updateAvailability(
  req: UpdateAvailabilityRequest,
): Promise<ApiResult<MedicineAvailability>> {
  if (req.status !== "available" && req.status !== "out_of_stock") {
    return fail("VALIDATION", "Choose In stock or Out of stock.");
  }
  return setMedicineAvailability({ medicineId: req.medicineId, status: req.status });
}

/* ---------------- Account settings (not in the contract yet) ---------------- */

export async function updateStaffProfile(req: UpdateStaffProfileRequest): Promise<ApiResult<{ updatedAt: string }>> {
  if (!req.fullName.trim()) return fail("VALIDATION", "Enter your full name.");
  return notConnected("Saving your profile");
}

export async function changePassword(req: ChangePasswordRequest): Promise<ApiResult<{ changedAt: string }>> {
  if (req.newPassword.length < 8) return fail("VALIDATION", "Use at least 8 characters.");
  return notConnected("Changing your password");
}

export async function updateFacilityProfile(
  req: UpdateFacilityProfileRequest,
): Promise<ApiResult<{ updatedAt: string }>> {
  if (!req.name.trim() || !req.address.trim()) return fail("VALIDATION", "Enter the facility name and address.");
  return notConnected("Saving the facility profile");
}
