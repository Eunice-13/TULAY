import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { InfoRow } from "@/components/ui/InfoRow";
import { ClinicSelectionButton } from "@/features/registration/ClinicSelectionButton";
import { requirePatient } from "@/lib/auth";
import { getFacility } from "@/lib/data/patient";

export default async function PendingClinicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [profile, clinic] = await Promise.all([requirePatient("pending"), getFacility(id)]);
  if (!clinic || clinic.kind !== "clinic" || (profile.assignedClinicId && profile.assignedClinicId !== clinic.id)) notFound();
  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="none" navVariant="pending">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/onboarding/clinic" />
        <h1 className="w-full text-2xl font-semibold text-primary">{clinic.name}</h1>
        <InfoRow title="Address">{clinic.address}</InfoRow>
        <InfoRow title="Operating hours">{clinic.operatingHours ?? "Not provided"}</InfoRow>
        <InfoRow title="Public contact">{clinic.publicContact ?? "Not provided"}</InfoRow>
        <ClinicSelectionButton clinicId={clinic.id} />
        <p className="w-full text-sm text-muted">Clinic staff must verify and activate the account in person.</p>
      </PageContent>
    </AppShell>
  );
}
