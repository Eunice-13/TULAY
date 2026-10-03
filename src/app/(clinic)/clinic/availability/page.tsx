import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { DispensaryRequired } from "@/features/availability/dispensary-required";
import { StockEditor } from "@/features/availability/stock-editor";
import { getClinicWorkspace, getSignedInStaff, listOwnAvailability } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Clinic dispensary availability · TULAY" };

/** Figma CS4 — clinic dispensary availability (dispensary clinics only). */
export default async function ClinicAvailabilityPage() {
  const clinic = await getClinicWorkspace();
  const staff = await getSignedInStaff("clinic_staff");
  const { facilityId, medicines } = await listOwnAvailability("clinic");

  return (
    <>
      <PageHeading
        title="Clinic dispensary availability"
        description="Manage permitted medicine reports for your assigned clinic."
        actions={
          <LinkButton href="/clinic/facility" variant="secondary">
            <span aria-hidden="true">←</span> Facility
          </LinkButton>
        }
      />
      {clinic?.hasDispensary ? (
        <StockEditor
          facilityId={facilityId}
          medicines={medicines}
          reportSource={`${clinic.name} dispensary`}
          updatedBy={`${staff.fullName} · Clinic Staff`}
        />
      ) : (
        <DispensaryRequired />
      )}
    </>
  );
}
