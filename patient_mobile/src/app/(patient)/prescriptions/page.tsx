import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { listMyPrescriptions } from "@/lib/data/patient";

export const metadata: Metadata = { title: "Your E-Reseta • TULAY" };

export default async function PrescriptionListPage() {
  const prescriptions = await listMyPrescriptions();
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="ereseta">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/dashboard" />
        <h1 className="w-full text-2xl font-semibold text-primary">Your E-Reseta</h1>
        <p className="w-full text-sm text-muted">Only prescriptions issued to your active database account are shown.</p>
        {prescriptions.length === 0 ? (
          <InfoRow title="No prescriptions yet">An assigned doctor must issue a prescription after an in-person consultation.</InfoRow>
        ) : (
          <ul className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
            {prescriptions.map((rx) => (
              <li key={rx.id} className="flex flex-col gap-3 rounded-tulay bg-canvas p-4">
                <h2 className="font-semibold text-primary">Issued {new Date(rx.issuedAt).toLocaleDateString()}</h2>
                <p className="text-sm text-muted">{rx.doctorName} • {rx.clinicName}<br />{rx.items.length} medicine item{rx.items.length === 1 ? "" : "s"}</p>
                <ButtonLink href={`/prescriptions/${rx.id}`}>View prescription</ButtonLink>
              </li>
            ))}
          </ul>
        )}
      </PageContent>
    </AppShell>
  );
}
