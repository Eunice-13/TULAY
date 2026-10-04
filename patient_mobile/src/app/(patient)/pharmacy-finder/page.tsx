import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { StockBadge } from "@/features/availability/StockBadge";
import { listMedicineAvailability } from "@/lib/data/patient";

export const metadata: Metadata = { title: "Find prescribed medicine • TULAY" };

export default async function PharmacyFinderPage({ searchParams }: { searchParams: Promise<{ medicine?: string }> }) {
  const { medicine } = await searchParams;
  const records = await listMedicineAvailability();
  const shown = medicine ? records.filter((record) => record.medicine.id === medicine) : records;
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/prescriptions" />
        <h1 className="w-full text-2xl font-semibold text-primary">Find prescribed medicine</h1>
        <p className="w-full text-sm text-muted">Availability reported by participating pharmacies.</p>
        {shown.length === 0 ? <p className="w-full rounded-tulay bg-soft p-4 text-sm">No availability report was found.</p> : (
          <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">{shown.map((record) => (
            <li key={record.id} className="flex flex-col gap-3 rounded-tulay border border-canvas p-4">
              <InfoRow title={record.facility.name}>{record.medicine.genericName} · {record.medicine.strength} / {record.medicine.dosageForm}<br />{record.facility.address}</InfoRow>
              <StockBadge status={record.status} />
              <p className="text-sm text-muted">Updated {new Date(record.updatedAt).toLocaleString()}</p>
              <ButtonLink href={`/pharmacy-finder/${record.facility.id}?medicine=${record.medicine.id}`} variant="secondary">View pharmacy</ButtonLink>
            </li>
          ))}</ul>
        )}
        <p className="w-full text-sm text-muted">Availability is provider-reported and not guaranteed. Contact the pharmacy before travelling.</p>
      </PageContent>
    </AppShell>
  );
}
