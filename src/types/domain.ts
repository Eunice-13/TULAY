/** Shared planning types. These do not implement permissions or database tables. */
export type UserRole = "beneficiary" | "clinic_staff" | "doctor" | "pharmacy_staff";
export type AccountStatus = "pending" | "active";
export type AvailabilityStatus = "available" | "out_of_stock";
export type FacilityKind = "clinic" | "pharmacy";
export type MedicineCoverageGroup =
  | "yakap_essential_21"
  | "gamot_additional_54";
export type NotificationChannel = "in_app" | "simulated_sms";

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

export interface AvailabilityListing {
  id: string;
  facility: {
    id: string;
    name: string;
    kind: FacilityKind;
    address: string;
  };
  medicine: {
    id: string;
    genericName: string;
    strength: string;
    dosageForm: string;
    coverageGroup: MedicineCoverageGroup;
  };
  status: AvailabilityStatus;
  updatedAt: string;
  statusChangedAt: string;
}

export interface MedicineCatalogItem {
  id: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  coverageGroup: MedicineCoverageGroup;
}

export interface NearbyYakapClinic {
  id: string;
  name: string;
  address: string;
  operatingHours: string | null;
  publicContact: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number;
  maxDistanceKm: number;
}

export interface RestockSubscription {
  id: string;
  facilityId: string;
  medicineId: string;
  createdAt: string;
}

export interface BeneficiaryNotification {
  id: string;
  channel: NotificationChannel;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface UpdateMedicineAvailabilityRequest {
  medicineId: string;
  status: AvailabilityStatus;
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
  latitude?: number;
  longitude?: number;
}

export interface SetBeneficiaryClinicResponse {
  assignedClinicId: string;
  accountStatus: "pending";
  verificationReference: string;
  proximityRuleApplied: boolean;
  distanceKm: number | null;
  maxDistanceKm: number | null;
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


