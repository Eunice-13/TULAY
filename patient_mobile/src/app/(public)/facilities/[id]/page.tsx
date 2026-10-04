import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { InfoRow } from "@/components/ui/InfoRow";
import { getFacility } from "@/lib/data/patient";

export default async function FacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const facility = await getFacility(id);
  if (!facility || facility.kind !== "clinic") notFound();
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="care">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/directory" />
        <h1 className="w-full text-2xl font-semibold text-primary">{facility.name}</h1>
        <InfoRow title="Address">{facility.address}</InfoRow>
        <InfoRow title="Operating hours">{facility.operatingHours ?? "Not provided"}</InfoRow>
        <InfoRow title="Public contact">{facility.publicContact ?? "Not provided"}</InfoRow>
        <p className="w-full text-sm text-muted">Database facility record • Contact the clinic before travelling.</p>
      </PageContent>
    </AppShell>
  );
}
