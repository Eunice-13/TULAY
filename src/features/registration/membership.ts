export type MembershipCategoryKey = "direct" | "indirect";

export const MEMBERSHIP_CATEGORIES: Record<
  MembershipCategoryKey,
  { label: string; title: string; cta: string; members: string[]; surface: "bg-soft" | "bg-canvas" }
> = {
  direct: {
    label: "Direct Contributor",
    title: "Direct Contributors",
    cta: "Select Direct Contributor",
    surface: "bg-soft",
    members: [
      "Government and Private Employees",
      "Self-Earning Individuals or Professional Practitioners",
      "Kasambahay",
      "Lifetime Members (Retired, at least 60 years old, with 120 months contribution)",
      "Overseas Filipino Workers (OFWs)",
    ],
  },
  indirect: {
    label: "Indirect Contributor",
    title: "Indirect Contributors",
    cta: "Select Indirect Contributor",
    surface: "bg-canvas",
    members: [
      "Indigents",
      "Beneficiaries of Pantawid Pamilyang Pilipino Program (4Ps)",
      "Senior Citizens",
      "Persons with Disability (PWDs)",
      "Solo Parents",
      "Infants & Children under 21 years old",
    ],
  },
};

export function isMembershipCategory(value: string | undefined): value is MembershipCategoryKey {
  return value === "direct" || value === "indirect";
}
