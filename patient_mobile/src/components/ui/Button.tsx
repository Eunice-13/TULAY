import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** TULAY / Phone / Primary button (57:74) and Secondary button (57:76). */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "pressed";

const base =
  "flex min-h-12 w-full items-center justify-center rounded-tulay p-3 text-center text-sm font-semibold transition-colors break-words-safe disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-surface hover:bg-primary/90",
  secondary: "border border-secondary-400 bg-surface text-primary hover:bg-canvas/60",
  /** TULAY / Phone / Ghost button (57:78) */
  ghost: "border border-grey-200 bg-surface text-action hover:bg-canvas/60",
  /** Secondary button in its toggled-on state (filter chips). */
  pressed: "border border-secondary-400 bg-soft text-primary",
};

export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type ButtonLinkProps = CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">;

export function ButtonLink({ href, variant = "primary", className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({ variant = "primary", className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </button>
  );
}
