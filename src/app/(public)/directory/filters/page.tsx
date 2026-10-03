import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { FilterForm } from "@/features/directory/FilterForm";

export const metadata: Metadata = { title: "Filter nearby care • TULAY" };

/** TULAY / P3 • Search filters (222:3273) */
export default function SearchFiltersPage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="care">
      <PageContent gap="gap-5">
        <BackLink href="/directory" />
        <h1 className="w-full text-2xl font-semibold text-primary">Filter Nearby Care</h1>
        <p className="w-full text-sm text-muted">Choose the location and the facilities you want to see.</p>
        <FilterForm applyHref="/directory" />
        <p className="w-full text-sm text-muted">
          Location permission can be requested in the future web app; an address search stays available.
        </p>
      </PageContent>
    </AppShell>
  );
}
