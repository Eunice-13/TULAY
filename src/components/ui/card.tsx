import type { ElementType, ReactNode } from "react";

export function Card({
  children,
  className = "",
  as: Tag = "section",
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  labelledBy?: string;
}) {
  return (
    <Tag
      aria-labelledby={labelledBy}
      className={`rounded-tulay-16 border border-secondary-100 bg-surface p-5 sm:p-6 ${className}`}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({
  id,
  children,
  as: Tag = "h2",
  className = "",
}: {
  id?: string;
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag id={id} className={`text-xl font-medium leading-[31px] ${className}`}>
      {children}
    </Tag>
  );
}

/** Label/value pair used across patient and record details. */
export function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs leading-5 text-secondary-500">{label}</dt>
      <dd className="mt-0.5 break-words text-sm leading-6">{value}</dd>
    </div>
  );
}
