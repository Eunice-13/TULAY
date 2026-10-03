import type { Metadata } from "next";

import { PageHeading } from "@/components/ui/page-heading";
import { UpscLookup } from "@/features/prescriptions/upsc-lookup";
import { getPreviewHints } from "@/lib/data/queries";

export const metadata: Metadata = { title: "UPSC prescription lookup · TULAY" };

/** Figma PH3 / PH3R. Exact-code lookup only; no prescription browsing. */
export default async function PharmacyLookupPage() {
  const hints = await getPreviewHints();
  return (
    <>
      <PageHeading
        title="Review prescriptions for dispensing"
        description="Enter the patient's UPSC to retrieve and review their prescription."
      />
      <UpscLookup staffLabel="Pharmacy Staff" demoHint={hints?.upsc} />
    </>
  );
}
