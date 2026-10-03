import "server-only";

import type {
  PreviewActivationRequest,
  PreviewAppointment,
  PreviewClinic,
  PreviewFacilityProfile,
  PreviewMedicineReport,
  PreviewPatient,
  PreviewPrescription,
  PreviewReferral,
  PreviewStaffAccount,
  PreviewTimeBlock,
} from "./types";

/*
 * FICTIONAL DEMO DATA for the professional portal preview.
 *
 * - Every person, ID, address and code below is invented. No real patient data.
 * - This module is server-only so the fixtures never ship in a browser bundle.
 * - The backend team replaces these reads with authorized API/RLS queries.
 *   Nothing here enforces roles, organization assignment or account status.
 */

export const PREVIEW_TODAY = "2026-10-04";

export const previewClinics: PreviewClinic[] = [
  { id: "demo-clinic-a", name: "Demo Clinic A", hasDispensary: true },
  { id: "demo-clinic-b", name: "Demo Clinic B", hasDispensary: false },
];

export const previewDoctor: PreviewStaffAccount = {
  fullName: "Dr. Andrea Reyes",
  username: "andrea.reyes",
  staffId: "DEMO-MD-001",
  email: "andrea.reyes@example.test",
  roleLabel: "Doctor",
};

export const previewClinicStaff: PreviewStaffAccount = {
  fullName: "Jamie Cruz",
  username: "jamie.cruz",
  staffId: "DEMO-CS-001",
  email: "jamie.cruz@example.test",
  roleLabel: "Clinic Staff",
};

export const previewPharmacyStaff: PreviewStaffAccount = {
  fullName: "Alex Cruz",
  username: "alex.cruz",
  staffId: "DEMO-PHARM-001",
  email: "alex.cruz@example.test",
  roleLabel: "Pharmacy Staff",
};

function patient(
  p: Omit<PreviewPatient, "displayName" | "dependents"> &
    Partial<Pick<PreviewPatient, "dependents">>,
): PreviewPatient {
  return {
    ...p,
    displayName: `${p.firstName} ${p.lastName}`,
    dependents: p.dependents ?? [],
  };
}

