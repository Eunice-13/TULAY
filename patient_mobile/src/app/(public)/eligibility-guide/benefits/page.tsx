import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BenefitsGuide } from "@/features/access-plan/GuideScreens";
import { PUBLIC_GUIDE } from "@/features/access-plan/guide-context";

export const metadata: Metadata = { title: "Your care benefits • TULAY" };

/** TULAY / P4 • Benefits guide (222:2276) */
export default function BenefitsGuidePage() {
  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5" width="wide">
        <BenefitsGuide {...PUBLIC_GUIDE} backHref={PUBLIC_GUIDE.base} />
      </PageContent>
    </AppShell>
  );
}
