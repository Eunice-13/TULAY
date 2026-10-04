import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { FacilityCard } from "@/features/directory/FacilityCard";
import { listFacilities } from "@/lib/data/patient";

export const metadata: Metadata = { title: "Find a Care Provider • TULAY" };

export default async function ProviderDirectoryPage() {
  const facilities = await listFacilities();
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="care">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/dashboard" />
        <h1 className="w-full text-2xl font-semibold text-primary">Find a Care Provider</h1>
        <p className="w-full text-sm text-muted">Facilities are loaded from the live database. No accreditation claim is implied.</p>
        {facilities.length === 0 ? <p className="w-full rounded-tulay bg-canvas p-4 text-sm">No facilities are currently available.</p> : (
          <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
            {facilities.map((facility) => (
              <li key={facility.id}><FacilityCard id={facility.id} name={facility.name} lines={[facility.kind === "clinic" ? "Clinic" : "Pharmacy", facility.address, facility.operatingHours ?? "Hours not provided"]} href={facility.kind === "clinic" ? `/facilities/${facility.id}` : `/pharmacy-finder/${facility.id}`} cta={`View ${facility.kind}`} /></li>
            ))}
          </ul>
        )}
      </PageContent>
    </AppShell>
  );
}
