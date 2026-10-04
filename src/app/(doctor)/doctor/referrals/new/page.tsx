import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { ReferralForm } from "@/features/referrals/referral-form";
import { getPatientForDoctor } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Digital referral · TULAY" };

/** Figma M7 — digital referral and clinic suggestions (mock-only). */
export default async function NewReferralPage({ searchParams }: { searchParams: Promise<{ patient?: string }> }) {
  const { patient: patientId } = await searchParams;
  const patient = await getPatientForDoctor(patientId ?? "pt-jose");
  if (patient?.status !== "active") redirect("/doctor/referrals");

  return (
    <>
      <PageHeading
        title="Digital referral"
        description="Review screening information and select an appropriate clinic."
        actions={<LinkButton href="/doctor/referrals" variant="secondary">
              <span aria-hidden="true">←</span> Referrals
            </LinkButton>}
      />
      <ReferralForm
        kind="digital"
        patient={{
          id: patient.id,
          displayName: patient.displayName,
          philHealthId: patient.philHealthId,
          summary: `${patient.displayName} · Birth date: ${patient.birthDate}\nNearby clinics: choose a facility from the directory after checking its services. Distance and availability appear when a destination is selected.`,
        }}
        destinations={["Your assigned clinic", "Demo Clinic A", "Demo Clinic B"]}
        sendHref="/doctor/referrals?sent=1"
      />
    </>
  );
}
