import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { InfoRow } from "@/components/ui/InfoRow";
import { PRESCRIPTIONS, findPrescription } from "@/features/prescriptions/mock-data";

export const metadata: Metadata = { title: "Your prescription • TULAY" };

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return PRESCRIPTIONS.map((rx) => ({ id: rx.id }));
}

/** TULAY / P7 • E-reseta details and UPSC (222:3742) */
export default async function PrescriptionDetailsPage({ params }: { params: Params }) {
  const { id } = await params;
  const rx = findPrescription(id);
  if (!rx) notFound();

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/prescriptions" />
        <h1 className="w-full text-2xl font-semibold text-primary">Your prescription</h1>
        <p className="w-full text-sm text-muted">Demo e-reseta • Not valid for dispensing.</p>

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-5">
            <InfoRow title={`Issued by ${rx.doctor}`}>
              {rx.clinic}
              <br />
              Issued {rx.issuedOn}
              <br />
              {rx.validity}
            </InfoRow>
            <section aria-labelledby="upsc" className="flex w-full flex-col gap-3 rounded-tulay bg-soft p-4">
              <h2 id="upsc" className="text-base font-semibold text-primary">
                Unique prescription code
              </h2>
              <p className="text-sm text-muted">{rx.upsc}</p>
              <ButtonLink href={`/prescriptions/${rx.id}/qr`} variant="secondary">
                Show Mock QR
              </ButtonLink>
            </section>
          </div>

          <div className="flex flex-col gap-5">
            <ul aria-label="Prescribed medicines" className="flex flex-col gap-5">
              {rx.medicines.map((medicine) => (
                <li key={medicine.name} className="flex flex-col gap-5">
                  <InfoRow title={medicine.name}>
                    {medicine.lines[0]}
                    <br />
                    {medicine.lines[1]}
                  </InfoRow>
                  <Divider />
                </li>
              ))}
            </ul>
            <ButtonLink href="/pharmacy-finder?medicine=demo-medicine-a">Find pharmacy with this medicine</ButtonLink>
            <section aria-labelledby="incomplete" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4">
              <h2 id="incomplete" className="text-base font-semibold text-primary">
                If the pharmacy cannot complete your prescription
              </h2>
              <p className="text-sm text-muted">
                Ask the staff for a written note of the medicine that is still missing. Confirm the next step with the
                clinic or pharmacy.
              </p>
            </section>
          </div>
        </div>

        <p className="w-full text-sm text-muted">
          The mock UPSC and QR demonstrate the interface only. They are not connected to the official GAMOT service.
        </p>
      </PageContent>
    </AppShell>
  );
}
