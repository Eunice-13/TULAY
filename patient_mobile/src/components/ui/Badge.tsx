import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * TULAY / Phone / Badge (57:90): full-width status pill on light blue.
 * Text tone and weight vary per frame (teal bold, black bold, green bold, teal regular).
 */
type BadgeProps = Omit<HTMLAttributes<HTMLParagraphElement>, "className"> & {
  children: ReactNode;
  tone?: "teal" | "black" | "positive";
  weight?: "bold" | "normal";
  /** Some frames use the badge text without its light-blue fill. */
  filled?: boolean;
  align?: "center" | "left";
  className?: string;
};

const TONES = { teal: "text-teal", black: "text-black", positive: "text-positive" } as const;

export function Badge({
  children,
  tone = "teal",
  weight = "bold",
  filled = true,
  align = "center",
  className,
  ...rest
}: BadgeProps) {
  return (
    <p
      className={cn(
        "w-full rounded-tulay p-2 text-sm break-words-safe",
        align === "center" ? "text-center" : "text-left",
        filled && "bg-success",
        TONES[tone],
        weight === "bold" ? "font-bold" : "font-normal",
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}
