import type { ReactNode } from "react";

/**
 * Wide tables scroll inside a labelled, keyboard-focusable region on narrow
 * screens instead of hiding columns (docs/responsive-design.md).
 */
export function TableRegion({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section
      aria-label={label}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be keyboard reachable.
      tabIndex={0}
      className="overflow-x-auto rounded-tulay-12 border border-secondary-100 bg-surface"
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">{children}</table>
    </section>
  );
}

export const thClass = "bg-secondary-100 px-4 py-3 text-xs font-normal leading-5 text-secondary-500";
export const tdClass = "border-t border-secondary-100 px-4 py-4 align-middle leading-6";
