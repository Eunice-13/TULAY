import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** TULAY / Phone / Info row (57:87): semibold title over a muted description. */
export function InfoRow({
  title,
  children,
  className,
}: {
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2 text-sm break-words-safe", className)}>
      <p className="font-semibold text-primary">{title}</p>
      {children ? <div className="text-muted">{children}</div> : null}
    </div>
  );
}
