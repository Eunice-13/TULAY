import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { FormHeading } from "@/features/registration/FormHeading";
import { RegistrationForm } from "@/features/registration/RegistrationForm";
import { formatLongDate } from "@/features/registration/date";
import { MEMBERSHIP_CATEGORIES, isMembershipCategory } from "@/features/registration/membership";

export const metadata: Metadata = { title: "Create your account • TULAY" };

type SearchParams = Promise<{ birth?: string; category?: string }>;

/** TULAY / P1 • Registration (222:2397) */
export default async function RegisterPage({ searchParams }: { searchParams: SearchParams }) {
  const { birth, category } = await searchParams;
  const birthDate = formatLongDate(birth) ? birth as string : "1985-06-15";
  const birthDateLabel = formatLongDate(birthDate) ?? "June 15, 1985";
  const categoryLabel = isMembershipCategory(category)
    ? MEMBERSHIP_CATEGORIES[category].label
    : "Select direct or indirect contributor";

  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5">
        <BackLink href="/login" size="sm" tone="primary" />
        <FormHeading>Create your account</FormHeading>
        <RegistrationForm birthDateLabel={birthDateLabel} birthDate={birthDate} categoryLabel={categoryLabel} />
      </PageContent>
    </AppShell>
  );
}
