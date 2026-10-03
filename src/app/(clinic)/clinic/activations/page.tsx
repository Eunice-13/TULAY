import type { Metadata } from "next";

import { Card, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { PageHeading } from "@/components/ui/page-heading";
import { ActivationQueue } from "@/features/activation/activation-queue";
import { ReferenceLookup } from "@/features/activation/reference-lookup";
import { getPreviewHints, listPendingActivations } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Patient activations · TULAY" };

export default async function ActivationsPage() {
  const rows = await listPendingActivations();
  const hints = await getPreviewHints();

  return (
    <>
      <PageHeading
        title="Patient activations"
        description="Verify identity at the clinic before activating a patient's account."
      />
      <Card labelledBy="ref-heading" className="mb-6">
        <CardTitle id="ref-heading">Scan or enter a verification reference</CardTitle>
        <p className="mt-1 mb-4 text-sm text-secondary-500">
          Patients show their verification QR when they walk in. The reference only locates the record.
        </p>
        <ReferenceLookup demoHint={hints?.verificationReference} />
      </Card>
      <ActivationQueue rows={rows} />
      <Notice className="mt-6">
        A matching record does not activate an account. Activation requires identity verification by authorized
        Clinic Staff.
      </Notice>
    </>
  );
}