export const previewPatients: PreviewPatient[] = [
  patient({
    id: "pt-maria",
    lastName: "Santos",
    firstName: "Maria",
    middleInitial: "L.",
    affix: null,
    philHealthId: "DEMO-PH-000421",
    status: "active",
    birthDate: "12 May 1968",
    sex: "Female",
    age: 58,
    street: "Sample Street",
    barangay: "Sample Barangay",
    cityProvincePostal: "Quezon City / Metro Manila / 1100",
    membership: "Indirect contributor",
    email: "maria.santos@example.test",
    contact: null,
    lastVisit: "04 Oct 2026",
    dependents: [
      {
        name: "Santos, Isabel M.",
        relationship: "Daughter",
        sex: "Female",
        birthDate: "18 August 2010",
        email: "isabel.santos@example.test",
      },
    ],
  }),
  patient({
    id: "pt-jose",
    lastName: "Dela Cruz",
    firstName: "Jose",
    middleInitial: "R.",
    affix: null,
    philHealthId: "DEMO-PH-000422",
    status: "active",
    birthDate: "03 March 1975",
    sex: "Male",
    age: 51,
    street: "Sample Avenue",
    barangay: "Sample Barangay",
    cityProvincePostal: "Quezon City / Metro Manila / 1100",
    membership: "Direct contributor",
    email: "jose.delacruz@example.test",
    contact: null,
    lastVisit: "02 Oct 2026",
  }),
  patient({
    id: "pt-ana",
    lastName: "Garcia",
    firstName: "Ana",
    middleInitial: "M.",
    affix: null,
    philHealthId: "DEMO-PH-000423",
    status: "pending",
    birthDate: "15 June 1990",
    sex: "Female",
    age: 36,
    street: "Sample Street",
    barangay: "Sample Barangay",
    cityProvincePostal: "Quezon City / Metro Manila / 1100",
    membership: "Direct contributor",
    email: "ana.garcia@example.test",
    contact: null,
    lastVisit: null,
  }),
  patient({
    id: "pt-luis",
    lastName: "Ramos",
    firstName: "Luis",
    middleInitial: "T.",
    affix: "Jr.",
    philHealthId: "DEMO-PH-000424",
    status: "active",
    birthDate: "22 November 1962",
    sex: "Male",
    age: 63,
    street: "Sample Road",
    barangay: "Sample Barangay",
    cityProvincePostal: "Quezon City / Metro Manila / 1100",
    membership: "Senior citizen",
    email: "luis.ramos@example.test",
    contact: null,
    lastVisit: "30 Sep 2026",
  }),
  patient({
    id: "pt-elena",
    lastName: "Mendoza",
    firstName: "Elena",
    middleInitial: "S.",
    affix: null,
    philHealthId: "DEMO-PH-000425",
    status: "active",
    birthDate: "09 January 1984",
    sex: "Female",
    age: 42,
    street: "Sample Lane",
    barangay: "Sample Barangay",
    cityProvincePostal: "Quezon City / Metro Manila / 1100",
    membership: "Indirect contributor",
    email: "elena.mendoza@example.test",
    contact: null,
    lastVisit: "28 Sep 2026",
  }),
  patient({
    id: "pt-paolo",
    lastName: "Reyes",
    firstName: "Paolo",
    middleInitial: "D.",
    affix: null,
    philHealthId: "DEMO-PH-000426",
    status: "pending",
    birthDate: "27 July 1999",
    sex: "Male",
    age: 27,
    street: "Sample Street",
    barangay: "Sample Barangay",
    cityProvincePostal: "Quezon City / Metro Manila / 1100",
    membership: "Direct contributor",
    email: "paolo.reyes@example.test",
    contact: null,
    lastVisit: null,
  }),
  patient({
    id: "pt-nina",
    lastName: "Flores",
    firstName: "Nina",
    middleInitial: "G.",
    affix: null,
    philHealthId: "DEMO-PH-000427",
    status: "pending",
    birthDate: "30 April 1995",
    sex: "Female",
    age: 31,
    street: "Sample Street",
    barangay: "Sample Barangay",
    cityProvincePostal: "Quezon City / Metro Manila / 1100",
    membership: "Indirect contributor",
    email: "nina.flores@example.test",
    contact: null,
    lastVisit: null,
  }),
];

/** Walk-in activation requests. No verification appointments are scheduled. */
export const previewActivationRequests: PreviewActivationRequest[] = [
  {
    patientId: "pt-ana",
    verificationReference: "VREF-7Q2K-M9XA",
    registeredAt: "03 Oct 2026",
    recordMatch: "Matched · Pending",
    selectedClinic: "Your assigned facility",
  },
  {
    patientId: "pt-nina",
    verificationReference: "VREF-3HD8-T4LP",
    registeredAt: "03 Oct 2026",
    recordMatch: "Matched · Pending",
    selectedClinic: "Your assigned facility",
  },
  {
    patientId: "pt-paolo",
    verificationReference: "VREF-W6NB-2CRE",
    registeredAt: "02 Oct 2026",
    recordMatch: "Needs review",
    selectedClinic: "Your assigned facility",
  },
];

