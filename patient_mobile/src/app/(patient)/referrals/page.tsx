import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Your Referrals • TULAY" };

/** TULAY / P10 • No referrals (222:4242) */
export default function ReferralsPage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href="/dashboard" />
        <h1 className="w-full text-2xl font-semibold text-primary">Your Referrals</h1>
        <p className="w-full text-sm text-muted">No referral has been issued yet.</p>
        <section aria-labelledby="no-referrals" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4">
          <Icon name="user" size={56} />
          <h2 id="no-referrals" className="text-base font-semibold text-primary">
            You currently have no referrals.
          </h2>
          <p className="text-sm text-muted">Please schedule a consultation with your clinic.</p>
          <ButtonLink href="/appointments">Book an appointment</ButtonLink>
        </section>
        <ButtonLink href="/referrals/demo-referral" variant="secondary">
          Preview a Doctor Referral
        </ButtonLink>
      </PageContent>
    </AppShell>
  );
}
