"use client";

import { useId, useMemo, useState } from "react";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FORMULARY, FORMULARY_COUNTS, type DispensedAt } from "./mock-data";

const FILTERS: DispensedAt[] = ["Clinic", "Pharmacy"];

/** Search + dispensing filters + medicine cards (P4 • Formulary checker, 222:3408). */
export function FormularyChecker() {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DispensedAt | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FORMULARY.filter(
      (entry) =>
        (!filter || entry.dispensedAt === filter) &&
        (!q || `${entry.name} ${entry.form}`.toLowerCase().includes(q)),
    );
  }, [query, filter]);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-full flex-col gap-5 md:flex-row md:items-end md:gap-4">
        <div className="flex w-full flex-col gap-1.5 md:flex-1">
          <label htmlFor={searchId} className="text-sm font-semibold text-primary">
            Search medicine or dosage form
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the demo catalog"
            className="w-full rounded-lg border border-canvas bg-surface p-3 text-sm text-black placeholder:text-black focus:border-teal"
          />
        </div>
        <div role="group" aria-label="Dispensing filters" className="flex w-full gap-2 md:w-auto">
          {FILTERS.map((option) => {
            const pressed = filter === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={pressed}
                onClick={() => setFilter(pressed ? null : option)}
                className={buttonClasses(pressed ? "pressed" : "secondary", "flex-1 md:w-40")}
              >
                {option} • {FORMULARY_COUNTS[option]}
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length} medicines shown
      </p>

      <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {results.map((entry) => {
          const headingId = `med-${entry.id}`;
          return (
            <li key={entry.id}>
              <article
                aria-labelledby={headingId}
                className="flex h-full w-full flex-col gap-3 rounded-tulay border border-canvas bg-surface p-4"
              >
                <div className="flex w-full flex-1 items-center gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-1 break-words-safe">
                    <h2 id={headingId} className="text-base font-bold text-primary">
                      {entry.name}
                    </h2>
                    <p className="text-xs text-black">
                      {entry.form} • {entry.dispensedAt}
                      <br />
                      {entry.status}
                      {entry.updated ? (
                        <>
                          <br />
                          {entry.updated}
                        </>
                      ) : null}
                    </p>
                  </div>
                  <Icon name="rx" size={28} />
                </div>
                <ButtonLink
                  href={`/pharmacy-finder?medicine=${entry.id}`}
                  variant="secondary"
                  aria-label={`Find availability: ${entry.name}`}
                >
                  Find availability
                </ButtonLink>
              </article>
            </li>
          );
        })}
      </ul>
      {results.length === 0 ? <p className="text-sm text-muted">No demo medicines match your search.</p> : null}
    </div>
  );
}
