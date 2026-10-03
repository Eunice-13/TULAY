import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { DemoClaimForm } from "@/features/access-plan/DemoClaimForm";

export const metadata: Metadata = { title: "Add a Demo Claim • TULAY" };

/** TULAY / P8 • Add demo claim (222:4173) */
export default function AddDemoClaimPage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="balance">
      <PageContent gap="gap-5">
        <BackLink href="/benefit-balance" />
        <h1 className="w-full text-2xl font-semibold text-primary">Add a Demo Claim</h1>
        <DemoClaimForm />
      </PageContent>
    </AppShell>
  );
}
