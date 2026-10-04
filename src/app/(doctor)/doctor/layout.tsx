import type { ReactNode } from "react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { getProfessionalContext } from "@/lib/auth/professional-context";

export default async function DoctorLayout({ children }: { children: ReactNode }) {
  const context = await getProfessionalContext("doctor");
  return (
    <WorkspaceShell workspaceLabel="Doctor workspace" facilityLabel={context.facilityName} userName={context.userName} roleLabel="Doctor" navLabel="Doctor workspace" navItems={[
      { href: "/doctor/dashboard", label: "Overview" },
      { href: "/doctor/patients", label: "Patients", match: ["/doctor/prescriptions"] },
    ]} profileHref="/doctor/profile" settingsHref="/doctor/settings">
      {children}
    </WorkspaceShell>
  );
}
