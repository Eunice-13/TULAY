import type { ReactNode } from "react";

export function Notice({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`rounded-tulay-12 bg-secondary-100 px-4 py-3 text-sm leading-6 text-secondary-500 ${className}`}>
      {children}
    </p>
  );
}

/**
 * Shown after an action whose backend is not connected yet. States plainly
 * that nothing was saved, so a placeholder never passes as a working feature.
 */
export function PreviewNotice({ children }: { children?: ReactNode }) {
  return (
    <p
      role="status"
      className="rounded-tulay-12 border border-warning/40 bg-warning-soft px-4 py-3 text-sm leading-6 text-warning"
    >
      <strong className="font-semibold">Preview only · not saved.</strong>{" "}
      {children ?? "The backend is not connected yet, so this action changes nothing outside this screen."}
    </p>
  );
}
