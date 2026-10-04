import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { InfoRow } from "@/components/ui/InfoRow";
import { StockBadge } from "@/features/availability/StockBadge";
import { getFacility, listMedicineAvailability } from "@/lib/data/patient";

export const metadata: Metadata = { title: "Pharmacy • TULAY" };

export default async function PharmacyProfilePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ medicine?: string }> }) {
  const [{ id }, { medicine }] = await Promise.all([params, searchParams]);
  const [facility, records] = await Promise.all([getFacility(id), listMedicineAvailability()]);
  if (!facility || facility.kind !== "pharmacy") notFound();
  const shown = records.filter((record) => record.facility.id === id && (!medicine || record.medicine.id === medicine));
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/pharmacy-finder" />
        <h1 className="w-full text-2xl font-semibold text-primary">{facility.name}</h1>
        <InfoRow title="Address and hours">{facility.address}<br />{facility.operatingHours ?? "Hours not reported"}</InfoRow>
        {facility.publicContact && <InfoRow title="Contact">{facility.publicContact}</InfoRow>}
        <ul className="flex w-full flex-col gap-3">{shown.map((record) => (
          <li key={record.id} className="rounded-tulay border border-canvas p-4">
            <InfoRow title={`${record.medicine.genericName} · ${record.medicine.strength}`}>{record.medicine.dosageForm}<br />Updated {new Date(record.updatedAt).toLocaleString()}</InfoRow>
            <div className="mt-3"><StockBadge status={record.status} /></div>
          </li>
        ))}</ul>
        {shown.length === 0 && <p className="w-full rounded-tulay bg-soft p-4 text-sm">No availability report is stored for this selection.</p>}
        <p className="w-full text-sm text-muted">TULAY does not track exact quantities or authorize dispensing.</p>
      </PageContent>
    </AppShell>
  );
}
