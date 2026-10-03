import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { DEMO_PATIENT } from "@/features/registration/mock-data";

export const metadata: Metadata = { title: "Check your demo record • TULAY" };

type SearchParams = Promise<{ result?: string }>;

/**
 * TULAY / P2 • Mock record matching (222:2753) and
 * TULAY / P2 • Match needs review (222:2790) via `?result=review`.
 */
export default async function PhilHealthMatchPage({ searchParams }: { searchParams: SearchParams }) {
  const { result } = await searchParams;
  const needsReview = result === "review";

  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href="/register/dependents" size="sm" tone="primary" />
        <h1 className="w-full text-2xl font-bold text-primary">
          {needsReview ? "Review your details" : "Check Your Demo Record"}
        </h1>
        <p className="w-full text-sm font-medium text-primary">
          {needsReview ? "We could not match this demo record." : "Matching does not activate your account."}
        </p>

        <div className="flex w-full items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-tulay bg-soft">
            <Icon name="user" size={40} />
          </span>
          {needsReview ? (
            <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-bold break-words-safe">
              <h2 className="text-danger">What To Check</h2>
              <p className="text-black">Compare the ID Number, Name and Birth Date with your YAKAP record.</p>
            </div>
          ) : (
            <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm break-words-safe">
              <h2 className="font-semibold text-primary">Your Submitted Details</h2>
              <p className="text-black">
                {DEMO_PATIENT.fullName}
                <br />
                {DEMO_PATIENT.birthDate}
                <br />
                {DEMO_PATIENT.philhealthId}
              </p>
            </div>
          )}
        </div>

        {needsReview ? (
          <>
            <ButtonLink href="/register">Edit my Patient Details</ButtonLink>
            <ButtonLink href="/onboarding/philhealth" variant="secondary">
              Try matching again
            </ButtonLink>
          </>
        ) : (
          <>
            <section
              aria-labelledby="match-status"
              role="status"
              className="flex w-full flex-col gap-3 rounded-tulay bg-success p-4"
            >
              <h2 id="match-status" className="text-base font-bold text-primary">
                Demo Details Matched
              </h2>
              <div className="flex w-full items-center gap-3">
                <p className="min-w-0 flex-1 text-sm text-black">
                  Your account remains Pending until clinic staff verify you in person.
                </p>
                <Icon name="check" size={48} />
              </div>
            </section>
            <ButtonLink href="/onboarding/clinic">Continue to Clinic Selection</ButtonLink>
          </>
        )}
      </PageContent>
    </AppShell>
  );
}
