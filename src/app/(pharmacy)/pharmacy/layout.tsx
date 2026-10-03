import type { ReactNode } from "react";

import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { getSignedInStaff } from "@/lib/data/queries";

/*
 * Pharmacy Staff workspace (Figma PH-series screens).
 * PREVIEW: no session or role check yet. Before launch this layout must call
 * requireRole("pharmacy_staff") and read the assigned pharmacy from the server.
 */
export default async function PharmacyLayout({ children }: { children: ReactNode }) {
  const previewPharmacyStaff = await getSignedInStaff("pharmacy_staff");
  return (
    <WorkspaceShell
      workspaceLabel="Pharmacy workspace"
      facilityLabel="Your assigned pharmacy"
      userName={previewPharmacyStaff.fullName}
      roleLabel={previewPharmacyStaff.roleLabel}
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
