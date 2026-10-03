import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { DependentForm } from "@/features/registration/DependentForm";
import { FormHeading } from "@/features/registration/FormHeading";
import { formatLongDate } from "@/features/registration/date";

export const metadata: Metadata = { title: "Your dependents • TULAY" };

type SearchParams = Promise<{ birth?: string }>;

/** TULAY / P1 • Dependents (222:2506) */
export default async function DependentsPage({ searchParams }: { searchParams: SearchParams }) {
  const { birth } = await searchParams;

  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5">
        <BackLink href="/register" size="sm" tone="primary" />
        <FormHeading>Your dependents</FormHeading>
        <p className="w-full text-sm font-medium text-primary">Add a qualified dependent, or complete this later.</p>
        <DependentForm
          variant="onboarding"
          birthDateLabel={formatLongDate(birth) ?? undefined}
          birthDateHref="/register/birth-date?for=dependent"
          nextHref="/onboarding/philhealth"
        />
      </PageContent>
    </AppShell>
  );
}
