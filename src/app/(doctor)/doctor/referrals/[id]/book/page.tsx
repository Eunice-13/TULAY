import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { ReferralBooking } from "@/features/referrals/referral-booking";
import { getPatientForDoctor, getReferral } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Book referred appointment · TULAY" };

export default async function BookReferralPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ patient?: string }>;
}) {
  const { id } = await params;
  const { patient: patientParam } = await searchParams;
  const referral = await getReferral(id);
  const patient = await getPatientForDoctor(referral?.patientId ?? patientParam ?? "");
  if (patient?.status !== "active") notFound();

  return (
    <>
      <PageHeading
        title="Book on behalf of a patient"
        description="Choose a service and an available slot for the referred patient."
        actions={<LinkButton href="/doctor/referrals" variant="secondary">
              <span aria-hidden="true">←</span> Referrals
            </LinkButton>}
      />
      <ReferralBooking
        patient={{ id: patient.id, displayName: patient.displayName, philHealthId: patient.philHealthId }}
        referralId={referral?.id ?? "New escalation"}
        referralRoute={referral?.route ?? "Clinic to hospital escalation"}
      />
    </>
  );
}
