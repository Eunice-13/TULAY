import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { ListLink } from "@/components/ui/ListLink";
import { DEMO_PATIENT } from "@/features/registration/mock-data";

export const metadata: Metadata = { title: "Your next step • TULAY" };

/** TULAY / Pending • Next steps (222:2820) */
export default function PendingNextStepsPage() {
  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="next">
      <PageContent gap="gap-5" width="wide">
        <h1 className="w-full text-xl font-semibold text-primary [line-height:1.45]">Your next step: Visit Your Clinic</h1>
        <p className="w-full text-sm text-muted">Your account is registered, but not active yet.</p>
        <Badge tone="black">
          Pending - <span className="text-danger">Clinic Verification Needed</span>
        </Badge>

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-5">
            <InfoRow title="Patient Profile">
              {DEMO_PATIENT.fullName}
              <br />
              Demo profile • Quezon City
            </InfoRow>
            <section aria-labelledby="enroll-heading" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4">
              <h2 id="enroll-heading" className="text-base font-semibold text-primary">
                Select where you’ll enroll
              </h2>
              <p className="text-sm text-muted">
                Choose your registered clinic, check the hours and walk in for verification.
              </p>
              <ButtonLink href="/onboarding/clinic">Select my registered clinic</ButtonLink>
            </section>
          </div>

          <ul className="flex flex-col gap-5">
            <li>
              <ListLink
                href="/eligibility-guide"
                icon="guide"
                copyGap="gap-3"
                title="Learn about YAKAP-GAMOT"
                description="Know what to expect during enrollment."
              />
            </li>
            <li>
              <ListLink
                href="/onboarding/profile"
                icon="user"
                copyGap="gap-3"
                title="Complete my profile"
                description="Review patient and dependent details."
              />
            </li>
            <li>
              <ListLink
                href="/onboarding/protected"
                icon="lock"
                copyGap="gap-3"
                title="Prescriptions and appointments"
                description="Available after clinic activation."
              />
            </li>
          </ul>
        </div>
      </PageContent>
    </AppShell>
  );
}
