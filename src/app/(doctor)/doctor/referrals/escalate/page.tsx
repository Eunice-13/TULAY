import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { ReferralForm } from "@/features/referrals/referral-form";
import { getPatientForDoctor, listReferrals } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Escalate care · TULAY" };

/** Figma M5E — clinic to hospital escalation (mock-only). */
export default async function EscalatePage({ searchParams }: { searchParams: Promise<{ patient?: string }> }) {
  const { patient: patientId } = await searchParams;
  const patient = await getPatientForDoctor(patientId ?? "pt-maria");
  if (patient?.status !== "active") redirect("/doctor/referrals");

  const existing = (await listReferrals()).find((r) => r.patientId === patient.id && r.direction === "sent");
  const referralId = existing?.id ?? "REF-PREVIEW";

  return (
    <>
      <PageHeading
        title="Escalate care to a hospital"
        description={`${patient.displayName} · ${patient.philHealthId}`}
        actions={<LinkButton href="/doctor/referrals" variant="secondary">
              <span aria-hidden="true">←</span> Referrals
            </LinkButton>}
      />
      <ReferralForm
        kind="escalation"
        patient={{
          id: patient.id,
          displayName: patient.displayName,
          philHealthId: patient.philHealthId,
          summary: `${patient.displayName} · ${patient.sex} · ${patient.age} years\nLast physical checkup: ${patient.lastVisit ?? "—"}\nAssigned facility: Your clinic`,
        }}
        destinations={["Demo Hospital 01", "Demo Hospital 02", "Demo Medical Center"]}
        sendHref={`/doctor/referrals/${referralId}/continuation?patient=${patient.id}`}
      />
    </>
  );
}
