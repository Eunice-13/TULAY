import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { VISIT_TYPES, bookingQuery, isTimeSlot, isVisitType, type VisitTypeKey } from "@/features/appointments/booking";

export const metadata: Metadata = { title: "Choose your Visit Type • TULAY" };

type SearchParams = Promise<{ visit?: string; slot?: string }>;

const ORDER: VisitTypeKey[] = ["consultation", "lab"];

/** TULAY / P5 • Visit type and doctor-ordered tests (222:5626) */
export default async function VisitTypePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const current = isVisitType(params.visit) ? params.visit : "consultation";
  const slot = isTimeSlot(params.slot) ? params.slot : undefined;

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5">
        <BackLink href={`/appointments${bookingQuery({ visit: current, slot })}`} />
        <h1 className="w-full text-2xl font-semibold text-primary">Choose your Visit Type</h1>
        <p className="w-full text-sm text-muted">Doctor-ordered tests need a recorded order.</p>

        <div role="group" aria-label="Visit type" className="flex w-full flex-col gap-5 md:flex-row md:gap-4">
          {ORDER.map((key) => (
            <ButtonLink
              key={key}
              href={`/appointments${bookingQuery({ visit: key, slot })}`}
              variant={key === current ? "primary" : "secondary"}
              aria-current={key === current ? "true" : undefined}
            >
              {VISIT_TYPES[key]}
            </ButtonLink>
          ))}
        </div>

        <InfoRow title="Example Available Tests">
          Complete Blood Count • Doctor order required
          <br />
          Urinalysis • Doctor order required
        </InfoRow>

        <section aria-labelledby="no-order" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4">
          <h2 id="no-order" className="text-base font-semibold text-primary">
            No Doctor Order yet?
          </h2>
          <p className="text-sm text-muted">Book a consultation first. Your doctor decides which tests are needed.</p>
        </section>
      </PageContent>
    </AppShell>
  );
}
