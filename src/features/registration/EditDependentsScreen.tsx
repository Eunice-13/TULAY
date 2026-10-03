import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { DependentForm } from "./DependentForm";
import { FormHeading } from "./FormHeading";
import { formatLongDate } from "./date";

/** P1 • Edit dependents • Active (222:5680) and • Pending (222:5775) share this layout. */
export function EditDependentsScreen({ state, birth }: { state: "active" | "pending"; birth?: string }) {
  const isActive = state === "active";
  const profileHref = isActive ? "/account/profile" : "/onboarding/profile";

  return (
    <AppShell menuHref={isActive ? "/account" : "/onboarding/menu"} homeHref={isActive ? "/dashboard" : "/onboarding/pending"}>
      <PageContent gap="gap-5">
        <BackLink href={profileHref} size="sm" tone="primary" />
        <FormHeading>Your Dependents</FormHeading>
        <p className="w-full text-sm font-bold text-primary">Add a qualified dependent, or complete this later.</p>
        <DependentForm
          variant="edit"
          birthDateLabel={formatLongDate(birth) ?? undefined}
          birthDateHref={`/register/birth-date?for=edit-${state}`}
          nextHref={profileHref}
        />
      </PageContent>
    </AppShell>
  );
}
