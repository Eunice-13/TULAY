import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Bottom navigation.
 * - "active": P6 feature navigation (224:2287) • Home Care Book E-reseta Balance
 * - "pending": Bottom navigation (222:2853) • Next step Clinics Guide
 * Mobile: 76px bottom bar (as in Figma). lg+: the same items stack into a
 * left rail so the desktop layout keeps identical destinations.
 */
export type ActiveNavKey = "home" | "care" | "book" | "ereseta" | "balance";
export type PendingNavKey = "next" | "clinics" | "guide";
export type NavKey = ActiveNavKey | PendingNavKey;
export type NavVariant = "active" | "pending";

type NavItem = { key: NavKey; label: string; href: string; icon?: IconName };

const ITEMS: Record<NavVariant, NavItem[]> = {
  active: [
    { key: "home", label: "Home", href: "/dashboard", icon: "home" },
    { key: "care", label: "Care", href: "/directory", icon: "pin" },
    { key: "book", label: "Book", href: "/appointments", icon: "calendar" },
    { key: "ereseta", label: "E-Reseta", href: "/prescriptions", icon: "rx" },
    { key: "balance", label: "Balance", href: "/benefit-balance" },
  ],
  pending: [
    { key: "next", label: "Next step", href: "/onboarding/pending", icon: "home" },
    { key: "clinics", label: "Clinics", href: "/onboarding/clinic", icon: "pin" },
    { key: "guide", label: "Guide", href: "/eligibility-guide", icon: "guide" },
  ],
};

export function PatientNav({ variant = "active", active }: { variant?: NavVariant; active?: NavKey }) {
  return (
    <nav
      aria-label={variant === "active" ? "Patient features" : "Enrollment steps"}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 h-nav border-canvas bg-white p-2",
        variant === "active" ? "border-t" : "border",
        "lg:sticky lg:top-header lg:h-[calc(100dvh-var(--spacing-header))] lg:w-56 lg:shrink-0 lg:border-0 lg:border-r lg:p-4",
      )}
    >
      <ul
        className={cn(
          "flex h-full lg:h-auto lg:flex-col lg:items-stretch lg:gap-2",
          variant === "active" ? "items-center" : "items-start",
        )}
      >
        {ITEMS[variant].map((item) => {
          const selected = item.key === active;
          return (
            <li key={item.key} className="flex min-w-0 flex-1 lg:flex-none">
              <Link
                href={item.href}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "flex min-h-11 w-full min-w-0 flex-col items-center py-1 text-center",
                  "lg:flex-row lg:gap-3 lg:rounded-tulay lg:px-3 lg:py-2 lg:text-left",
                  item.icon ? "gap-1" : "h-[54px] justify-center gap-0.5 lg:h-auto lg:justify-start",
                  selected ? "bg-soft" : "rounded-lg hover:bg-canvas/60",
                )}
              >
                {item.icon ? (
                  <>
                    <Icon name={item.icon} size={22} />
                    <span className={cn("text-sm break-words-safe", selected ? "text-action" : "text-muted")}>
                      {item.label}
                    </span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true" className="w-[22px] text-xl font-semibold text-primary lg:text-center">
                      ₱
                    </span>
                    <span className="text-xs text-primary lg:text-sm">{item.label}</span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
