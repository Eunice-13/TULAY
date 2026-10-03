import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { PRESCRIPTIONS, findPrescription } from "@/features/prescriptions/mock-data";

export const metadata: Metadata = { title: "Show your mock QR • TULAY" };

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return PRESCRIPTIONS.map((rx) => ({ id: rx.id }));
}

/** TULAY / P7 • Full-screen mock QR (222:3810) — no bottom navigation, as in Figma. */
export default async function MockQrPage({ params }: { params: Params }) {
  const { id } = await params;
  const rx = findPrescription(id);
  if (!rx) notFound();

  return (
    <AppShell menuHref="/account" homeHref="/dashboard">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href={`/prescriptions/${rx.id}`} />
        <h1 className="w-full text-2xl font-semibold text-primary">Show your mock QR</h1>
        <p className="w-full text-sm text-muted">Use this screen to present the demo prescription.</p>
        <div className="flex w-full flex-col items-center gap-3 rounded-tulay bg-surface p-4">
          <Image
            src="/icons/mock-qr.svg"
            alt={`Illustrative mock QR for ${rx.upsc}`}
            width={280}
            height={280}
            className="size-[280px] max-w-full"
            priority
          />
        </div>
        <InfoRow title={rx.upsc}>
          {rx.patientName}
          <br />
          Issued {rx.issuedOn}
        </InfoRow>
        <p className="w-full text-sm text-muted">
          This vector is an illustrative mock QR. Replace it with an encoded demo UPSC QR during implementation.
        </p>
        <ButtonLink href={`/prescriptions/${rx.id}`}>Back to E-Reseta</ButtonLink>
      </PageContent>
    </AppShell>
  );
}
