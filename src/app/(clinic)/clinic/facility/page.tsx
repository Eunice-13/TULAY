import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { Card, CardTitle, DetailItem } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { PageHeading } from "@/components/ui/page-heading";
import { getClinicWorkspace, getSignedInStaff } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Your workplace · TULAY" };

/** Figma CS5 — assigned clinic details (read-only). */
export default async function ClinicFacilityPage() {
  const clinic = await getClinicWorkspace();
  if (!clinic) redirect("/login/workplace");
  const previewClinicStaff = await getSignedInStaff("clinic_staff");

  return (
    <>
      <PageHeading
        title="Your workplace"
        description="Clinic and dispensing permissions are assigned by your administrator."
      />
      <Card labelledBy="clinic-heading" className="max-w-2xl">
        <CardTitle id="clinic-heading">{clinic.name}</CardTitle>
        <dl className="mt-4 grid gap-4">
          <DetailItem label="Clinic Staff account" value={previewClinicStaff.fullName} />
          <DetailItem
            label="Service capability"
            value={clinic.hasDispensary ? "Medicine dispensing available" : "No dispensary"}
          />
          <DetailItem label="Account verification and activation" value="Enabled" />
        </dl>
        <Notice className="mt-5">Clinic Staff at clinics without a dispensary receive an activation-only workspace.</Notice>
        <LinkButton href="/clinic/dashboard" variant="secondary" className="mt-5">
          Back to workspace
        </LinkButton>
      </Card>
    </>
  );
}
