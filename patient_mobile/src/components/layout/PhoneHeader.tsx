import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { BrandLogo } from "./BrandLogo";

/**
 * TULAY / Phone / Header (73:1070): persistent 68px header with the account
 * menu trigger and the brand logo. `menuHref` is set per account state
 * (before login, pending, active).
 */
export function PhoneHeader({ menuHref, homeHref = "/" }: { menuHref: string; homeHref?: string }) {
  return (
    <header className="sticky top-0 z-30 h-header w-full bg-surface lg:border-b lg:border-canvas">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-2 p-3 lg:px-8">
        <Link
          href={menuHref}
          aria-label="Open account menu"
          className="flex size-11 shrink-0 items-start rounded-tulay p-2 hover:bg-canvas/60"
        >
          <Icon name="menu" size={24} />
        </Link>
        <Link href={homeHref} aria-label="TULAY home" className="rounded-tulay">
          <BrandLogo priority />
        </Link>
      </div>
    </header>
  );
}
