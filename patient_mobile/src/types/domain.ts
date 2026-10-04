export type UserRole = "beneficiary" | "clinic_staff" | "doctor" | "pharmacy_staff";
export type AccountStatus = "pending" | "active";

export interface PatientProfile {
  id: string;
  displayName: string | null;
  role: UserRole;
  accountStatus: AccountStatus | null;
  assignedClinicId: string | null;
  registryRecordId: string | null;
}

export type ActionResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: { code: string; message: string } };

export interface FacilityRecord {
  id: string;
  kind: "clinic" | "pharmacy";
  name: string;
  address: string;
  operatingHours: string | null;
  publicContact: string | null;
}

export interface PatientPrescription {
  id: string;
  mockUpsc: string;
  issuedAt: string;
  doctorName: string;
  clinicName: string;
  items: Array<{
    medicineId: string;
    genericName: string;
    strength: string;
    dosageForm: string;
    prescribedQuantity: number | null;
    instructions: string;
  }>;
}

export interface AvailabilityRecord {
  id: string;
  status: "available" | "out_of_stock";
  updatedAt: string;
  facility: FacilityRecord;
  medicine: {
    id: string;
    genericName: string;
    strength: string;
    dosageForm: string;
  };
}

export interface NotificationRecord {
  id: string;
  channel: "in_app" | "simulated_sms";
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}
