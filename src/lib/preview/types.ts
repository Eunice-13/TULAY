/**
 * View-model types for the professional portal preview screens.
 * These describe what the UI renders. They are not database types and do not
 * grant permissions; the backend team will map real API responses onto them.
 */

import type { AvailabilityStatus, UserRole } from "@/types/domain";

/** Professional roles from domain.ts UserRole (beneficiary excluded). */
export type PortalRole = Exclude<UserRole, "beneficiary">;

export type PatientAccountStatus = "active" | "pending";

export interface PreviewPatient {
  id: string;
  lastName: string;
  firstName: string;
  middleInitial: string;
  affix: string | null;
  displayName: string;
  philHealthId: string;
  status: PatientAccountStatus;
  birthDate: string; // Display string
  sex: "Female" | "Male";
  age: number;
  street: string;
  barangay: string;
  cityProvincePostal: string;
  membership: string;
  email: string;
  contact: string | null;
  lastVisit: string | null;
  dependents: Array<{
    name: string;
    relationship: string;
    sex: "Female" | "Male";
    birthDate: string;
    email: string;
  }>;
}

export interface PreviewPrescription {
  id: string;
  patientId: string;
  mockUpsc: string; // Backend-generated in the real app.
  fileName: string | null;
  issuedAtIso: string; // ISO timestamp, as the API returns it.
  issuedAt: string; // Display string
  issuedTime: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  note: string;
  items: Array<{
    medicineId: string;
    prescribedQuantity: number | null;
    genericName: string;
    strength: string;
    dosageForm: string;
    instructions: string;
  }>;
}

export interface PreviewAppointment {
  id: string;
  patientId: string | null;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string;
  service: "Consultation" | "Screening" | "Laboratory test" | "Referred consultation";
  queue: string;
}

export interface PreviewTimeBlock {
  id: string;
  range: string;
  service: string;
  capacity: number;
}

export type ReferralStatus = "Draft escalation" | "Incoming · Pending" | "Accepted";
export type ReferralUrgency = "Routine" | "Priority" | "Urgent";

export interface PreviewReferral {
  id: string;
  patientId: string;
  patientName: string;
  direction: "incoming" | "sent";
  route: string;
  urgency: ReferralUrgency;
  status: ReferralStatus;
  nextStep: { label: string; href: string };
}

export interface PreviewActivationRequest {
  patientId: string;
  /** Random lookup reference shown on the patient's verification QR. */
  verificationReference: string;
  registeredAt: string;
  recordMatch: "Matched · Pending" | "Needs review";
  selectedClinic: string;
}

export interface PreviewClinic {
  id: string;
  name: string;
  hasDispensary: boolean;
}

/** Same values as domain.ts AvailabilityStatus; the UI labels "available" as "In stock". */
export type StockStatus = AvailabilityStatus;

export interface PreviewMedicineReport {
  /** Medicine id (domain.ts MedicineAvailability.medicineId). */
  id: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  status: StockStatus;
  lastReport: string;
}

export interface PreviewStaffAccount {
  fullName: string;
  username: string;
  staffId: string;
  email: string;
  roleLabel: string;
}

export interface PreviewFacilityProfile {
  name: string;
  address: string;
  contact: string;
  email: string;
  services: string;
  hours: string;
  notice: string;
  updatedAt: string;
}
