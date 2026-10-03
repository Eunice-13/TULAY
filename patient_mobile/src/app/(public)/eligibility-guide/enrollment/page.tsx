import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { EnrollmentGuide } from "@/features/access-plan/GuideScreens";
import { PUBLIC_GUIDE } from "@/features/access-plan/guide-context";

export const metadata: Metadata = { title: "Enroll through your clinic • TULAY" };

/** TULAY / P4 • Walk-in enrollment guide (222:2341) */
export default function EnrollmentGuidePage() {
  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5" width="wide">
        <EnrollmentGuide {...PUBLIC_GUIDE} backHref={PUBLIC_GUIDE.base} />
      </PageContent>
    </AppShell>
  );
}
