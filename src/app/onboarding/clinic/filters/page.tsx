import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { FilterForm } from "@/features/directory/FilterForm";

export const metadata: Metadata = { title: "Filter nearby care • TULAY" };

/** TULAY / P3 • Pending clinic filters (222:4923) */
export default function PendingClinicFiltersPage() {
  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="clinics">
      <PageContent gap="gap-5">
        <BackLink href="/onboarding/clinic" />
        <h1 className="w-full text-2xl font-semibold text-primary">Filter Nearby Care</h1>
        <p className="w-full text-sm text-muted">Choose all the location and the facilities you want to see.</p>
        <FilterForm applyHref="/onboarding/clinic/map" />
        <p className="w-full text-sm text-muted">
          Location permission can be requested in the future web app; an address search stays available.
        </p>
      </PageContent>
    </AppShell>
  );
}
