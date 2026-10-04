import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { FormHeading } from "@/features/registration/FormHeading";
import { RegistrationForm } from "@/features/registration/RegistrationForm";

export const metadata: Metadata = { title: "Create your account • TULAY" };

export default function RegisterPage() {
  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href="/" size="sm" tone="primary" />
        <FormHeading>Create your account</FormHeading>
        <RegistrationForm />
      </PageContent>
    </AppShell>
  );
}
