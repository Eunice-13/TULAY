import type { Metadata } from "next";

import { PageHeading } from "@/components/ui/page-heading";
import { ProfileForm } from "@/features/account/profile-form";
import { getSignedInStaff } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Edit profile · TULAY" };

export default async function ClinicProfilePage() {
  const previewClinicStaff = await getSignedInStaff("clinic_staff");
  return (
    <>
      <PageHeading title="Edit profile" description="Manage your professional account details." />
      <ProfileForm account={previewClinicStaff} idLabel="Clinic staff ID" />
    </>
  );
}
