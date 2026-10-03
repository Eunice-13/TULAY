import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

/**
 * Icon-container + copy + chevron row used for guide links, balance and
 * referrals shortcuts. `gap` mirrors the copy spacing in each Figma frame.
 */
type ListLinkProps = {
  href: string;
  icon?: IconName;
  iconSlot?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  copyGap?: "gap-1" | "gap-3";
  className?: string;
};

export function ListLink({ href, icon, iconSlot, title, description, copyGap = "gap-1", className }: ListLinkProps) {
  return (
    <Link href={href} className={cn("group flex w-full items-center gap-3 rounded-tulay text-left", className)}>
      <span className="flex size-12 shrink-0 items-center justify-center rounded-tulay bg-soft p-3">
        {iconSlot ?? (icon ? <Icon name={icon} size={24} /> : null)}
      </span>
      <span className={cn("flex min-w-0 flex-1 flex-col text-sm break-words-safe", copyGap)}>
        <span className="font-semibold text-primary group-hover:underline">{title}</span>
        {description ? <span className="text-muted">{description}</span> : null}
      </span>
      <Icon name="arrow" size={20} />
    </Link>
  );
}
