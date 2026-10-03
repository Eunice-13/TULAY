import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { FormularyChecker } from "@/features/formulary/FormularyChecker";

export const metadata: Metadata = { title: "Check Your Medicines • TULAY" };

/** TULAY / P4 • Formulary checker (222:3408) */
export default function FormularyPage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/directory" size="sm" tone="primary" />
        <h1 className="w-full text-2xl font-bold text-primary">Check Your Medicines</h1>
        <p className="w-full text-sm font-medium text-primary">
          Mock formulary • 75-entry target: 21 clinic, 54 pharmacy.
        </p>
        <FormularyChecker />
        <p className="w-full text-sm text-black">
          Availability reports are not guaranteed stock. A doctor’s prescription is required for medicines.
        </p>
      </PageContent>
    </AppShell>
  );
}
