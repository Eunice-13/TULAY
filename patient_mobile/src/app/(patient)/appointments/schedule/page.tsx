import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { SlotPicker } from "@/features/appointments/SlotPicker";
import { bookingQuery, isTimeSlot, isVisitType } from "@/features/appointments/booking";

export const metadata: Metadata = { title: "Choose your Visit Time • TULAY" };

type SearchParams = Promise<{ visit?: string; slot?: string }>;

/** TULAY / P5 • Select date and time (222:3561) */
export default async function SchedulePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const visit = isVisitType(params.visit) ? params.visit : "consultation";
  const slot = isTimeSlot(params.slot) ? params.slot : "9:00 AM";

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5">
        <BackLink href={`/appointments${bookingQuery({ visit, slot })}`} />
        <h1 className="w-full text-2xl font-semibold text-primary">Choose your Visit Time</h1>
        <p className="w-full text-sm text-muted">Available slots at Demo Community Clinic.</p>
        <SlotPicker visit={visit} initialSlot={slot} />
      </PageContent>
    </AppShell>
  );
}
