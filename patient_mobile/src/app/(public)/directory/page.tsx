import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FacilityCard } from "@/features/directory/FacilityCard";
import { listFacilities } from "@/lib/data/patient";

export const metadata: Metadata = { title: "Find a Clinic • TULAY" };

type SearchParams = Promise<{ q?: string | string[] }>;

export default async function ProviderDirectoryPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").trim().slice(0, 80);
  const clinics = await listFacilities("clinic");
  const normalizedQuery = query.toLocaleLowerCase();
  const results = normalizedQuery
    ? clinics.filter((clinic) =>
        [clinic.name, clinic.address, clinic.operatingHours, clinic.publicContact]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
      )
    : clinics;

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="care">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/dashboard" />
        <h1 className="w-full text-2xl font-semibold text-primary">Find a clinic</h1>
        <p className="w-full text-sm text-muted">Search participating clinics by name, address, hours, or contact information.</p>

        <form action="/patient/directory" method="get" role="search" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4 sm:flex-row sm:items-end">
          <TextField
            label="Search clinics"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Clinic name or location"
            autoComplete="off"
            className="flex-1"
          />
          <div className="flex w-full gap-2 sm:w-auto">
            <Button type="submit" className="sm:w-28">Search</Button>
            {query ? <ButtonLink href="/directory" variant="secondary" className="sm:w-24">Clear</ButtonLink> : null}
          </div>
        </form>

        <p className="w-full text-sm text-muted" aria-live="polite">
          {query ? `${results.length} clinic${results.length === 1 ? "" : "s"} found for “${query}”.` : `${results.length} clinic${results.length === 1 ? "" : "s"} available.`}
        </p>

        {results.length === 0 ? <p className="w-full rounded-tulay bg-canvas p-4 text-sm">No clinics match your search. Try a clinic name or a different location.</p> : (
          <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
            {results.map((clinic) => (
              <li key={clinic.id}><FacilityCard id={clinic.id} name={clinic.name} lines={["Clinic", clinic.address, clinic.operatingHours ?? "Hours not provided"]} href={`/facilities/${clinic.id}`} cta="View clinic" /></li>
            ))}
          </ul>
        )}
        <p className="w-full text-xs text-muted">Clinic details come from the live TULAY database. No official accreditation claim is implied.</p>
      </PageContent>
    </AppShell>
  );
}
