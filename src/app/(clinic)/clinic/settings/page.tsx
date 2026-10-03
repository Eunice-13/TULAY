import type { Metadata } from "next";

import { PageHeading } from "@/components/ui/page-heading";
import { SettingsForm } from "@/features/account/settings-form";

export const metadata: Metadata = { title: "Settings · TULAY" };

export default function ClinicSettingsPage() {
  return (
    <>
      <PageHeading title="Settings" description="Manage sign-in security and display preferences." />
      <SettingsForm />
    </>
  );
}
