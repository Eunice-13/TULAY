import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BenefitsGuide } from "@/features/access-plan/GuideScreens";
import { ACTIVE_GUIDE } from "@/features/access-plan/guide-context";

export const metadata: Metadata = { title: "Your care benefits • TULAY" };

/** TULAY / P4 • Active benefits guide (222:5104) */
export default function ActiveBenefitsGuidePage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <BenefitsGuide {...ACTIVE_GUIDE} backHref={ACTIVE_GUIDE.base} />
      </PageContent>
    </AppShell>
  );
}
