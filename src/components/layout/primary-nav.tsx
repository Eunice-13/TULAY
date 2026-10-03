"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
  /** Extra path prefixes that should also mark this item as current. */
  match?: string[];
}

export function PrimaryNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="border-b border-secondary-100 bg-surface">
      <ul className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-4 py-2 sm:px-6">
        {items.map((item) => {
          const prefixes = [item.href, ...(item.match ?? [])];
          const current = prefixes.some(
            (p) => pathname === p || pathname.startsWith(`${p}/`),
          );
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex min-h-12 items-center rounded-tulay-8 px-3.5 text-sm font-semibold whitespace-nowrap ${
                  current ? "bg-tertiary text-primary" : "text-secondary-500 hover:bg-canvas hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
