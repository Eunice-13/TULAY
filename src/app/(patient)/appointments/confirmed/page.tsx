import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { InfoRow } from "@/components/ui/InfoRow";
import { BOOKING_DATE, isTimeSlot, isVisitType } from "@/features/appointments/booking";

export const metadata: Metadata = { title: "Your appointment is booked • TULAY" };

type SearchParams = Promise<{ visit?: string; slot?: string }>;

/** TULAY / P5 • Appointment confirmed (222:3624) */
export default async function AppointmentConfirmedPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const slot = isTimeSlot(params.slot) ? params.slot : "9:00 AM";
  const visitLabel =
    isVisitType(params.visit) && params.visit === "lab" ? "Doctor-ordered laboratory test" : "Primary care consultation";

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5">
        <BackLink href="/appointments" />
        <h1 className="w-full text-2xl font-semibold text-primary">Your appointment is booked</h1>
        <p className="w-full text-sm text-muted">Confirmation example • Demo booking.</p>
        <p className="w-full p-2 text-sm text-positive" role="status">
          Confirmed
        </p>

        <section aria-label="Appointment" className="flex w-full items-center gap-3 rounded-tulay bg-canvas p-4">
          <div className="flex min-w-0 flex-1 flex-col gap-3 break-words-safe">
            <h2 className="text-base font-semibold text-primary">
              {BOOKING_DATE} • {slot}
            </h2>
            <p className="text-sm text-muted">
              {visitLabel}
              <br />
              Demo Community Clinic
            </p>
          </div>
          <Icon name="check" size={64} />
        </section>

        <InfoRow title="Booking Reference">TULAY-DEMO-001</InfoRow>
        <InfoRow title="Before your Visit">Bring your clinic-requested documents and relevant medical records.</InfoRow>

        <div className="flex w-full flex-col gap-5 md:flex-row md:gap-4">
          <ButtonLink href="/facilities/demo-community-clinic">View Clinic</ButtonLink>
          <ButtonLink href="/dashboard" variant="secondary">
            Back to dashboard
          </ButtonLink>
        </div>
      </PageContent>
    </AppShell>
  );
}
