import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { InfoRow } from "@/components/ui/InfoRow";
import { SmsPreference } from "@/features/restock-alerts/SmsPreference";

export const metadata: Metadata = { title: "SMS restock preference • TULAY" };

type SearchParams = Promise<{ sms?: string }>;

/** TULAY / SMS • Visual preference (222:3988) / Visual On state (222:5562 via `?sms=on`). */
export default async function SmsPreferencePage({ searchParams }: { searchParams: SearchParams }) {
  const { sms } = await searchParams;
  const backHref = "/pharmacy-finder/demo-care-pharmacy";

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href={backHref} />
        <h1 className="w-full text-2xl font-semibold text-primary">SMS restock preference</h1>
        <p className="w-full text-sm text-muted">For this medicine at this pharmacy.</p>
        <InfoRow title="Your selection">
          Demo medicine A • 500 mg
          <br />
          Demo Care Pharmacy
        </InfoRow>
        <SmsPreference initialOn={sms === "on"} backHref={backHref} />
      </PageContent>
    </AppShell>
  );
}