export const previewPrescriptions: PreviewPrescription[] = [
  {
    id: "rx-maria-1",
    patientId: "pt-maria",
    mockUpsc: "DEMO-UPSC-A7K9Q2",
    fileName: "Santos-04-Oct-2026.pdf",
    issuedAtIso: "2026-10-04T10:24:00+08:00",
    issuedAt: "04 Oct 2026",
    issuedTime: "10:24 AM",
    doctorId: "doc-andrea",
    doctorName: "Dr. Andrea Reyes",
    clinicId: "demo-clinic-a",
    clinicName: "Demo Clinic A",
    note: "Your e-reseta from today's physical consultation is attached below.",
    items: [
      {
        medicineId: "med-01",
        prescribedQuantity: 30,
        genericName: "Amlodipine",
        strength: "5 mg",
        dosageForm: "Tablet",
        instructions: "1 tablet once daily",
      },
    ],
  },
  {
    id: "rx-jose-1",
    patientId: "pt-jose",
    mockUpsc: "DEMO-UPSC-M3X8T5",
    fileName: "DelaCruz-02-Oct-2026.pdf",
    issuedAtIso: "2026-10-02T14:10:00+08:00",
    issuedAt: "02 Oct 2026",
    issuedTime: "02:10 PM",
    doctorId: "doc-andrea",
    doctorName: "Dr. Andrea Reyes",
    clinicId: "demo-clinic-a",
    clinicName: "Demo Clinic A",
    note: "Continue your maintenance medicine as instructed.",
    items: [
      {
        medicineId: "med-03",
        prescribedQuantity: 60,
        genericName: "Metformin",
        strength: "500 mg",
        dosageForm: "Tablet",
        instructions: "1 tablet twice daily with meals",
      },
    ],
  },
];

export const previewAppointments: PreviewAppointment[] = [
  { id: "ap-1", patientId: "pt-maria", patientName: "Maria Santos", date: "2026-10-04", time: "10:30 AM", service: "Consultation", queue: "03" },
  { id: "ap-2", patientId: "pt-jose", patientName: "Jose Dela Cruz", date: "2026-10-04", time: "11:00 AM", service: "Screening", queue: "04" },
  { id: "ap-3", patientId: "pt-luis", patientName: "Luis Ramos", date: "2026-10-04", time: "11:30 AM", service: "Laboratory test", queue: "05" },
  { id: "ap-4", patientId: "pt-elena", patientName: "Elena Mendoza", date: "2026-10-04", time: "01:00 PM", service: "Consultation", queue: "06" },
  { id: "ap-5", patientId: "pt-maria", patientName: "Maria Santos", date: "2026-10-05", time: "09:00 AM", service: "Referred consultation", queue: "01" },
  { id: "ap-6", patientId: "pt-luis", patientName: "Luis Ramos", date: "2026-10-06", time: "10:00 AM", service: "Consultation", queue: "02" },
];

export const previewTimeBlocks: PreviewTimeBlock[] = [
  { id: "tb-1", range: "08:00–10:00", service: "Consultation", capacity: 8 },
  { id: "tb-2", range: "10:00–12:00", service: "Screening", capacity: 6 },
  { id: "tb-3", range: "01:00–03:00", service: "Laboratory", capacity: 6 },
  { id: "tb-4", range: "03:00–05:00", service: "Consultation", capacity: 8 },
];

export const previewReferrals: PreviewReferral[] = [
  {
    id: "REF-041",
    patientId: "pt-maria",
    patientName: "Maria Santos",
    direction: "sent",
    route: "Clinic → Hospital",
    urgency: "Priority",
    status: "Draft escalation",
    nextStep: { label: "Review and send", href: "/doctor/referrals/escalate?patient=pt-maria" },
  },
  {
    id: "REF-042",
    patientId: "pt-jose",
    patientName: "Jose Dela Cruz",
    direction: "incoming",
    route: "Community health worker → Clinic",
    urgency: "Routine",
    status: "Incoming · Pending",
    nextStep: { label: "Review findings", href: "/doctor/referrals/new?patient=pt-jose" },
  },
  {
    id: "REF-043",
    patientId: "pt-luis",
    patientName: "Luis Ramos",
    direction: "incoming",
    route: "Community health worker → Clinic",
    urgency: "Routine",
    status: "Incoming · Pending",
    nextStep: { label: "Book appointment", href: "/doctor/referrals/REF-043/book" },
  },
  {
    id: "REF-044",
    patientId: "pt-elena",
    patientName: "Elena Mendoza",
    direction: "sent",
    route: "Clinic → Hospital",
    urgency: "Routine",
    status: "Accepted",
    nextStep: { label: "View record", href: "/doctor/patients/pt-elena" },
  },
];

