import type { Metadata } from "next";

import { PageHeading } from "@/components/ui/page-heading";
import { DispensaryRequired } from "@/features/availability/dispensary-required";
import { UpscLookup } from "@/features/prescriptions/upsc-lookup";
import { getClinicWorkspace, getPreviewHints } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Prescription review · TULAY" };

/** Figma CS3 / CS3R — only for staff assigned to a clinic with a dispensary. */
export default async function ClinicDispensingPage() {
  const clinic = await getClinicWorkspace();
  const hints = await getPreviewHints();

  return (
    <>
      <PageHeading
        title="Review prescriptions for dispensing"
        description={`${clinic?.name ?? "Your clinic"} · Available only to staff assigned to this clinic's dispensary.`}
      />
      {clinic?.hasDispensary ? (
        <UpscLookup staffLabel="Clinic Staff" demoHint={hints?.upsc} />
      ) : (
        <DispensaryRequired />
      )}
    </>
  );
}
