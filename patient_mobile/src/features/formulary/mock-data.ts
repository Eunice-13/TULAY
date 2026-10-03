/** Mock formulary entries (P4 • Formulary checker, 222:3408). Fictional. */
export type DispensedAt = "Clinic" | "Pharmacy";

export type FormularyEntry = {
  id: string;
  name: string;
  form: string;
  dispensedAt: DispensedAt;
  status: string;
  updated?: string;
};

export const FORMULARY_COUNTS: Record<DispensedAt, number> = { Clinic: 21, Pharmacy: 54 };

export const FORMULARY: FormularyEntry[] = [
  {
    id: "demo-medicine-a",
    name: "Demo Medicine A • 500 mg",
    form: "Tablet",
    dispensedAt: "Pharmacy",
    status: "In Stock • Provider-reported",
    updated: "Updated October 4, 9:00 AM",
  },
  {
    id: "demo-medicine-b",
    name: "Demo Medicine B • 10 mg",
    form: "Tablet",
    dispensedAt: "Clinic",
    status: "In Stock • Provider-reported",
    updated: "Updated October 4, 8:30 AM",
  },
  {
    id: "demo-medicine-c",
    name: "Demo medicine C",
    form: "Capsule",
    dispensedAt: "Pharmacy",
    status: "Out of Stock • Reported",
  },
];
