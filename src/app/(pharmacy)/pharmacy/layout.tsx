import type { ReactNode } from "react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { getProfessionalContext } from "@/lib/auth/professional-context";

export default async function PharmacyLayout({ children }: { children: ReactNode }) {
  const context = await getProfessionalContext("pharmacy_staff");
  return (
    <WorkspaceShell workspaceLabel="Pharmacy workspace" facilityLabel={context.facilityName} userName={context.userName} roleLabel="Pharmacy Staff" navLabel="Pharmacy workspace" navItems={[
      { href: "/pharmacy/dashboard", label: "Overview" },
      { href: "/pharmacy/lookup", label: "Prescriptions" },
      { href: "/pharmacy/stock", label: "Medicine availability" },
    ]} profileHref="/pharmacy/profile" settingsHref="/pharmacy/settings">
      {children}
    </WorkspaceShell>
  );
}
