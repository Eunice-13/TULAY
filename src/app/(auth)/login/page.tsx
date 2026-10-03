import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = { title: "Log in • TULAY" };

/** TULAY / Log in • YAKAP member (222:2137) */
export default function LoginPage() {
  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href="/" size="sm" />
        <h1 className="w-full text-2xl font-bold text-primary">Log in</h1>
        <p className="w-full text-sm font-medium text-muted">Use your TULAY account to continue.</p>
        <LoginForm />
      </PageContent>
    </AppShell>
  );
}
