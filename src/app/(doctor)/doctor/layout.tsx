import type { ReactNode } from "react";

import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { getSignedInStaff } from "@/lib/data/queries";

/*
 * Doctor workspace (Figma Page 3, M-series screens).
 * PREVIEW: no session or role check yet. Before launch this layout must call the
 * server-side guard (requireRole("doctor")) and read the assigned facility.
 */
export default async function DoctorLayout({ children }: { children: ReactNode }) {
  const previewDoctor = await getSignedInStaff("doctor");
  return (
    <WorkspaceShell
      workspaceLabel="Doctor workspace"
      facilityLabel="Your assigned facility"
      userName={previewDoctor.fullName}
      roleLabel={previewDoctor.roleLabel}
      navLabel="Doctor workspace"
      navItems={[
        { href: "/doctor/dashboard", label: "Overview" },
        { href: "/doctor/patients", label: "Patients", match: ["/doctor/prescriptions"] },
        { href: "/doctor/appointments", label: "Appointments" },
        { href: "/doctor/referrals", label: "Referrals" },
      ]}
      profileHref="/doctor/profile"
      settingsHref="/doctor/settings"
    >
      {children}
    </WorkspaceShell>
  );
}
