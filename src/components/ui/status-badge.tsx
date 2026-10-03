import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-secondary-100 text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-primary",
};

/**
 * Status text is always written out, so meaning never depends on color alone.
 */
export function StatusBadge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-tulay-8 px-2.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function AccountStatusBadge({ status }: { status: "active" | "pending" }) {
  return status === "active" ? (
    <StatusBadge tone="success">Active</StatusBadge>
  ) : (
    <StatusBadge tone="warning">Pending activation</StatusBadge>
  );
}

export function StockBadge({ status }: { status: "available" | "out_of_stock" }) {
  return status === "available" ? (
    <StatusBadge tone="success">In stock</StatusBadge>
  ) : (
    <StatusBadge tone="danger">Out of stock</StatusBadge>
  );
}
