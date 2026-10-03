import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { AppointmentsBoard } from "@/features/appointments/appointments-board";
import { listAppointments } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Appointments · TULAY" };

export default async function DoctorAppointmentsPage() {
  const { today, appointments } = await listAppointments();
  return (
    <>
      <PageHeading
        title="Appointments and services"
        description="Manage consultation, laboratory and screening appointments."
        actions={<LinkButton href="/doctor/appointments/slots">Manage time slots</LinkButton>}
      />
      <AppointmentsBoard appointments={appointments} today={today} />
    </>
  );
}
