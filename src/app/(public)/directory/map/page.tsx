import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { CareMap } from "@/features/directory/CareMap";
import { CLINICS } from "@/features/directory/mock-data";

export const metadata: Metadata = { title: "Care on the Map • TULAY" };

/** TULAY / P3 • Provider map (222:3342) */
export default function ProviderMapPage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="care">
      <PageContent gap="gap-5" width="wide">
        <CareMap
          variant="active"
          backHref="/directory"
          clinicHref={`/facilities/${CLINICS[0].id}`}
          listHref="/directory"
        />
      </PageContent>
    </AppShell>
  );
}
