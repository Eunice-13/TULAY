import type { ReactNode } from "react";

import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { requirePortalRole } from "@/lib/auth/portal";
import { getAssignedFacility, getSignedInStaff } from "@/lib/data/queries";

/** Doctor workspace protected by the trusted Supabase profile role and facility. */
export default async function DoctorLayout({ children }: { children: ReactNode }) {
  await requirePortalRole("doctor");
  const [doctor, facility] = await Promise.all([
    getSignedInStaff("doctor"),
    getAssignedFacility("doctor"),
  ]);
  return (
    <WorkspaceShell
      workspaceLabel="Doctor workspace"
      facilityLabel={facility?.name ?? "Assigned clinic"}
      userName={doctor.fullName}
      roleLabel={doctor.roleLabel}
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
