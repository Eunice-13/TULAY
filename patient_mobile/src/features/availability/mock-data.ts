/** Sample pharmacy listings with provider-reported stock (P3 pharmacy screens). Fictional. */
export type StockStatus = "in-stock" | "out-of-stock";

export type PharmacyListing = {
  id: string;
  name: string;
  distance: string;
  hours: string;
  stock: StockStatus;
  updated: string;
};

export const PHARMACIES: PharmacyListing[] = [
  {
    id: "demo-care-pharmacy",
    name: "Demo Care Pharmacy",
    distance: "0.8 km • Sample Avenue",
    hours: "Daily • 8:00 AM–8:00 PM",
    stock: "in-stock",
    updated: "Updated October 4, 9:00 AM",
  },
  {
    id: "demo-health-pharmacy",
    name: "Demo Health Pharmacy",
    distance: "0.8 km • Sample Avenue",
    hours: "Daily • 8:00 AM–8:00 PM",
    stock: "out-of-stock",
    updated: "Updated October 4, 8:30 AM",
  },
];

export function findPharmacy(id: string): PharmacyListing | undefined {
  return PHARMACIES.find((pharmacy) => pharmacy.id === id);
}
