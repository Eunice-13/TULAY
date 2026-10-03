"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClasses } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { BOOKING_DATE, TIME_SLOTS, bookingQuery, type TimeSlot, type VisitTypeKey } from "./booking";

/** Visit date + time slots + selection badge (P5 • Select date and time, 222:3561). */
export function SlotPicker({ visit, initialSlot }: { visit: VisitTypeKey; initialSlot: TimeSlot }) {
  const router = useRouter();
  const [slot, setSlot] = useState<TimeSlot>(initialSlot);
  const [first, second, third] = TIME_SLOTS;

  function slotButton(value: TimeSlot) {
    const selected = value === slot;
    return (
      <button
        key={value}
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={() => setSlot(value)}
        className={buttonClasses(selected ? "primary" : "secondary", cn("flex-1", selected && "border border-secondary-400"))}
      >
        {value}
      </button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-full flex-col gap-2">
        <TextField tone="muted" label="Visit Date" value={BOOKING_DATE} readOnly />
        <span aria-hidden="true" className="block h-5" />
      </div>

      <div role="radiogroup" aria-label="Available time slots" className="flex w-full flex-col gap-5 md:flex-row md:gap-2">
        <div className="flex w-full gap-2 md:contents">
          {slotButton(first)}
          {slotButton(second)}
        </div>
        {slotButton(third)}
      </div>

      <Badge tone="positive" aria-live="polite">
        {slot} Selected
      </Badge>

      <InfoRow title="Queue Estimate">4 patients ahead • Subject to change</InfoRow>

      <Button onClick={() => router.push(`/appointments${bookingQuery({ visit, slot })}`)}>Use this date and time</Button>
    </div>
  );
}
