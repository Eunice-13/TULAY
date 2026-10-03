import type { ReactNode } from "react";

import { UserIcon } from "@/components/ui/icons";

import { AccountMenu } from "./account-menu";
import { TulayLogo } from "./logo";
import { type NavItem, PrimaryNav } from "./primary-nav";

interface WorkspaceShellProps {
  workspaceLabel: string;
  facilityLabel: string;
  userName: string;
  roleLabel: string;
  navLabel: string;
  navItems: NavItem[];
  profileHref: string;
  settingsHref: string;
  children: ReactNode;
}

/** Persistent header, primary navigation and footer shared by all professional workspaces. */
export function WorkspaceShell({
  workspaceLabel,
  facilityLabel,
  userName,
  roleLabel,
  navLabel,
  navItems,
  profileHref,
  settingsHref,
  children,
}: WorkspaceShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-tulay-8 focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <header className="bg-surface">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 sm:py-4">
          <AccountMenu
            userName={userName}
            roleLabel={roleLabel}
            profileHref={profileHref}
            settingsHref={settingsHref}
          />
          <TulayLogo />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-6">{workspaceLabel}</p>
            <p className="truncate text-xs leading-5 text-secondary-500">{facilityLabel}</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <p className="hidden items-center gap-3 text-sm md:flex">
              <UserIcon />
              <span>
                {userName} · {roleLabel}
              </span>
            </p>
          </div>
        </div>
      </header>

      <PrimaryNav items={navItems} label={navLabel} />

      <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {children}
      </main>

      <footer className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 px-4 py-3 text-xs leading-5 text-secondary-500 sm:flex-row sm:justify-between sm:px-6 lg:px-10">
        <p>TULAY · YAKAP–GAMOT care coordination</p>
      </footer>
    </div>
  );
}
