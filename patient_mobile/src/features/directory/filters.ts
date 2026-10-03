/** Filter options for P3 • Search filters / Pending clinic filters (mock). */
export const FILTER_OPTIONS = {
  city: ["Quezon City", "Manila", "Pasig City", "Caloocan City"],
  distance: ["Within 1 km", "Within 3 km", "Within 5 km", "Within 10 km"],
  providerType: ["Clinics and pharmacies", "Clinics only", "Pharmacies only"],
  hours: ["Open now", "Open today", "Any time"],
} as const;

export const DEFAULT_FILTERS = {
  city: "Quezon City",
  distance: "Within 5 km",
  providerType: "Clinics and pharmacies",
  hours: "Open now",
} as const;
