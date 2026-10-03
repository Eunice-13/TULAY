import type { Metadata } from "next";
import Link from "next/link";

import { Button, buttonClasses } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PortalLayout } from "@/features/auth/portal-layout";
import { selectWorkplace } from "@/lib/data/mutations";
import { listAssignedClinics } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Choose your workplace · TULAY" };

/**
 * Figma ClinicPicker. Shown after Clinic Staff sign-in. In the real app this
 * lists only clinics assigned to the signed-in account, read from the server.
 */
export default async function WorkplacePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const clinics = await listAssignedClinics();

  return (
    <PortalLayout>
      <StatusBadge>Professional access · Clinic Staff</StatusBadge>
      <form action={selectWorkplace} className="mt-6">
        <fieldset aria-describedby="workplace-hint">
          <legend className="text-[28px] leading-9 font-medium">Clinic you work at</legend>
          <p id="workplace-hint" className="mt-2 text-sm leading-6 text-secondary-500">
            Select a clinic assigned to your account. Services are set by the clinic administrator.
          </p>
          {error ? (
            <p role="alert" className="mt-4 text-sm font-medium text-danger">
              Select one of your assigned clinics to continue.
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-3">
            {clinics.map((clinic, index) => (
              <label
                key={clinic.id}
                className="flex cursor-pointer gap-3 rounded-tulay-12 border border-grey-200 bg-surface p-4 has-[:checked]:border-primary has-[:checked]:bg-secondary-100"
              >
                <input
                  type="radio"
                  name="clinicId"
                  value={clinic.id}
                  defaultChecked={index === 0}
                  className="mt-1 size-4 accent-primary"
                />
                <span>
                  <span className="block text-sm font-semibold">
                    {clinic.name} · {clinic.hasDispensary ? "With dispensary" : "Without dispensary"}
                  </span>
                  <span className="block text-sm leading-6 text-secondary-500">
                    {clinic.hasDispensary
                      ? "This clinic has a dispensary. Your Clinic Staff workspace includes verification, activation and prescription review for dispensing."
                      : "This clinic has no dispensary. Your Clinic Staff workspace includes patient verification and activation."}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="submit">Continue</Button>
          <Link href="/login?role=clinic_staff" className={buttonClasses("secondary")}>
            Cancel
          </Link>
        </div>
      </form>
    </PortalLayout>
  );
}
