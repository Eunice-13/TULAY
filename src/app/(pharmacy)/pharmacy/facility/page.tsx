import type { Metadata } from "next";

import { PageHeading } from "@/components/ui/page-heading";
import { FacilityForm } from "@/features/account/facility-form";
import { getOwnFacilityProfile } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Facility profile · TULAY" };

export default async function PharmacyFacilityPage() {
  const { facilityId, profile } = await getOwnFacilityProfile();
  return (
    <>
      <PageHeading title="Facility profile" description="Manage the public details of your assigned pharmacy." />
      <FacilityForm facilityId={facilityId} facility={profile} />
    </>
  );
}
