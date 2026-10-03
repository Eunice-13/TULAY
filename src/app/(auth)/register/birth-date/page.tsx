import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { BirthDateCalendar } from "@/features/registration/BirthDateCalendar";

export const metadata: Metadata = { title: "Choose a Birth Date • TULAY" };

type SearchParams = Promise<{ for?: string }>;

/** Screens that open the calendar picker and receive `?birth=` back. */
const RETURN_PATHS: Record<string, string> = {
  self: "/register",
  dependent: "/register/dependents",
  "edit-active": "/account/dependents",
  "edit-pending": "/onboarding/dependents",
};

/** TULAY / P1 • Birth date calendar (222:2638) */
export default async function BirthDatePage({ searchParams }: { searchParams: SearchParams }) {
  const { for: target } = await searchParams;
  const returnTo = (target && RETURN_PATHS[target]) || "/register";

  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href={returnTo} size="sm" tone="primary" />
        <h1 className="w-full text-2xl font-bold text-primary">Choose a Birth Date</h1>
        <p className="w-full text-sm font-medium text-primary">Calendar selection example.</p>
        <BirthDateCalendar year={1985} month={6} daysInMonth={30} initialDay={15} returnTo={returnTo} />
      </PageContent>
    </AppShell>
  );
}
