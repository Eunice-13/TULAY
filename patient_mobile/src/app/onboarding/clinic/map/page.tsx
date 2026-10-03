import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { CareMap } from "@/features/directory/CareMap";
import { CLINICS } from "@/features/directory/mock-data";

export const metadata: Metadata = { title: "Care on the Map • TULAY" };

/** TULAY / P3 • Pending clinic map (222:4982) */
export default function PendingClinicMapPage() {
  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="clinics">
      <PageContent gap="gap-5" width="wide">
        <CareMap
          backHref="/onboarding/clinic"
          clinicHref={`/onboarding/clinic/${CLINICS[0].id}`}
          listHref="/onboarding/clinic"
        />
      </PageContent>
    </AppShell>
  );
}
