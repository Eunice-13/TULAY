import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { Card, CardTitle, DetailItem } from "@/components/ui/card";
import { PageHeading } from "@/components/ui/page-heading";
import { ActivationReview } from "@/features/activation/activation-review";
import { getPendingActivation, getSignedInStaff } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Verify identity · TULAY" };

/** Figma CS2R / CS2RN — walk-in identity review. */
export default async function ActivationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getPendingActivation(id);
  if (!detail) notFound();
  const patient = detail.lookup;
  const staff = await getSignedInStaff("clinic_staff");

  return (
    <>
      <PageHeading
        title={`Review ${patient.displayName}`}
        description={`Pending account · Registered ${detail.registeredAt} · Walk-in verification`}
        actions={
          <LinkButton href="/clinic/activations" variant="secondary">
            <span aria-hidden="true">←</span> Activations
          </LinkButton>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
        <Card labelledBy="pi-heading">
          <CardTitle id="pi-heading">Patient information</CardTitle>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <DetailItem label="Beneficiary" value={patient.displayName} />
            <DetailItem label="Birth date" value={patient.birthDate} />
            <DetailItem label="PhilHealth ID" value={patient.mockPhilHealthId} />
            <DetailItem label="Account status" value="Pending clinic verification" />
            <DetailItem label="Selected clinic" value={detail.selectedClinic} />
          </dl>
        </Card>
        <ActivationReview
          beneficiaryId={detail.lookup.beneficiaryId}
          verificationReference={detail.verificationReference}
          patient={{ displayName: patient.displayName, philHealthId: patient.mockPhilHealthId }}
          recordMatch={detail.recordMatch}
          staffName={staff.fullName}
        />
      </div>
    </>
  );
}
