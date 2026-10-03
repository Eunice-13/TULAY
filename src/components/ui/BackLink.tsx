import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/** "Back" affordance at the top of page content (TULAY / Icon / back). */
type BackLinkProps = {
  href: string;
  label?: string;
  size?: "sm" | "md";
  /** Registration frames use primary text; others use muted. */
  tone?: "muted" | "primary";
  className?: string;
};

export function BackLink({ href, label = "Back", size = "md", tone = "muted", className }: BackLinkProps) {
  const isSmall = size === "sm";
  return (
    <Link
      href={href}
      className={cn(
        // -my-3/py-3 keeps the 20px Figma row height while giving a 44px touch target.
        "-my-3 flex min-w-11 w-fit items-center gap-2 py-3 hover:underline",
        tone === "muted" ? "text-muted" : "text-primary",
        isSmall ? "text-xs" : "text-sm",
        className,
      )}
    >
      <Icon name="back" size={isSmall ? 14 : 18} />
      <span>{label}</span>
    </Link>
  );
}
