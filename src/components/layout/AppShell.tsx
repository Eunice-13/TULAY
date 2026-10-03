import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { PatientNav, type NavKey, type NavVariant } from "./PatientNav";

const PENDING_KEYS: ReadonlySet<NavKey> = new Set<NavKey>(["next", "clinics", "guide"]);
import { PhoneHeader } from "./PhoneHeader";

/**
 * Page chrome for the patient phone UI.
 * - Mobile (base, 390px design): header → scrollable content → optional bottom nav.
 * - lg+: header spans the viewport, nav becomes a left rail, content is centred.
 */
type AppShellProps = {
  children: ReactNode;
  /** Account menu destination; omit to hide the header (e.g. Start screen). */
  menuHref?: string;
  homeHref?: string;
  /** Show the bottom navigation with this item selected ("none" = no selection). */
  nav?: NavKey | "none";
  /** Inferred from `nav` when omitted (pending keys → pending navigation). */
  navVariant?: NavVariant;
  className?: string;
};

export function AppShell({ children, menuHref, homeHref, nav, navVariant, className }: AppShellProps) {
  const hasNav = nav !== undefined;
  const variant: NavVariant = navVariant ?? (nav && nav !== "none" && PENDING_KEYS.has(nav) ? "pending" : "active");
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      {menuHref ? <PhoneHeader menuHref={menuHref} homeHref={homeHref} /> : null}
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {hasNav ? <PatientNav variant={variant} active={nav === "none" ? undefined : nav} /> : null}
        <main
          id="main-content"
          tabIndex={-1}
          className={cn("flex w-full min-w-0 flex-1 flex-col outline-none", hasNav && "pb-nav lg:pb-0", className)}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * "Page content" auto-layout frame: 24px padding with a per-screen gap.
 * Width scales from the 390px phone column to a comfortable reading width.
 */
type PageContentProps = {
  children: ReactNode;
  gap?: "gap-3" | "gap-4" | "gap-5" | "gap-6" | "gap-7" | "gap-8";
  width?: "narrow" | "default" | "wide";
  center?: boolean;
  className?: string;
};

const WIDTHS = {
  narrow: "max-w-md",
  default: "md:max-w-2xl lg:max-w-3xl",
  wide: "md:max-w-3xl lg:max-w-5xl",
} as const;

export function PageContent({ children, gap = "gap-5", width = "default", center, className }: PageContentProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col p-6 md:px-8 md:py-10",
        center ? "items-center" : "items-start",
        gap,
        WIDTHS[width],
        className,
      )}
    >
      {children}
    </div>
  );
}
