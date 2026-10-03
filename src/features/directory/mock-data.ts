/** Illustrative facility records — fictional, not verified accreditation claims. */
export type Facility = {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  address: string;
  hours: string;
  services?: string;
  profile?: {
    openToday: string;
    fullAddress: string;
    contact: string;
    services: string[];
    notice: string;
    source: string;
    updatedAt: string;
  };
};

export const CLINICS: Facility[] = [
  {
    id: "demo-community-clinic",
    name: "Demo Community Clinic",
    type: "Clinic • Demo Facility",
    distanceKm: 1.2,
    address: "Sample Street, Quezon City",
    hours: "Mon–Fri, 8:00 AM–5:00 PM",
    services: "Primary care and laboratory services",
    profile: {
      openToday: "Open Today • 8:00 AM–5:00 PM",
      fullAddress: "123 Sample Street, Quezon City",
      contact: "Demo contact information",
      services: ["Primary care consultation", "Doctor-ordered laboratory tests", "Clinic-dispensed medicines"],
      notice: "Walk in during opening hours for enrollment. Ask staff what documents to bring.",
      source: "Source: illustrative demo listing",
      updatedAt: "Last updated: October 4, 2026, 9:00 AM",
    },
  },
  {
    id: "demo-health-center",
    name: "Demo Health Center",
    type: "Clinic • Demo facility",
    distanceKm: 2.4,
    address: "Example Avenue, Quezon City",
    hours: "Mon–Sat, 8:00 AM–4:00 PM",
  },
];

/** Active directory listing (P3 • Provider directory, 222:3199). */
export type DirectoryEntry = {
  id: string;
  name: string;
  kind: "clinic" | "pharmacy";
  lines: string[];
};

export const DIRECTORY: DirectoryEntry[] = [
  {
    id: "demo-community-clinic",
    name: "Demo Community Clinic",
    kind: "clinic",
    lines: ["Clinic • Demo facility", "1.2 km • Quezon City", "Mon–Fri, 8:00 AM–5:00 PM"],
  },
  {
    id: "demo-care-pharmacy",
    name: "Demo Care Pharmacy",
    kind: "pharmacy",
    lines: ["Pharmacy • Demo facility", "0.8 km • Sample Avenue", "Daily, 8:00 AM–8:00 PM"],
  },
];

export function findClinic(id: string): Facility | undefined {
  return CLINICS.find((clinic) => clinic.id === id);
}
