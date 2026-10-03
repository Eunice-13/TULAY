import type { Metadata } from "next";
import Link from "next/link";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Icon, type IconName } from "@/components/ui/Icon";
import { InfoRow } from "@/components/ui/InfoRow";
import { ListLink } from "@/components/ui/ListLink";
import { DEMO_PATIENT } from "@/features/registration/mock-data";

export const metadata: Metadata = { title: "Home • TULAY" };

const QUICK_ACTIONS: Array<{ href: string; icon: IconName; label: string }> = [
  { href: "/appointments", icon: "calendar", label: "Book a visit" },
  { href: "/prescriptions", icon: "rx", label: "My E-Reseta" },
];

/**
 * TULAY / P6 • Active dashboard (222:3105), plus the 320px (222:4668) and
 * 430px (222:4762) responsive variants — the layout is fluid between them.
 */
export default function DashboardPage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="home">
      <PageContent gap="gap-5" width="wide">
        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="flex min-w-0 flex-col gap-5">
            <h1 className="text-2xl font-semibold text-primary">Hello, {DEMO_PATIENT.firstName}</h1>
            <p className="text-sm text-muted">Here’s what’s next for your care.</p>
            <Badge>Active - Verified by Clinic Staff</Badge>

            <section aria-labelledby="next-visit" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4">
              <h2 id="next-visit" className="text-base font-semibold text-primary">
                Your next Clinic Visit
              </h2>
              <div className="flex w-full items-start gap-3">
                <Icon name="calendar" size={36} />
                <InfoRow title="October 7 • 9:00 AM" className="min-w-0 flex-1">
                  Primary care consultation
                </InfoRow>
              </div>
              <InfoRow title="Demo Community Clinic">Confirmed • Arrive during your selected slot.</InfoRow>
              <ButtonLink href="/appointments/confirmed" variant="secondary">
                View appointment
              </ButtonLink>
            </section>
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <ul className="flex w-full gap-3">
              {QUICK_ACTIONS.map((action) => (
                <li key={action.href} className="flex min-w-0 flex-1">
                  <Link
                    href={action.href}
                    className="flex w-full flex-col items-start gap-3 rounded-[16px] bg-soft p-4 hover:shadow-md"
                  >
                    <Icon name={action.icon} size={28} />
                    <span className="text-sm font-semibold text-primary break-words-safe">{action.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <InfoRow title="Your active prescription">
              Demo E-Reseta • Issued October 4
              <br />
              View your medicines and unique mock UPSC
            </InfoRow>
            <ButtonLink href="/prescriptions/demo-ereseta">Open E-Reseta</ButtonLink>

            <Divider />

            <ListLink
              href="/benefit-balance"
              icon="wallet"
              copyGap="gap-3"
              title="₱20,000 estimated balance"
              description="Full demo balance • No reported claims."
            />
            <ListLink
              href="/referrals"
              icon="hospital"
              copyGap="gap-3"
              title="My referrals"
              description="See your doctor’s referral and next step."
            />
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
}
