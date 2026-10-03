import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { ClinicSearchField } from "@/features/directory/ClinicSearchField";
import { FacilityCard } from "@/features/directory/FacilityCard";
import { DIRECTORY } from "@/features/directory/mock-data";

export const metadata: Metadata = { title: "Find a Care Provider • TULAY" };

/** TULAY / P3 • Provider directory (222:3199) */
export default function ProviderDirectoryPage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="care">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/dashboard" />
        <h1 className="w-full text-2xl font-semibold text-primary">Find a Care Provider</h1>
        <p className="w-full text-sm text-muted">Search by your address or a location.</p>

        <div className="flex w-full flex-col gap-5 md:flex-row md:items-start md:gap-4">
          <ClinicSearchField label="Search facilities or location" className="md:flex-1" />
          <div className="flex w-full gap-2 md:mt-[29px] md:w-auto">
            <ButtonLink href="/directory/filters" variant="secondary" className="flex-1 md:w-32">
              Filters
            </ButtonLink>
            <ButtonLink href="/directory/map" variant="secondary" className="flex-1 md:w-32">
              Map view
            </ButtonLink>
          </div>
        </div>

        <p className="w-full p-2 text-sm text-positive">Active</p>

        <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          {DIRECTORY.map((entry) => (
            <li key={entry.id}>
              <FacilityCard
                id={entry.id}
                name={entry.name}
                lines={entry.lines}
                href={entry.kind === "clinic" ? `/facilities/${entry.id}` : `/pharmacy-finder/${entry.id}`}
                cta={entry.kind === "clinic" ? "View clinic" : "View pharmacy"}
              />
            </li>
          ))}
        </ul>

        <ButtonLink href="/medicines" variant="secondary" className="md:max-w-sm">
          Check medicines
        </ButtonLink>
      </PageContent>
    </AppShell>
  );
}
