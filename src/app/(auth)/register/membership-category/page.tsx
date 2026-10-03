import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { MEMBERSHIP_CATEGORIES, type MembershipCategoryKey } from "@/features/registration/membership";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Membership category • TULAY" };

const ORDER: MembershipCategoryKey[] = ["direct", "indirect"];

/** TULAY / P1 • Membership category (222:2601) */
export default function MembershipCategoryPage() {
  return (
    <AppShell menuHref="/menu">
      <PageContent gap="gap-5">
        <BackLink href="/register" size="sm" tone="primary" />
        <h1 className="w-full text-2xl font-bold text-primary">Membership category</h1>
        <p className="w-full text-sm font-medium text-primary">Choose the description that applies to your profile.</p>

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
          {ORDER.map((key) => {
            const category = MEMBERSHIP_CATEGORIES[key];
            const headingId = `category-${key}`;
            return (
              <section
                key={key}
                aria-labelledby={headingId}
                className={cn("flex w-full flex-col gap-3 rounded-tulay p-4", category.surface)}
              >
                <h2 id={headingId} className="text-base font-bold text-primary">
                  {category.title}
                </h2>
                <div className="flex w-full flex-1 items-center gap-3">
                  <ul className="min-w-0 flex-1 text-xs font-bold text-black break-words-safe">
                    {category.members.map((member) => (
                      <li key={member}>• {member}</li>
                    ))}
                  </ul>
                  <Icon name="user" size={40} />
                </div>
                <ButtonLink href={`/register?category=${key}`}>{category.cta}</ButtonLink>
              </section>
            );
          })}
        </div>
      </PageContent>
    </AppShell>
  );
}
