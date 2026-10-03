import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";

export const metadata: Metadata = { title: "Your Doctor’s Referral • TULAY" };

type Params = Promise<{ id: string }>;

const STATUS_STEPS = [
  { title: "Pending", detail: "Referral received" },
  { title: "Booked", detail: "October 9, 2026 • 10:00 AM" },
  { title: "Attended", detail: "Waiting for visit" },
  { title: "Completed", detail: "Waiting for care team confirmation" },
] as const;

export function generateStaticParams() {
  return [{ id: "demo-referral" }];
}

/** TULAY / P10 • Referral details (222:4296) */
export default async function ReferralDetailsPage({ params }: { params: Params }) {
  const { id } = await params;
  if (id !== "demo-referral") notFound();

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/referrals" />
        <h1 className="w-full text-2xl font-semibold text-primary">Your Doctor’s Referral</h1>

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-5">
            <InfoRow title="Referral from Dr. Ana Demo">
              Demo Community Clinic
              <br />
              Issued October 4, 2026
            </InfoRow>
            <InfoRow title="Condition and Reason">
              Sample clinical finding: requires specialist review.
              <br />
              No real diagnosis is included in the demo.
            </InfoRow>
            <ol aria-label="Referral status" className="flex flex-col gap-5">
              {STATUS_STEPS.map((step) => (
                <li key={step.title}>
                  <InfoRow title={step.title}>{step.detail}</InfoRow>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-5">
            <section aria-labelledby="hospital" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4">
              <h2 id="hospital" className="text-base font-semibold text-primary">
                Suggested Hospital
              </h2>
              <p className="text-sm text-muted">
                Demo Referral Hospital
                <br />
                Example Road, Quezon City
              </p>
              <ButtonLink href="/directory/map" variant="secondary">
                View location and directions
              </ButtonLink>
            </section>
            <p className="w-full text-sm text-muted">
              Hospital care is a separate benefit from the GAMOT medicine ceiling. Follow your doctor’s referral
              instructions.
            </p>
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
}
