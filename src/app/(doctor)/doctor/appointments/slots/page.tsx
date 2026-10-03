import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { TimeSlotEditor } from "@/features/appointments/time-slot-editor";
import { listTimeBlocks } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Clinic availability · TULAY" };

export default async function TimeSlotsPage() {
  const previewTimeBlocks = await listTimeBlocks();
  return (
    <>
      <PageHeading
        title="Clinic availability"
        description="Publish days, time blocks and service capacity for patient booking."
        actions={<LinkButton href="/doctor/appointments" variant="secondary">
              <span aria-hidden="true">←</span> Appointments
            </LinkButton>}
      />
      <TimeSlotEditor initialBlocks={previewTimeBlocks} />
    </>
  );
}
