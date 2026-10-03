import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ProfileForm } from "@/features/registration/ProfileForm";

export const metadata: Metadata = { title: "Edit your profile • TULAY" };

/** TULAY / Profile • Pending account (222:5399) */
export default function PendingProfilePage() {
  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="next">
      <PageContent gap="gap-5">
        <BackLink href="/onboarding/menu" />
        <h1 className="w-full text-2xl font-semibold text-primary">Edit your profile</h1>
        <p className="w-full text-sm text-muted">Review patient and dependent details.</p>
        <ProfileForm state="pending" />
      </PageContent>
    </AppShell>
  );
}
