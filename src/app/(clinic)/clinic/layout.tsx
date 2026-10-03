import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { WorkspaceShell } from "@/components/layout/workspace-shell";
import type { NavItem } from "@/components/layout/primary-nav";
import { getClinicWorkspace, getSignedInStaff } from "@/lib/data/queries";

/*
 * Clinic Staff workspace (Figma CS-series screens).
 * PREVIEW: the clinic comes from a demo cookie set on /login/workplace. Before
 * launch this must use requireRole("clinic_staff") and the server-side clinic
 * assignment + dispensing permission, never a browser-editable value.
 */
export default async function ClinicLayout({ children }: { children: ReactNode }) {
  const clinic = await getClinicWorkspace();
  if (!clinic) redirect("/login/workplace");
  const previewClinicStaff = await getSignedInStaff("clinic_staff");

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
      userName={previewClinicStaff.fullName}
      roleLabel={previewClinicStaff.roleLabel}
      navLabel="Clinic Staff workspace"
      navItems={navItems}
      profileHref="/clinic/profile"
      settingsHref="/clinic/settings"
    >
      {children}
    </WorkspaceShell>
  );
}
