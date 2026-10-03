import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Log out of TULAY? • TULAY" };

type SearchParams = Promise<{ state?: string }>;

/** TULAY / Log out confirmation (222:4643) — no bottom navigation, as in Figma. */
export default async function LogoutConfirmationPage({ searchParams }: { searchParams: SearchParams }) {
  const { state } = await searchParams;
  const menuHref = state === "pending" ? "/onboarding/menu" : "/account";

  return (
    <AppShell menuHref={menuHref} homeHref={state === "pending" ? "/onboarding/pending" : "/dashboard"}>
      <PageContent gap="gap-5" width="narrow">
        <BackLink href={menuHref} />
        <section aria-labelledby="logout-title" aria-describedby="logout-desc" className="flex w-full flex-col gap-5">
          <h1 id="logout-title" className="text-2xl font-bold text-danger">
            Log out of TULAY?
          </h1>
          <p id="logout-desc" className="text-sm text-muted">
            You can log in again to view your care information.
          </p>
          <Icon name="logout" size={48} />
          <ButtonLink href="/">Log out</ButtonLink>
          <ButtonLink href={menuHref} variant="secondary">
            Stay signed in
          </ButtonLink>
        </section>
      </PageContent>
    </AppShell>
  );
}
