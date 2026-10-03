import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { TextField } from "@/components/ui/TextField";
import { StockBadge } from "@/features/availability/StockBadge";
import { PHARMACIES } from "@/features/availability/mock-data";
import { FORMULARY } from "@/features/formulary/mock-data";

export const metadata: Metadata = { title: "Find Prescribed Medicine • TULAY" };

type SearchParams = Promise<{ medicine?: string }>;

/** TULAY / P3 • Medicine-specific pharmacy finder (222:3846) */
export default async function PharmacyFinderPage({ searchParams }: { searchParams: SearchParams }) {
  const { medicine } = await searchParams;
  const medicineLabel = FORMULARY.find((entry) => entry.id === medicine)?.name ?? "Demo medicine A • 500 mg";

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/prescriptions/demo-ereseta" />
        <h1 className="w-full text-2xl font-semibold text-primary">Find Prescribed Medicine</h1>
        <p className="w-full text-sm text-muted">Reported availability before you travel.</p>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-6">
          <div className="flex flex-col gap-2">
            <TextField tone="muted" label="Medicine" name="medicine" defaultValue={medicineLabel} />
            <span aria-hidden="true" className="block h-5" />
          </div>
          <div className="flex flex-col gap-2">
            <TextField tone="muted" label="Location and Distance" name="location" defaultValue="Quezon City • Within 5 km" />
            <span aria-hidden="true" className="block h-5" />
          </div>
        </div>
        <ButtonLink href="/directory/map" variant="secondary" className="md:max-w-sm">
          Map View
        </ButtonLink>

        <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          {PHARMACIES.map((pharmacy) => (
            <li key={pharmacy.id}>
              <article
                aria-labelledby={`ph-${pharmacy.id}`}
                className="flex h-full w-full flex-col gap-3 rounded-tulay border border-canvas bg-surface p-4"
              >
                <InfoRow title={<span id={`ph-${pharmacy.id}`}>{pharmacy.name}</span>}>
                  {pharmacy.distance}
                  <br />
                  {pharmacy.hours}
                </InfoRow>
                <StockBadge status={pharmacy.stock} />
                <p className="text-sm text-muted">{pharmacy.updated}</p>
                <ButtonLink
                  href={`/pharmacy-finder/${pharmacy.id}`}
                  variant="secondary"
                  aria-label={`View pharmacy: ${pharmacy.name}`}
                >
                  View pharmacy
                </ButtonLink>
                <ButtonLink
                  href="/notifications"
                  variant="ghost"
                  aria-label={`SMS restock preference for ${pharmacy.name}`}
                >
                  SMS restock preference
                </ButtonLink>
              </article>
            </li>
          ))}
        </ul>

        <p className="w-full text-sm text-muted">
          Sample listings. Reported availability is not guaranteed stock; contact the pharmacy before visiting.
        </p>
      </PageContent>
    </AppShell>
  );
}
