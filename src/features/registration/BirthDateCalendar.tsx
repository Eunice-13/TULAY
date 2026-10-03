"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { monthName } from "./date";

const WEEKDAYS = [
  { short: "S", long: "Sunday" },
  { short: "M", long: "Monday" },
  { short: "T", long: "Tuesday" },
  { short: "W", long: "Wednesday" },
  { short: "T", long: "Thursday" },
  { short: "F", long: "Friday" },
  { short: "S", long: "Saturday" },
];

type BirthDateCalendarProps = {
  year: number;
  month: number;
  daysInMonth: number;
  initialDay: number;
  /** Path the chosen ISO date is sent back to as `?birth=`. */
  returnTo: string;
};

/**
 * P1 • Birth date calendar (222:2638). The grid mirrors the Figma example:
 * day 1 sits in the first column and the month is laid out in 5 weeks.
 */
export function BirthDateCalendar({ year, month, daysInMonth, initialDay, returnTo }: BirthDateCalendarProps) {
  const router = useRouter();
  const [day, setDay] = useState(initialDay);
  const label = `${monthName(month)} ${year}`;
  const cells = Array.from({ length: 35 }, (_, index) => (index < daysInMonth ? index + 1 : null));
  const weeks = Array.from({ length: 5 }, (_, week) => cells.slice(week * 7, week * 7 + 7));

  function confirm() {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const separator = returnTo.includes("?") ? "&" : "?";
    router.push(`${returnTo}${separator}birth=${iso}`);
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <TextField label="Month and year" labelGap="gap-1.5" value={label} readOnly />

      <div className="flex w-full flex-col gap-3 rounded-tulay bg-surface p-4 md:border md:border-canvas">
        <div className="flex w-full items-center gap-3">
          <h2 id="calendar-month" className="min-w-0 flex-1 text-base font-bold text-primary">
            {label}
          </h2>
          <Icon name="calendar" size={24} />
        </div>

        <table role="grid" aria-labelledby="calendar-month" className="w-full table-fixed border-separate border-spacing-1">
          <thead>
            <tr>
              {WEEKDAYS.map((weekday, index) => (
                <th key={index} scope="col" abbr={weekday.long} className="p-0 text-sm font-normal text-muted">
                  {weekday.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((date, dayIndex) => (
                  <td key={dayIndex} className="p-0">
                    {date ? (
                      <button
                        type="button"
                        onClick={() => setDay(date)}
                        aria-pressed={date === day}
                        aria-label={`${monthName(month)} ${date}, ${year}`}
                        className={cn(
                          "flex min-h-11 w-full items-center justify-center p-1 text-sm text-primary",
                          date === day ? "bg-soft" : "hover:bg-canvas",
                        )}
                      >
                        {date}
                      </button>
                    ) : (
                      <span className="block min-h-11" aria-hidden="true" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={confirm}>
        Use {monthName(month)} {day}, {year}
      </Button>
    </div>
  );
}
