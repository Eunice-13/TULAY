import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { ProtectedAccessMessage } from "@/components/feedback/ProtectedAccessMessage";
import { BackLink } from "@/components/ui/BackLink";

export const metadata: Metadata = { title: "Clinic activation required • TULAY" };

/** TULAY / Pending • Protected access (222:3060) */
export default function ProtectedAccessPage() {
  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="none" navVariant="pending">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href="/onboarding/pending" />
        <ProtectedAccessMessage />
      </PageContent>
    </AppShell>
  );
}
