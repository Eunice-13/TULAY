import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { CLINICS, findClinic } from "@/features/directory/mock-data";

export const metadata: Metadata = { title: "Your walk-in plan • TULAY" };

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return CLINICS.map((clinic) => ({ id: clinic.id }));
}

/** TULAY / P3 • Walk-in enrollment plan (222:3007) */
export default async function WalkInPlanPage({ params }: { params: Params }) {
  const { id } = await params;
  const clinic = findClinic(id);
  if (!clinic) notFound();
  const address = clinic.profile?.fullAddress ?? clinic.address;

  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="none" navVariant="pending">
      <PageContent gap="gap-5">
        <BackLink href={`/onboarding/clinic/${clinic.id}`} />
        <h1 className="w-full text-2xl font-semibold text-primary">Your walk-in plan</h1>
        <p className="w-full text-sm text-muted">Save these steps for your clinic visit.</p>
        <Badge weight="normal">Pending • Clinic Selected</Badge>

        <ol className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-8">
          <li>
            <InfoRow title="Your registered clinic">
              {clinic.name}
              <br />
              <strong className="font-bold">{address}</strong>
            </InfoRow>
          </li>
          <li>
            <InfoRow title="When to go">
              <strong className="font-bold">Mon–Fri • 8:00 AM–5:00 PM</strong>
              <br />
              No verification appointment is booked.
            </InfoRow>
          </li>
          <li>
            <InfoRow title="What to bring">
              Your <strong className="font-bold">PhilHealth information</strong> and the documents requested by the
              clinic.
            </InfoRow>
          </li>
          <li>
            <InfoRow title="At the clinic">
              Ask authorized staff to verify your identity and activate your{" "}
              <strong className="font-bold">TULAY account.</strong>
            </InfoRow>
          </li>
        </ol>

        <div className="flex w-full flex-col gap-5 md:flex-row md:gap-4">
          <ButtonLink href="/onboarding/clinic/map">View Clinic Directions</ButtonLink>
          <ButtonLink href="/onboarding/pending" variant="secondary">
            Back to my next steps
          </ButtonLink>
        </div>
        <p className="w-full text-sm text-muted">Account activation can only be performed by clinic staff.</p>
      </PageContent>
    </AppShell>
  );
}
