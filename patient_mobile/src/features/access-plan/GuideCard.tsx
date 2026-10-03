import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Linked guide card (P4 • YAKAP-GAMOT guide cards, 222:2246). */
export type GuideCardProps = {
  href: string;
  title: string;
  description: string;
  icon: IconName;
  surface: "bg-soft" | "bg-canvas" | "bg-success";
  /** Public frame: 16px radius / 48px icon. Active frame (222:5041): 12px radius / 32px icon. */
  compact?: boolean;
};

export function GuideCard({ href, title, description, icon, surface, compact }: GuideCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full w-full flex-col gap-3 p-4 text-left transition-shadow hover:shadow-md",
        compact ? "rounded-tulay" : "rounded-[16px]",
        surface,
      )}
    >
      <span className="text-base font-bold text-primary group-hover:underline">{title}</span>
      <span className="flex w-full items-center gap-3">
        <span className="min-w-0 flex-1 text-xs text-black break-words-safe">{description}</span>
        <Icon name={icon} size={compact ? 32 : 48} />
      </span>
    </Link>
  );
}
