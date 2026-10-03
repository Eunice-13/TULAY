import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { GuideIndex } from "@/features/access-plan/GuideScreens";
import { PUBLIC_GUIDE } from "@/features/access-plan/guide-context";

export const metadata: Metadata = { title: "Understand YAKAP-GAMOT • TULAY" };

/** TULAY / P4 • YAKAP-GAMOT guide (222:2236) */
export default function EligibilityGuidePage() {
  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5" width="wide">
        <GuideIndex {...PUBLIC_GUIDE} />
      </PageContent>
    </AppShell>
  );
}
