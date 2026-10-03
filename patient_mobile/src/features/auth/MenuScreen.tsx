import Link from "next/link";
import { Fragment } from "react";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ListLink } from "@/components/ui/ListLink";
import { cn } from "@/lib/cn";

/**
 * Full-screen account menus: Menu • Before login (222:5275),
 * Menu • Pending account (222:5335) and Account menu (222:4366).
 * The header menu button toggles back to `closeHref`.
 */
export type MenuLink = { href: string; icon: IconName; title: string; description: string };

type MenuScreenProps = {
  title: string;
  closeHref: string;
  homeHref: string;
  profile?: { name: string; subtitle?: string };
  links: MenuLink[];
  /** Account menu separates links with dividers. */
  dividers?: boolean;
  actions?: Array<{ href: string; label: string }>;
  /** Vertical spacer before "Log out" (70px active, 80px pending). */
  spacer?: "h-[70px]" | "h-20";
  logoutHref?: string;
};

export function MenuScreen({
  title,
  closeHref,
  homeHref,
  profile,
  links,
  dividers,
  actions = [],
  spacer,
  logoutHref,
}: MenuScreenProps) {
  return (
    <AppShell menuHref={closeHref} homeHref={homeHref}>
      <PageContent gap="gap-5" width="narrow">
        <div className="flex w-full items-start gap-3">
          <h1 className="min-w-0 flex-1 text-2xl font-semibold text-primary">{title}</h1>
          <Link href={closeHref} aria-label="Close menu" className="-m-2.5 flex size-11 items-center justify-center rounded-tulay hover:bg-canvas/60">
            <Icon name="close" size={24} />
          </Link>
        </div>

        {profile ? (
          <section aria-label="Signed-in profile" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4">
            <Icon name="user" size={48} />
            <p className="text-base font-semibold text-primary">{profile.name}</p>
            {profile.subtitle ? <p className="text-sm text-muted">{profile.subtitle}</p> : null}
          </section>
        ) : null}

        <nav aria-label={title} className="w-full">
          <ul className="flex w-full flex-col gap-5">
            {links.map((link, index) => (
              <Fragment key={link.href + link.title}>
                {dividers && index > 0 ? (
                  <li aria-hidden="true">
                    <Divider />
                  </li>
                ) : null}
                <li>
                  <ListLink
                    href={link.href}
                    icon={link.icon}
                    copyGap="gap-3"
                    title={link.title}
                    description={link.description}
                  />
                </li>
              </Fragment>
            ))}
          </ul>
        </nav>

        {actions.map((action) => (
          <ButtonLink key={action.href} href={action.href} variant="secondary">
            {action.label}
          </ButtonLink>
        ))}

        {spacer ? <div aria-hidden="true" className={cn("w-full", spacer)} /> : null}
        {logoutHref ? (
          <ButtonLink href={logoutHref} variant="ghost">
            Log out
          </ButtonLink>
        ) : null}
      </PageContent>
    </AppShell>
  );
}
