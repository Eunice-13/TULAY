import type { Metadata } from "next";

import { PageHeading } from "@/components/ui/page-heading";
import { StockEditor } from "@/features/availability/stock-editor";
import { getSignedInStaff, listOwnAvailability } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Medicine stock · TULAY" };

/** Figma PH2 / PH2O / PH2S / PH2SO. */
export default async function PharmacyStockPage() {
  const staff = await getSignedInStaff("pharmacy_staff");
  const { facilityId, medicines } = await listOwnAvailability("pharmacy");
  return (
    <>
      <PageHeading title="Medicine stock" description="Update reports for your assigned pharmacy." />
      <StockEditor
        facilityId={facilityId}
        medicines={medicines}
        reportSource="Your assigned pharmacy"
        updatedBy={`${staff.fullName} · Pharmacy Staff`}
      />
    </>
  );
}
