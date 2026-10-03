import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { EnrollmentGuide } from "@/features/access-plan/GuideScreens";
import { ACTIVE_GUIDE } from "@/features/access-plan/guide-context";

export const metadata: Metadata = { title: "Enroll through your clinic • TULAY" };

/** TULAY / P4 • Active enrollment guide (222:5195) */
export default function ActiveEnrollmentGuidePage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <EnrollmentGuide {...ACTIVE_GUIDE} backHref={ACTIVE_GUIDE.base} />
      </PageContent>
    </AppShell>
  );
}