const medicineSeed: Array<[string, string, string, PreviewMedicineReport["status"], string]> = [
  ["Amlodipine", "5 mg", "Tablet", "available", "04 Oct · 10:15 AM"],
  ["Losartan", "50 mg", "Tablet", "available", "04 Oct · 10:15 AM"],
  ["Metformin", "500 mg", "Tablet", "out_of_stock", "04 Oct · 09:00 AM"],
  ["Salbutamol", "100 mcg", "Inhaler", "available", "03 Oct · 04:30 PM"],
  ["Paracetamol", "500 mg", "Tablet", "available", "03 Oct · 04:30 PM"],
  ["Atorvastatin", "20 mg", "Tablet", "out_of_stock", "03 Oct · 04:30 PM"],
  ["Amoxicillin", "500 mg", "Capsule", "available", "03 Oct · 02:00 PM"],
  ["Gliclazide", "80 mg", "Tablet", "available", "03 Oct · 02:00 PM"],
  ["Simvastatin", "20 mg", "Tablet", "out_of_stock", "02 Oct · 11:20 AM"],
  ["Hydrochlorothiazide", "25 mg", "Tablet", "available", "02 Oct · 11:20 AM"],
  ["Cetirizine", "10 mg", "Tablet", "available", "01 Oct · 03:45 PM"],
  ["Oral rehydration salts", "20.5 g", "Sachet", "available", "01 Oct · 03:45 PM"],
];

export const previewPharmacyMedicines: PreviewMedicineReport[] = medicineSeed.map(
  ([genericName, strength, dosageForm, status, lastReport], index) => ({
    id: `med-${String(index + 1).padStart(2, "0")}`,
    genericName,
    strength,
    dosageForm,
    status,
    lastReport,
  }),
);

/** Clinic dispensary entries use generic demo labels, as in the Figma CS4 screen. */
export const previewClinicMedicines: PreviewMedicineReport[] = previewPharmacyMedicines
  .slice(0, 6)
  .map((m, index) => ({
    ...m,
    status: index === 2 || index === 5 ? "out_of_stock" : "available",
    lastReport: index < 3 ? "Clinic · 04 Oct, 10:15 AM" : "Clinic · 03 Oct, 04:30 PM",
  }));

export const PREVIEW_PHARMACY_ID = "demo-pharmacy-01";

export const previewPharmacyFacility: PreviewFacilityProfile = {
  name: "Demo Pharmacy 01",
  address: "Sample Street, Sample Barangay, Quezon City",
  contact: "(02) 0000-0000",
  email: "demo.pharmacy@example.test",
  services: "Medicine dispensing",
  hours: "Monday–Saturday · 08:00 AM–05:00 PM",
  notice: "",
  updatedAt: "04 Oct 2026 · 10:15 AM",
};

/* ---------- Lookup helpers (server-only) ---------- */

export function findPatient(id: string): PreviewPatient | undefined {
  return previewPatients.find((p) => p.id === id);
}

export function prescriptionsForPatient(patientId: string): PreviewPrescription[] {
  return previewPrescriptions.filter((rx) => rx.patientId === patientId);
}

/** Exact, case-insensitive UPSC match. Viewing never consumes the code. */
export function findPrescriptionByUpsc(code: string): PreviewPrescription | undefined {
  const normalized = code.trim().toUpperCase();
  return previewPrescriptions.find((rx) => rx.mockUpsc === normalized);
}

export function findActivationByReference(
  reference: string,
): PreviewActivationRequest | undefined {
  const normalized = reference.trim().toUpperCase();
  return previewActivationRequests.find((r) => r.verificationReference === normalized);
}

export function findActivation(patientId: string): PreviewActivationRequest | undefined {
  return previewActivationRequests.find((r) => r.patientId === patientId);
}

export function findReferral(id: string): PreviewReferral | undefined {
  return previewReferrals.find((r) => r.id === id);
}
