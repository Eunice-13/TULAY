/** Mock e-reseta (P7). Not valid for dispensing; not connected to GAMOT. */
export type PrescribedMedicine = { name: string; lines: [string, string] };

export type Prescription = {
  id: string;
  title: string;
  status: string;
  issuedOn: string;
  doctor: string;
  clinic: string;
  validity: string;
  upsc: string;
  patientName: string;
  medicines: PrescribedMedicine[];
};

export const PRESCRIPTIONS: Prescription[] = [
  {
    id: "demo-ereseta",
    title: "Demo prescription",
    status: "Active - Mock Prescription",
    issuedOn: "October 4, 2026",
    doctor: "Dr. Ana Demo",
    clinic: "Demo Community Clinic",
    validity: "Demo validity: October 4–10, 2026",
    upsc: "TULAY-DEMO-UPSC-001",
    patientName: "Maria A. Dela Cruz",
    medicines: [
      {
        name: "Demo medicine A • 500 mg",
        lines: ["Tablet • Quantity prescribed: 30", "Dosage and instructions: as recorded by the demo doctor."],
      },
      {
        name: "Demo medicine B • 10 mg",
        lines: ["Tablet • Quantity prescribed: 14", "Follow the prescription’s recorded instructions."],
      },
    ],
  },
];

export function findPrescription(id: string): Prescription | undefined {
  return PRESCRIPTIONS.find((rx) => rx.id === id);
}
