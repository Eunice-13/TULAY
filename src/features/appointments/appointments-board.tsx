"use client";

import { useMemo, useState } from "react";

import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TableRegion, tdClass, thClass } from "@/components/ui/data-table";
import { SelectField } from "@/components/ui/field";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { PreviewNotice } from "@/components/ui/notice";
import type { PreviewAppointment } from "@/lib/preview/types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatLong(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday first
  const start = new Date(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

/**
 * Figma M2 — appointments and services. MOCK ONLY: scheduling is not part of the
 * agreed MVP backend yet, so changes here are not saved.
 * Identity verification is walk-in only and never appears as an appointment.
 */
export function AppointmentsBoard({ appointments, today }: { appointments: PreviewAppointment[]; today: string }) {
  const [selected, setSelected] = useState(today);
  const [service, setService] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [y, m] = selected.split("-").map(Number);
  const days = useMemo(() => monthGrid(y, m - 1), [y, m]);
  const countByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of appointments) map.set(a.date, (map.get(a.date) ?? 0) + 1);
    return map;
  }, [appointments]);

  const list = appointments.filter((a) => a.date === selected && (service === "all" || a.service === service));
  const active = list.find((a) => a.id === activeId) ?? list[0];

  function shiftDay(delta: number) {
    const [yy, mm, dd] = selected.split("-").map(Number);
    setSelected(toIso(new Date(yy, mm - 1, dd + delta)));
    setActiveId(null);
    setNotice(null);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)_320px]">
      <Card labelledBy="calendar-heading">
        <CardTitle id="calendar-heading">
          {new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </CardTitle>
        <table className="mt-4 w-full table-fixed text-center text-sm">
          <caption className="sr-only">Choose a date to see appointments</caption>
          <thead>
            <tr>
              {WEEKDAYS.map((d) => (
                <th key={d} scope="col" className="pb-2 text-xs font-normal text-secondary-500">
                  <abbr title={d}>{d[0]}</abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, row) => (
              <tr key={`row-${days[row * 7].getTime()}`}>
                {days.slice(row * 7, row * 7 + 7).map((d) => {
                  const iso = toIso(d);
                  const inMonth = d.getMonth() === m - 1;
                  const count = countByDay.get(iso) ?? 0;
                  const isSelected = iso === selected;
                  return (
                    <td key={iso} className="p-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(iso);
                          setActiveId(null);
                          setNotice(null);
                        }}
                        aria-pressed={isSelected}
                        aria-label={`${formatLong(iso)}${count ? `, ${count} appointments` : ""}`}
                        className={`relative flex h-11 w-full items-center justify-center rounded-tulay-8 ${
                          isSelected ? "bg-primary text-white" : inMonth ? "hover:bg-canvas" : "text-grey-200"
                        }`}
                      >
                        {d.getDate()}
                        {count ? (
                          <span
                            aria-hidden="true"
                            className={`absolute bottom-1 size-1.5 rounded-full ${isSelected ? "bg-white" : "bg-quaternary"}`}
                          />
                        ) : null}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-5 rounded-tulay-12 bg-canvas p-4">
          <p className="text-sm font-semibold">Available clinic hours</p>
          <p className="text-sm text-secondary-500">Monday–Saturday 8:00 AM–5:00 PM</p>
          <LinkButton href="/doctor/appointments/slots" variant="secondary" size="sm" className="mt-3">
            Edit availability
          </LinkButton>
        </div>
      </Card>

      <section aria-labelledby="day-heading" className="min-w-0">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <Button variant="secondary" onClick={() => shiftDay(-1)} aria-label="Previous day">
            <ChevronLeftIcon size={18} />
          </Button>
          <h2 id="day-heading" className="min-w-40 text-lg font-medium">
            {formatLong(selected)}
          </h2>
          <Button variant="secondary" onClick={() => shiftDay(1)} aria-label="Next day">
            <ChevronRightIcon size={18} />
          </Button>
          <div className="ml-auto w-full sm:w-52">
            <SelectField id="service-filter" label="Service" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="all">All services</option>
              <option value="Consultation">Consultation</option>
              <option value="Screening">Screening</option>
              <option value="Laboratory test">Laboratory test</option>
              <option value="Referred consultation">Referred consultation</option>
            </SelectField>
          </div>
        </div>
        <p className="mb-3 text-sm text-secondary-500" aria-live="polite">
          {list.length} appointments
        </p>
        <TableRegion label={`Appointments on ${formatLong(selected)}`}>
          <thead>
            <tr>
              <th scope="col" className={thClass}>Patient</th>
              <th scope="col" className={thClass}>Time</th>
              <th scope="col" className={thClass}>Service</th>
              <th scope="col" className={thClass}>Queue</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className={`${tdClass} text-center text-secondary-500`}>
                  No appointments on this date.
                </td>
              </tr>
            ) : (
              list.map((a) => (
                <tr key={a.id} className={a.id === active?.id ? "bg-secondary-100" : undefined}>
                  <td className={tdClass}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(a.id);
                        setNotice(null);
                      }}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {a.patientName}
                    </button>
                  </td>
                  <td className={tdClass}>{a.time}</td>
                  <td className={tdClass}>{a.service}</td>
                  <td className={tdClass}>{a.queue}</td>
                </tr>
              ))
            )}
          </tbody>
        </TableRegion>
      </section>

      <Card labelledBy="detail-heading">
        {active ? (
          <>
            <CardTitle id="detail-heading">
              {active.patientName} · {active.time}
            </CardTitle>
            <p className="mt-1 text-sm text-secondary-500">
              {active.service} · Queue {active.queue} · Assigned doctor: Dr. Reyes
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {active.patientId ? (
                <LinkButton href={`/doctor/patients/${active.patientId}`}>Open record</LinkButton>
              ) : null}
              <Button variant="secondary" onClick={() => setNotice("Rescheduling is not connected yet.")}>
                Reschedule
              </Button>
              <Button variant="danger" onClick={() => setNotice("Cancelling is not connected yet.")}>
                Cancel appointment
              </Button>
            </div>
            {notice ? (
              <div className="mt-4">
                <PreviewNotice>{notice}</PreviewNotice>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <CardTitle id="detail-heading">No appointment selected</CardTitle>
            <p className="mt-2 text-sm text-secondary-500">Pick a date with appointments to see details.</p>
          </>
        )}
      </Card>
    </div>
  );
}
