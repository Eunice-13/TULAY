import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ProfileForm } from "@/features/registration/ProfileForm";

export const metadata: Metadata = { title: "Edit Your Profile • TULAY" };

/** TULAY / Edit profile (222:4431) */
export default function EditProfilePage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5">
        <BackLink href="/account" />
        <h1 className="w-full text-2xl font-semibold text-primary">Edit Your Profile</h1>
        <p className="w-full text-sm text-muted">Review Patient and Dependent details.</p>
        <ProfileForm state="active" />
      </PageContent>
    </AppShell>
  );
}
