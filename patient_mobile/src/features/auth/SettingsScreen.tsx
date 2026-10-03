import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { ListLink } from "@/components/ui/ListLink";

/** TULAY / Settings (222:4560) and Settings • Pending account (222:5489). */
export function SettingsScreen({ state }: { state: "active" | "pending" }) {
  const active = state === "active";
  const menuHref = active ? "/account" : "/onboarding/menu";

  return (
    <AppShell
      menuHref={menuHref}
      homeHref={active ? "/dashboard" : "/onboarding/pending"}
      nav={active ? "none" : "next"}
      navVariant={active ? "active" : "pending"}
    >
      <PageContent gap="gap-5" width="narrow">
        <BackLink href={menuHref} />
        <h1 className="w-full text-2xl font-semibold text-primary">Settings</h1>
        <p className="w-full text-sm text-muted">Preferences for your patient account.</p>
        <ul className="flex w-full flex-col gap-5">
          <li>
            <ListLink
              href={active ? "/account/profile" : "/onboarding/profile"}
              icon="user"
              copyGap="gap-3"
              title="Patient information"
              description="Manage your profile and dependents."
            />
          </li>
          <li>
            <ListLink
              href={active ? "/notifications" : "/onboarding/protected"}
              icon="settings"
              copyGap="gap-3"
              title="SMS preference"
              description="Visual-only option. No messages are sent."
            />
          </li>
          <li>
            <ListLink
              href={active ? "/guide" : "/eligibility-guide"}
              icon="guide"
              copyGap="gap-3"
              title="About TULAY"
              description="Read the patient guide."
            />
          </li>
        </ul>
        <Divider />
        {active ? <span aria-hidden="true" className="block h-5 w-full" /> : null}
        <ButtonLink href={menuHref} variant="secondary">
          Back to account menu
        </ButtonLink>
      </PageContent>
    </AppShell>
  );
}
