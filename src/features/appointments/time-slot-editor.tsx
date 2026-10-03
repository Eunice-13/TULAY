"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TableRegion, tdClass, thClass } from "@/components/ui/data-table";
import { SelectField, TextField } from "@/components/ui/field";
import { Notice, PreviewNotice } from "@/components/ui/notice";
import type { PreviewTimeBlock } from "@/lib/preview/types";

/** Figma M2S — clinic time slot editor. MOCK ONLY, changes stay on this screen. */
export function TimeSlotEditor({ initialBlocks }: { initialBlocks: PreviewTimeBlock[] }) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addBlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const from = String(data.get("from") ?? "");
    const to = String(data.get("to") ?? "");
    const capacity = Number(data.get("capacity"));
    if (!from || !to || from >= to) {
      setError("Choose a start time before the end time.");
      return;
    }
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 99) {
      setError("Capacity must be a whole number from 1 to 99.");
      return;
    }
    setError(null);
    setSaved(false);
    setBlocks((prev) => [
      ...prev,
      { id: `tb-${Date.now()}`, range: `${from}–${to}`, service: String(data.get("service")), capacity },
    ]);
    form.reset();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <Card labelledBy="schedule-heading">
        <CardTitle id="schedule-heading">Operating schedule</CardTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField id="from-date" label="From" type="date" defaultValue="2026-10-05" />
          <TextField id="until-date" label="Until" type="date" defaultValue="2026-10-10" />
          <TextField id="opens" label="Opens at" type="time" defaultValue="08:00" />
          <TextField id="closes" label="Closes at" type="time" defaultValue="17:00" />
        </div>
        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">Operating days</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <label
                key={d}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-tulay-8 border border-grey-200 px-3 text-sm has-[:checked]:bg-secondary-100"
              >
                <input type="checkbox" defaultChecked={d !== "Sun"} className="accent-primary" /> {d}
              </label>
            ))}
          </div>
        </fieldset>
        <Notice className="mt-5">Existing bookings remain visible when you edit available time blocks.</Notice>
      </Card>

      <Card labelledBy="blocks-heading">
        <CardTitle id="blocks-heading">Time blocks · 05 October</CardTitle>
        <div className="mt-4">
          <TableRegion label="Time blocks">
            <thead>
              <tr>
                <th scope="col" className={thClass}>Select</th>
                <th scope="col" className={thClass}>Time block</th>
                <th scope="col" className={thClass}>Service</th>
                <th scope="col" className={thClass}>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((b) => (
                <tr key={b.id} className={selectedId === b.id ? "bg-secondary-100" : undefined}>
                  <td className={tdClass}>
                    <input
                      type="radio"
                      name="selected-block"
                      aria-label={`Select ${b.range}`}
                      checked={selectedId === b.id}
                      onChange={() => setSelectedId(b.id)}
                      className="size-4 accent-primary"
                    />
                  </td>
                  <td className={tdClass}>{b.range}</td>
                  <td className={tdClass}>{b.service}</td>
                  <td className={tdClass}>{b.capacity} patients</td>
                </tr>
              ))}
            </tbody>
          </TableRegion>
        </div>

        <form onSubmit={addBlock} noValidate className="mt-5 grid gap-4 sm:grid-cols-4 sm:items-end">
          <TextField id="block-from" name="from" label="Start" type="time" />
          <TextField id="block-to" name="to" label="End" type="time" />
          <SelectField id="block-service" name="service" label="Service" defaultValue="Consultation">
            <option>Consultation</option>
            <option>Screening</option>
            <option>Laboratory</option>
          </SelectField>
          <TextField id="block-capacity" name="capacity" label="Capacity" inputMode="numeric" defaultValue="6" />
          {error ? (
            <p role="alert" className="text-sm font-medium text-danger sm:col-span-4">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 sm:col-span-4">
            <Button type="submit" variant="secondary">
              Add time block
            </Button>
            <Button
              variant="danger"
              disabled={!selectedId}
              onClick={() => {
                setBlocks((prev) => prev.filter((b) => b.id !== selectedId));
                setSelectedId(null);
                setSaved(false);
              }}
            >
              Remove selected
            </Button>
            <Button onClick={() => setSaved(true)}>Save availability</Button>
          </div>
        </form>
        <p className="mt-4 text-xs text-secondary-500">Availability becomes visible to patients after saving.</p>
        {saved ? (
          <div className="mt-4">
            <PreviewNotice>Time blocks are not saved or shown to patients until scheduling is connected.</PreviewNotice>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
