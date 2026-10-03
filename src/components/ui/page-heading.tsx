import type { ReactNode } from "react";

export function PageHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-medium leading-9 sm:text-[28px]">{title}</h1>
        {description ? <p className="mt-1 text-sm leading-6 text-secondary-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3 md:shrink-0">{actions}</div> : null}
    </div>
  );
}
