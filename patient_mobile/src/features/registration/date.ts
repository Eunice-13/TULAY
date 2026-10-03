const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Parses an ISO `YYYY-MM-DD` string; returns null when invalid. */
export function parseIsoDate(value: string | undefined): { year: number; month: number; day: number } | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const month = Number(m);
  const day = Number(d);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year: Number(y), month, day };
}

/** Formats as "June 15, 1985". */
export function formatLongDate(value: string | undefined): string | null {
  const parsed = parseIsoDate(value);
  if (!parsed) return null;
  return `${MONTHS[parsed.month - 1]} ${parsed.day}, ${parsed.year}`;
}

export function monthName(month: number): string {
  return MONTHS[month - 1] ?? "";
}
