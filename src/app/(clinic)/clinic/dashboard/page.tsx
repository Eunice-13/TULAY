import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { PageHeading } from "@/components/ui/page-heading";
import { getClinicWorkspace, listPendingActivations } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Clinic Staff overview · TULAY" };

/** Figma CS1 (with dispensary) and CS1N (without dispensary). */
export default async function ClinicDashboardPage() {
  const clinic = await getClinicWorkspace();
  if (!clinic) redirect("/login/workplace");

  const queue = await listPendingActivations();
  const pending = queue.filter((r) => r.recordMatch === "Matched · Pending").length;
  const needsReview = queue.filter((r) => r.recordMatch === "Needs review").length;

  const metrics = [
    { label: "Pending verification", value: queue.length, caption: "In your selected clinic" },
    { label: "Matched, awaiting walk-in", value: pending, caption: "Ready for in-person review" },
    { label: "Needs correction", value: needsReview, caption: "Patient details require review" },
  ];

  return (
    <>
      <PageHeading
        title="Clinic Staff overview"
        description={`${clinic.name} · ${clinic.hasDispensary ? "Account verification and clinic dispensing" : "Account verification and activation"}`}
      />
      <ul className="grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <li key={m.label} className="rounded-tulay-16 border border-secondary-100 bg-surface p-5">
            <p className="text-sm text-secondary-500">{m.label}</p>
            <p className="mt-2 text-[32px] leading-10 font-medium">{String(m.value).padStart(2, "0")}</p>
            <p className="mt-2 text-xs text-quaternary">{m.caption}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card labelledBy="verify-heading">
          <CardTitle id="verify-heading">Verify and activate patients</CardTitle>
          <p className="mt-2 text-sm leading-6 text-secondary-500">
            Patients walk in with their verification QR or reference. Review identity and the matching record in
            person. Only Clinic Staff can change an account from Pending to Active or deny activation.
          </p>
          <LinkButton href="/clinic/activations" className="mt-4">
            Open verification queue
          </LinkButton>
        </Card>

        <Card labelledBy="dispensary-heading">
          <CardTitle id="dispensary-heading">Clinic dispensary</CardTitle>
          {clinic.hasDispensary ? (
            <>
              <p className="mt-2 text-sm leading-6 text-secondary-500">
                This clinic offers medicine dispensing. Look up a doctor-issued e-reseta by its exact UPSC and review
                it before supplying medicines.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <LinkButton href="/clinic/dispensing">Review a prescription</LinkButton>
                <LinkButton href="/clinic/availability" variant="secondary">
                  Update availability
                </LinkButton>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm leading-6 text-secondary-500">
              Medicine dispensing is unavailable at this clinic. Your workspace is limited to account verification
              and activation.
            </p>
          )}
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Notice className="flex-1">
          Workplace and dispensing permissions come from the clinic assigned to your account.
        </Notice>
        <LinkButton href="/clinic/facility" variant="secondary">
          Your workplace
        </LinkButton>
      </div>
    </>
  );
}
