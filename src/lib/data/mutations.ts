"use server";

/*
 * WRITES and restricted LOOKUPS for the professional portal (server actions).
 * Every form in the UI calls one of these and handles three outcomes:
 *   { data }                         -> real success screen
 *   { error: { code: NOT_CONNECTED } } -> same success screen, nothing saved (see result.ts)
 *   { error: { code, message } }     -> error message shown to the user
 *
 * BACKEND TEAM: replace each body with the real call (Supabase RPC from
 * supabase/migrations/*_restricted_operations.sql or the API route in
 * docs/api-contracts.md). Validate the session and TRUSTED role/organization on
 * the server; never use a role or facility id from the request as authority.
 * Return safe messages only (no raw database errors).
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  findActivationByReference,
  findPatient,
  findPrescriptionByUpsc,
  previewClinics,
  previewPharmacyMedicines,
} from "@/lib/preview/mock-data";
import { PREVIEW_CLINIC_COOKIE } from "@/lib/preview/session";
import type { PortalRole } from "@/lib/preview/types";
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
  SignInResult,
  UpdateAvailabilityRequest,
  UpdateFacilityProfileRequest,
  UpdateStaffProfileRequest,
} from "./types";

const ROLES: PortalRole[] = ["doctor", "clinic_staff", "pharmacy_staff"];

/* ---------------- Auth ---------------- */

/**
 * Professional sign-in. The design asks for username + staff ID + password.
 * TODO(backend): resolve username/staff ID to the account's email on the server,
 * then call supabase.auth.signInWithPassword (see signIn in src/app/(auth)/actions.ts).
 * Return `next` from the TRUSTED role, not from `requestedRole`.
 */
export async function signInProfessional(
  requestedRole: PortalRole,
  input: { username: string; staffId: string; password: string },
): Promise<ApiResult<SignInResult>> {
  if (!ROLES.includes(requestedRole)) return fail("INVALID_ROLE", "Choose a workspace.");
  if (!input.username.trim() || !input.staffId.trim() || !input.password) {
    return fail("VALIDATION", "Enter your username, staff ID and password.");
  }
  return notConnected("Sign-in");
}

/**
 * Clinic Staff workplace selection (after sign-in).
 * PREVIEW stores a demo cookie. TODO(backend): verify the clinic is one of the
 * caller's assignments and store the choice server-side.
 */
export async function selectWorkplace(formData: FormData): Promise<void> {
  const clinic = previewClinics.find((c) => c.id === formData.get("clinicId"));
  if (!clinic) redirect("/login/workplace?error=1");
  const store = await cookies();
  store.set(PREVIEW_CLINIC_COOKIE, clinic.id, { httpOnly: true, sameSite: "lax", path: "/" });
  redirect("/clinic/dashboard");
}

/** TODO(backend): also call supabase.auth.signOut(). */
export async function signOutProfessional(): Promise<void> {
  const store = await cookies();
  store.delete(PREVIEW_CLINIC_COOKIE);
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
  const patient = findPatient(req.beneficiaryId);
  if (!patient) return fail("NOT_FOUND", "Patient not found at your clinic.");
  if (patient.status !== "active") return fail("ACCOUNT_NOT_ACTIVE", "This patient's account is not active yet.");
  if (req.items.length === 0) return fail("VALIDATION", "Add at least one medicine.");
  for (const item of req.items) {
    if (!previewPharmacyMedicines.some((m) => m.id === item.medicineId)) {
      return fail("VALIDATION", "Select a supported medicine.");
    }
    if (!item.instructions.trim()) return fail("VALIDATION", "Enter the dosage instructions.");
  }
  return notConnected("Sending an e-reseta");
}

/**
 * POST /api/pharmacy/prescriptions/lookup — exact mock UPSC, authorized
 * pharmacy or dispensing clinic staff only. Returns only required fields.
 * Must NOT mark the code as consumed. PREVIEW reads fictional fixtures.
 */
export async function lookupPrescription(code: string): Promise<ApiResult<PrescriptionLookupResult>> {
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,32}$/.test(normalized)) {
    return fail("VALIDATION", "Enter the full UPSC, for example DEMO-UPSC-A7K9Q2.");
  }
  const rx = findPrescriptionByUpsc(normalized);
  const patient = rx ? findPatient(rx.patientId) : undefined;
  if (!rx || !patient) return fail("NOT_FOUND", "No e-reseta matches that UPSC. Check the code with the patient.");

  return ok({
    prescriptionId: rx.id,
    mockUpsc: rx.mockUpsc,
    issuedAt: rx.issuedAtIso,
    beneficiary: { id: patient.id, displayName: patient.displayName, mockPhilHealthId: patient.philHealthId },
    doctor: { id: rx.doctorId, displayName: rx.doctorName },
    clinic: { id: rx.clinicId, name: rx.clinicName },
    items: rx.items.map((i) => ({
      medicineId: i.medicineId,
      genericName: i.genericName,
      strength: i.strength,
      dosageForm: i.dosageForm,
      prescribedQuantity: i.prescribedQuantity,
      instructions: i.instructions,
    })),
    notice:
      "Viewing a UPSC does not consume the prescription or prove its validity. If the full prescription cannot be supplied, staff provide a manual note/slip.",
    attachmentFileName: rx.fileName,
  });
}

/* ---------------- Activation ---------------- */

/**
 * POST /api/clinic/verification/lookup — random reference from the patient's QR.
 * Assigned clinic staff only. Locating a record never activates it.
 */
export async function lookupVerificationReference(
  reference: string,
): Promise<ApiResult<PendingBeneficiaryLookup>> {
  const match = findActivationByReference(reference);
  const patient = match ? findPatient(match.patientId) : undefined;
  if (!match || !patient || patient.status !== "pending") {
    return fail("NOT_FOUND", "No pending account uses that reference at your clinic. Check the patient's QR or reference.");
  }
  return ok({
    beneficiaryId: patient.id,
    displayName: patient.displayName,
    mockPhilHealthId: patient.philHealthId,
    birthDate: patient.birthDate,
    accountStatus: "pending",
    assignedClinicId: "demo-clinic-a",
  });
}

/**
 * POST /api/clinic/activation — explicit in-person approval by assigned staff.
 * Backend records approving staff and timestamp.
 */
export async function activateBeneficiary(
  beneficiaryId: string,
): Promise<ApiResult<ActivateBeneficiaryResponse>> {
  if (!findPatient(beneficiaryId)) return fail("NOT_FOUND", "Pending record not found at your clinic.");
  return notConnected("Account activation");
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
  return notConnected("Saving a stock report");
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
