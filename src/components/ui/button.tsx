import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "soft" | "ghost" | "danger";
export type ButtonSize = "md" | "sm";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-tulay-8 px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-soft",
  secondary: "border border-grey-200 bg-surface text-primary hover:bg-canvas",
  soft: "bg-tertiary text-primary hover:bg-secondary-100",
  ghost: "text-primary hover:bg-secondary-100",
  danger: "border border-danger bg-surface text-danger hover:bg-danger-soft",
};

const sizes: Record<ButtonSize, string> = {
  md: "py-2.5",
  sm: "min-h-10 px-3 py-2 text-[13px]",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra = "",
): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...rest} />;
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: LinkButtonProps) {
  return <Link className={buttonClasses(variant, size, className)} {...rest} />;
}
