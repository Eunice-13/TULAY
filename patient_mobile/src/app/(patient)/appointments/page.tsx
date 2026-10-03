import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { LinkField } from "@/components/ui/TextField";
import {
  BOOKING_DATE,
  VISIT_TYPES,
  bookingQuery,
  isTimeSlot,
  isVisitType,
} from "@/features/appointments/booking";

export const metadata: Metadata = { title: "Book a Clinic Visit • TULAY" };

type SearchParams = Promise<{ visit?: string; slot?: string }>;

/** TULAY / P5 • Book appointment (222:3493) */
export default async function BookAppointmentPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const visit = isVisitType(params.visit) ? params.visit : "consultation";
  const slot = isTimeSlot(params.slot) ? params.slot : "9:00 AM";
  const query = bookingQuery({ visit, slot });

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="book">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/dashboard" />
        <h1 className="w-full text-2xl font-semibold text-primary">Book a Clinic Visit</h1>
        <p className="w-full text-sm text-muted">Appointments are for active accounts.</p>

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-5">
            <InfoRow title="Your selected Clinic">
              Demo Community Clinic
              <br />
              Mon–Fri, 8:00 AM–5:00 PM
            </InfoRow>
            <LinkField
              tone="muted"
              href={`/appointments/visit-type${query}`}
              label="Visit Type"
              value={VISIT_TYPES.consultation}
              hint={"\u00a0"}
              hintTone="muted"
            />
            <LinkField
              tone="muted"
              href={`/appointments/visit-type${query}`}
              label="Doctor-ordered Test (if applicable)"
              value={visit === "lab" ? VISIT_TYPES.lab : "No test selected"}
              hint="Tests require your doctor’s order."
              hintTone="muted"
            />
            <LinkField
              tone="muted"
              href={`/appointments/schedule${query}`}
              label="Date and Time"
              value={`${BOOKING_DATE} • ${slot}`}
              hint="Choose an available slot."
              hintTone="muted"
            />
          </div>

          <div className="flex flex-col gap-5">
            <section aria-labelledby="pila" className="flex w-full flex-col gap-3 rounded-tulay bg-soft p-4">
              <h2 id="pila" className="text-base font-semibold text-primary">
                Pila • Estimated Queue
              </h2>
              <p className="text-sm text-muted">4 patients ahead. The queue may change during the day.</p>
            </section>
            <ButtonLink href={`/appointments/confirmed${query}`}>Review and book</ButtonLink>
            <p className="w-full text-sm text-muted">
              If stock is incomplete, ask clinic or pharmacy staff for a written note about the missing medicine.
              TULAY does not generate a dispensing slip.
            </p>
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
}
