import type { ReactNode } from "react";

import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { requirePortalRole } from "@/lib/auth/portal";
import { getAssignedFacility, getSignedInStaff } from "@/lib/data/queries";

/** Pharmacy workspace protected by the trusted Supabase profile role and facility. */
export default async function PharmacyLayout({ children }: { children: ReactNode }) {
  await requirePortalRole("pharmacy_staff");
  const [pharmacyStaff, facility] = await Promise.all([
    getSignedInStaff("pharmacy_staff"),
    getAssignedFacility("pharmacy_staff"),
  ]);
  return (
    <WorkspaceShell
      workspaceLabel="Pharmacy workspace"
      facilityLabel={facility?.name ?? "Assigned pharmacy"}
      userName={pharmacyStaff.fullName}
      roleLabel={pharmacyStaff.roleLabel}
      navLabel="Pharmacy workspace"
      navItems={[
        { href: "/pharmacy/dashboard", label: "Overview" },
        { href: "/pharmacy/lookup", label: "Prescriptions" },
        { href: "/pharmacy/stock", label: "Medicine stock" },
        { href: "/pharmacy/facility", label: "Facility" },
      ]}
      profileHref="/pharmacy/profile"
      settingsHref="/pharmacy/settings"
    >
      {children}
    </WorkspaceShell>
  );
}
