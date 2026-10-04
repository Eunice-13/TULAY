/*
 * Request/response types used by the professional portal that are NOT yet in
 * src/types/domain.ts. Each one is a proposal for the backend team: confirm it,
 * then move it into domain.ts (shared file, coordinate the change).
 * Types that already exist in domain.ts are imported from there, not redefined.
 */
import type { AvailabilityStatus, PendingBeneficiaryLookup, PrescriptionLookupResponse } from "@/types/domain";

import type { PortalRole } from "@/lib/preview/types";

export type RecordMatchStatus = "Matched · Pending" | "Needs review";

/**
 * PROPOSED addition to PrescriptionLookupResponse. The Figma review screen shows
 * the PhilHealth ID (for identity confirmation) and the attached file name.
 * Drop these fields if the team decides lookup must return less.
 */
export type PrescriptionLookupResult = PrescriptionLookupResponse & {
  beneficiary: PrescriptionLookupResponse["beneficiary"] & { mockPhilHealthId?: string };
  attachmentFileName?: string | null;
};

/** PROPOSED: denial is in the design (CS2D) but not in docs/api-contracts.md. */
export interface DenyActivationRequest {
  beneficiaryId: string;
  reason: string;
  nextStep: string;
}

export interface DenyActivationResponse {
  beneficiaryId: string;
  accountStatus: "pending";
  deniedAt: string;
}

/** Body for PATCH /api/medicines/availability. facilityId must match the caller's assignment. */
export interface UpdateAvailabilityRequest {
  facilityId: string;
  medicineId: string;
  status: AvailabilityStatus;
}

/** Sign-in result: the server decides where to send the user from the trusted role. */
export interface SignInResult {
  role: PortalRole;
  next: string;
}

export interface ProfessionalCredentials {
  email: string;
  password: string;
}

export interface UpdateStaffProfileRequest {
  fullName: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateFacilityProfileRequest {
  facilityId: string;
  name: string;
  address: string;
  contact: string;
  email: string;
  hours: string;
  notice: string;
}

/** Row for the Clinic Staff walk-in activation queue. */
export interface PendingActivationRow {
  beneficiaryId: string;
  displayName: string;
  mockPhilHealthId: string;
  registeredAt: string;
  recordMatch: RecordMatchStatus;
}

/** Full pending record shown during in-person review (extends PendingBeneficiaryLookup). */
export interface PendingActivationDetail {
  lookup: PendingBeneficiaryLookup;
  registeredAt: string;
  recordMatch: RecordMatchStatus;
  selectedClinic: string;
  verificationReference: string;
}

/** Patient fields the clinic-assignment RPC is allowed to expose to doctors. */
export interface AssignedPatient {
  id: string;
  displayName: string;
  firstName: string;
  philHealthId: string;
  status: "active" | "pending";
  birthDate: string;
  registeredAt: string;
  lastVisit: string | null;
}
