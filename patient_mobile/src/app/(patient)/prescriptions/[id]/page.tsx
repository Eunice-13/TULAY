import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { InfoRow } from "@/components/ui/InfoRow";
import { getMyPrescription } from "@/lib/data/patient";

export const metadata: Metadata = { title: "Your prescription • TULAY" };

export default async function PrescriptionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rx = await getMyPrescription(id);
  if (!rx) notFound();
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/prescriptions" />
        <h1 className="w-full text-2xl font-semibold text-primary">Your prescription</h1>
        <InfoRow title={`Issued by ${rx.doctorName}`}>{rx.clinicName}<br />{new Date(rx.issuedAt).toLocaleString()}</InfoRow>
        <section className="flex w-full flex-col gap-3 rounded-tulay bg-soft p-4">
          <h2 className="font-semibold text-primary">Mock UPSC</h2><p className="text-sm text-muted">{rx.mockUpsc}</p>
          <ButtonLink href={`/prescriptions/${rx.id}/qr`} variant="secondary">View e-reseta</ButtonLink>
        </section>
        <ul className="flex w-full flex-col gap-5">
          {rx.items.map((item) => <li key={item.medicineId}><InfoRow title={item.genericName}>{item.strength} • {item.dosageForm}<br />{item.instructions}{item.prescribedQuantity ? ` • Prescribed quantity: ${item.prescribedQuantity}` : ""}</InfoRow><Divider /></li>)}
        </ul>
        <p className="w-full text-sm text-muted">If the full prescribed medicine is unavailable, ask dispensing staff for a note/slip stating what was provided and what is still needed. Keep your prescription and mock UPSC for your next visit.</p>
      </PageContent>
    </AppShell>
  );
}
