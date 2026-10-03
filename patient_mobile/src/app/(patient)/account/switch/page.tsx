import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Switch Account • TULAY" };

type SearchParams = Promise<{ state?: string }>;

const PROFILES = [
  {
    name: "Maria A. Dela Cruz",
    detail: "Primary member • Active",
    cta: "Continue as Maria",
    href: "/dashboard",
    surface: "bg-canvas",
    variant: "primary",
  },
  {
    name: "Juan A. Dela Cruz",
    detail: "Dependent • Pending activation",
    cta: "View pending profile",
    href: "/onboarding/pending",
    surface: "bg-soft",
    variant: "secondary",
  },
] as const;

/** TULAY / Switch account (222:4531) — no bottom navigation, as in Figma. */
export default async function SwitchAccountPage({ searchParams }: { searchParams: SearchParams }) {
  const { state } = await searchParams;
  const pending = state === "pending";
  const menuHref = pending ? "/onboarding/menu" : "/account";

  return (
    <AppShell menuHref={menuHref} homeHref={pending ? "/onboarding/pending" : "/dashboard"}>
      <PageContent gap="gap-5">
        <BackLink href={menuHref} />
        <h1 className="w-full text-2xl font-semibold text-primary">Switch Account</h1>
        <p className="w-full text-sm text-muted">Choose the demo patient profile to view.</p>
        <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          {PROFILES.map((profile) => (
            <li key={profile.name}>
              <section
                aria-label={profile.name}
                className={`flex h-full w-full flex-col gap-3 rounded-tulay p-4 ${profile.surface}`}
              >
                <h2 className="text-base font-semibold text-primary">{profile.name}</h2>
                <p className="flex-1 text-sm text-muted">{profile.detail}</p>
                <ButtonLink href={profile.href} variant={profile.variant}>
                  {profile.cta}
                </ButtonLink>
              </section>
            </li>
          ))}
        </ul>
      </PageContent>
    </AppShell>
  );
}
