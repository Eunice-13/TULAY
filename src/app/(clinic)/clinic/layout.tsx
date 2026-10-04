import type { ReactNode } from "react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { getProfessionalContext } from "@/lib/auth/professional-context";

export default async function ClinicLayout({ children }: { children: ReactNode }) {
  const context = await getProfessionalContext("clinic_staff");
  return (
    <WorkspaceShell workspaceLabel="Clinic Staff workspace" facilityLabel={context.facilityName} userName={context.userName} roleLabel="Clinic Staff" navLabel="Clinic Staff workspace" navItems={[
      { href: "/clinic/dashboard", label: "Overview" },
      { href: "/clinic/activations", label: "Verify / Activate" },
    ]} profileHref="/clinic/profile" settingsHref="/clinic/settings">
      {children}
    </WorkspaceShell>
  );
}
