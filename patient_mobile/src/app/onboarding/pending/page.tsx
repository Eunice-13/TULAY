import { AppShell, PageContent } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { InfoRow } from "@/components/ui/InfoRow";
import { getMyPendingActivation } from "@/lib/data/patient";

export default async function PendingNextStepsPage() {
  const pending = await getMyPendingActivation();
  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="next">
      <PageContent gap="gap-5" width="wide">
        <h1 className="w-full text-2xl font-semibold text-primary">Visit your assigned clinic</h1>
        <Badge tone="black">Pending - Clinic Verification Needed</Badge>
        <InfoRow title="Patient">{pending.displayName}</InfoRow>
        <InfoRow title="Assigned clinic">{pending.clinic.name}<br />{pending.clinic.address}<br />{pending.clinic.operatingHours ?? "Hours not provided"}</InfoRow>
        <InfoRow title="Verification reference">{pending.verificationReference}</InfoRow>
        <p className="w-full text-sm text-muted">Show this random reference in person. It only locates your pending record; it does not activate your account.</p>
      </PageContent>
    </AppShell>
  );
}
