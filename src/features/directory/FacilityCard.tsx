import { ButtonLink } from "@/components/ui/Button";
import type { Facility } from "./mock-data";

/** "Section" card: facility info row + secondary button (222:2903, 222:3213). */
type FacilityCardProps = {
  id: string;
  name: string;
  /** Muted detail lines under the name. */
  lines: string[];
  href: string;
  cta?: string;
};

export function FacilityCard({ id, name, lines, href, cta = "View clinic" }: FacilityCardProps) {
  const headingId = `facility-${id}`;
  return (
    <article
      aria-labelledby={headingId}
      className="flex h-full w-full flex-col gap-3 rounded-tulay border border-canvas bg-surface p-4"
    >
      <div className="flex w-full flex-1 flex-col gap-2 text-sm break-words-safe">
        <h2 id={headingId} className="font-semibold text-primary">
          {name}
        </h2>
        <p className="text-muted">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
      <ButtonLink href={href} variant="secondary" aria-label={`${cta}: ${name}`}>
        {cta}
      </ButtonLink>
    </article>
  );
}

/** Detail lines for the clinic-selection list (P3 • Select registered clinic). */
export function clinicSelectionLines(facility: Facility): string[] {
  return [
    facility.type,
    `${facility.distanceKm} km • ${facility.address}`,
    facility.hours,
    ...(facility.services ? [facility.services] : []),
  ];
}
