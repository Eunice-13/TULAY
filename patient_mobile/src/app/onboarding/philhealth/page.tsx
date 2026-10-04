import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { RegistryMatchForm } from "@/features/registration/RegistryMatchForm";

export const metadata: Metadata = { title: "Check your demo record • TULAY" };

export default function PhilHealthMatchPage() {
  return (
    <AppShell menuHref="/onboarding/menu">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href="/" size="sm" tone="primary" />
        <h1 className="w-full text-2xl font-bold text-primary">Check your fictional registry record</h1>
        <p className="w-full text-sm text-muted">Use only the fictional demo details supplied by the team. Do not enter real patient information.</p>
        <RegistryMatchForm />
      </PageContent>
    </AppShell>
  );
}
