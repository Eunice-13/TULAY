/** Mock booking options for the P5 appointment flow. */
export const VISIT_TYPES = {
  consultation: "Primary Care Consultation",
  lab: "Doctor-ordered Laboratory Test",
} as const;

export type VisitTypeKey = keyof typeof VISIT_TYPES;

export const TIME_SLOTS = ["9:00 AM", "10:30 AM", "1:00 PM"] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

export const BOOKING_DATE = "October 7, 2026";

export function isVisitType(value: string | undefined): value is VisitTypeKey {
  return value === "consultation" || value === "lab";
}

export function isTimeSlot(value: string | undefined): value is TimeSlot {
  return TIME_SLOTS.some((slot) => slot === value);
}

/** Builds a query string that carries the in-progress booking between screens. */
export function bookingQuery(state: { visit?: VisitTypeKey; slot?: TimeSlot }): string {
  const params = new URLSearchParams();
  if (state.visit) params.set("visit", state.visit);
  if (state.slot) params.set("slot", state.slot);
  const query = params.toString();
  return query ? `?${query}` : "";
}
