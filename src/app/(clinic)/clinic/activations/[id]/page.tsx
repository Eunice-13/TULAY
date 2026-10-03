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
  const { patient } = detail;
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
            <DetailItem
              label="Last / first / middle / affix"
              value={`${patient.lastName} / ${patient.firstName} / ${patient.middleInitial} / ${patient.affix ?? "—"}`}
            />
            <DetailItem label="Birth date / sex" value={`${patient.birthDate} · ${patient.sex}`} />
            <DetailItem label="Registered address" value={`${patient.street}, ${patient.barangay}`} />
            <DetailItem label="City / province / postal code" value={patient.cityProvincePostal} />
            <DetailItem label="PhilHealth ID" value={patient.philHealthId} />
            <DetailItem label="Membership category" value={patient.membership} />
            <DetailItem label="Email" value={patient.email} />
            <DetailItem label="Contact number" value={patient.contact ?? "Not provided"} />
            <DetailItem
              label="Dependents"
              value={patient.dependents.length ? `${patient.dependents.length} declared` : "None declared"}
            />
            <DetailItem label="Selected clinic" value={detail.selectedClinic} />
          </dl>
        </Card>
        <ActivationReview
          beneficiaryId={detail.lookup.beneficiaryId}
          patient={{ displayName: patient.displayName, philHealthId: patient.philHealthId }}
          recordMatch={detail.recordMatch}
          staffName={staff.fullName}
        />
      </div>
    </>
  );
}
