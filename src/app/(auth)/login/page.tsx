import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import { BuildingIcon, ChevronRightIcon, PillIcon } from "@/components/ui/icons";
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
          <h1 className="mt-4 text-2xl leading-8 font-medium sm:text-[28px] sm:leading-9">
            Choose your workspace
          </h1>
          <p className="mt-2 text-sm text-secondary-500">
            Select your role to access the right tools for your facility.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {roles.map((r) => (
              <li key={r.role}>
                <Link
                  href={`/login?role=${r.role}`}
                  className="group flex min-h-24 items-center gap-4 rounded-tulay-16 border border-secondary-100 bg-surface p-4 transition-colors hover:border-primary hover:bg-canvas"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-tulay-12 bg-tertiary text-primary">
                    {r.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-medium">{r.title}</h2>
                    <span className="mt-0.5 block text-sm leading-5 text-secondary-500">{r.body}</span>
                    <span className="sr-only">{r.cta}</span>
                  </div>
                  <ChevronRightIcon
                    size={20}
                    className="shrink-0 text-primary transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </PortalLayout>
  );
}
