import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { GuideIndex } from "@/features/access-plan/GuideScreens";
import { ACTIVE_GUIDE } from "@/features/access-plan/guide-context";

export const metadata: Metadata = { title: "Understand YAKAP-GAMOT • TULAY" };

/** TULAY / P4 • Active patient guide (222:5038) */
export default function ActiveGuidePage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <GuideIndex {...ACTIVE_GUIDE} />
      </PageContent>
    </AppShell>
  );
}
