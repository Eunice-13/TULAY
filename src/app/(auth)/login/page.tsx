import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import { buttonClasses } from "@/components/ui/button";
import { BuildingIcon, PillIcon } from "@/components/ui/icons";
import { PortalLayout } from "@/features/auth/portal-layout";
import { SignInForm } from "@/features/auth/sign-in-form";
import type { PortalRole } from "@/lib/preview/types";

export const metadata: Metadata = { title: "Professional portal · TULAY" };

const roles: Array<{ role: PortalRole; title: string; body: string; cta: string; icon: ReactNode }> = [
  {
    role: "doctor",
    title: "Doctor",
    body: "Patient records, e-reseta with UPSC and escalation referrals.",
    cta: "Continue as Doctor",
    icon: <BuildingIcon />,
  },
  {
    role: "clinic_staff",
    title: "Clinic Staff",
    body: "Verify and activate accounts. Dispense medicines where your clinic offers the service.",
    cta: "Continue as Clinic Staff",
    icon: <BuildingIcon />,
  },
  {
    role: "pharmacy_staff",
    title: "Pharmacy Staff",
    body: "For pharmacy teams: medicine availability and stock updates.",
    cta: "Continue as Pharmacy Staff",
    icon: <PillIcon />,
  },
];

function isRole(value: unknown): value is PortalRole {
  return value === "doctor" || value === "clinic_staff" || value === "pharmacy_staff";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;

  return (
    <PortalLayout>
      <StatusBadge>Professional access</StatusBadge>
      {isRole(role) ? (
        <SignInForm role={role} />
      ) : (
        <>
          <h1 className="mt-6 text-[28px] leading-9 font-medium">Choose your workspace</h1>
          <p className="mt-4 text-sm text-secondary-500">
            Select your role to access the right tools for your facility.
          </p>
          <ul className="mt-6 flex flex-col gap-4">
            {roles.map((r) => (
              <li key={r.role} className="rounded-tulay-16 border border-secondary-100 bg-surface p-5 sm:p-6">
                <div className="flex gap-4">
                  <span className="pt-1 text-primary">{r.icon}</span>
                  <div>
                    <h2 className="text-lg font-medium">{r.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-secondary-500">{r.body}</p>
                    <Link href={`/login?role=${r.role}`} className={buttonClasses("primary", "md", "mt-4")}>
                      {r.cta}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </PortalLayout>
  );
}
