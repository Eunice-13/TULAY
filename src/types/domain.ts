/** Shared planning types. These do not implement permissions or database tables. */
export type UserRole = "beneficiary" | "clinic_staff" | "doctor" | "pharmacy_staff";
export type AccountStatus = "pending" | "active";
export type AvailabilityStatus = "available" | "out_of_stock";
export type FacilityKind = "clinic" | "pharmacy";

export interface CurrentProfile {
   id: string;
  role: UserRole;
  accountStatus: AccountStatus | null;
  facilityId: string | null;
  assignedClinicId: string | null;
} 

export interface MockMatchInput {
  philHealthId: string;
  birthDate: string; // YYYY-MM-DD; validate on the server.
  firstName: string;
  lastName: string;
}

export interface MedicineAvailability {
  facilityId: string;
  medicineId: string;
  status: AvailabilityStatus;
  updatedAt: string; // ISO timestamp; never imply guaranteed stock.
}

export interface PrescriptionItem {
  medicineId: string;
  instructions: string;
  prescribedQuantity?: number; // Prescription content only, not dispensed/remaining quantity.
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  mockUpsc: string; // Backend-generated; lookup alone does not authorize dispensing.
  issuedAt: string;
  items: PrescriptionItem[];
}

export interface MatchBeneficiaryRequest extends MockMatchInput {}

export interface MatchBeneficiaryResponse {
  matched: boolean;
  message?: string;
  clinicPath?: "select_clinic" | "confirm_assigned_clinic";
  assignedClinicId?: string | null;
  accountStatus?: "pending";
}

export interface SetBeneficiaryClinicRequest {
  clinicId: string;
}

export interface SetBeneficiaryClinicResponse {
  assignedClinicId: string;
  accountStatus: "pending";
  verificationReference: string;
}

export interface PendingBeneficiaryLookup {
  beneficiaryId: string;
  displayName: string;
  mockPhilHealthId: string;
  birthDate: string;
  accountStatus: "pending";
  assignedClinicId: string;
}

export interface ActivateBeneficiaryResponse {
  beneficiaryId: string;
  accountStatus: "active";
  activatedAt: string;
}

export interface IssuePrescriptionRequest {
  beneficiaryId: string;
  items: Array<{
    medicineId: string;
    prescribedQuantity?: number;
    instructions: string;
  }>;
}

export interface IssuePrescriptionResponse {
  prescriptionId: string;
  mockUpsc: string;
  issuedAt: string;
}

export interface PrescriptionLookupResponse {
  prescriptionId: string;
  mockUpsc: string;
  issuedAt: string;
  beneficiary: { id: string; displayName: string };
  doctor: { id: string; displayName: string };
  clinic: { id: string; name: string };
  items: Array<{
    medicineId: string;
    genericName: string;
    strength: string;
    dosageForm: string;
    prescribedQuantity: number | null;
    instructions: string;
  }>;
  notice: string;
}

export type BeneficiaryPrescription = Omit<
  PrescriptionLookupResponse,
  "beneficiary" | "notice"
>;

export type ApiResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: { code: string; message: string } };

  export type AuthActionResult =
  | {
      success: true;
      message: string;
      requiresEmailConfirmation?: boolean;
    }
  | {
      success: false;
      message: string;
    };


