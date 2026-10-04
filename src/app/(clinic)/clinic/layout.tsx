import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { WorkspaceShell } from "@/components/layout/workspace-shell";
import type { NavItem } from "@/components/layout/primary-nav";
import { requirePortalRole } from "@/lib/auth/portal";
import { getClinicWorkspace, getSignedInStaff } from "@/lib/data/queries";

/** Clinic Staff workspace protected by the trusted Supabase profile role and facility. */
export default async function ClinicLayout({ children }: { children: ReactNode }) {
  await requirePortalRole("clinic_staff");
  const clinic = await getClinicWorkspace();
  if (!clinic) redirect("/login?role=clinic_staff&error=facility");
  const clinicStaff = await getSignedInStaff("clinic_staff");

  const navItems: NavItem[] = [
    { href: "/clinic/dashboard", label: "Overview", match: ["/clinic/facility"] },
    { href: "/clinic/activations", label: "Verify / Activate" },
  ];
  if (clinic.hasDispensary) {
    navItems.push(
      { href: "/clinic/dispensing", label: "Prescription review" },
      { href: "/clinic/availability", label: "Clinic availability" },
    );
  }

  return (
    <WorkspaceShell
      workspaceLabel="Clinic Staff workspace"
      facilityLabel={`${clinic.name} · ${clinic.hasDispensary ? "With dispensary" : "Without dispensary"}`}
      userName={clinicStaff.fullName}
      roleLabel={clinicStaff.roleLabel}
      navLabel="Clinic Staff workspace"
      navItems={navItems}
      profileHref="/clinic/profile"
      settingsHref="/clinic/settings"
    >
      {children}
    </WorkspaceShell>
  );
}
