"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TableRegion, tdClass, thClass } from "@/components/ui/data-table";
import { SelectField, TextField } from "@/components/ui/field";
import { type BadgeTone, StatusBadge } from "@/components/ui/status-badge";
import type { PreviewReferral } from "@/lib/preview/types";

const statusTone: Record<PreviewReferral["status"], BadgeTone> = {
  "Draft escalation": "warning",
  "Incoming · Pending": "info",
  Accepted: "success",
};

/** Figma M5 — referral overview. Mock-only feature. */
export function ReferralList({ referrals }: { referrals: PreviewReferral[] }) {
  const [direction, setDirection] = useState<"all" | "incoming" | "sent">("all");
  const [urgency, setUrgency] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return referrals.filter(
      (r) =>
        (direction === "all" || r.direction === direction) &&
        (urgency === "all" || r.urgency === urgency) &&
        (!q || r.patientName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)),
    );
  }, [referrals, direction, urgency, query]);

  return (
    <>
      <fieldset className="mb-4 flex flex-wrap gap-2">
        <legend className="sr-only">Referral direction</legend>
        {(["all", "incoming", "sent"] as const).map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={direction === d}
            onClick={() => setDirection(d)}
            className={`min-h-11 rounded-tulay-8 px-4 text-sm font-semibold ${
              direction === d ? "bg-tertiary" : "border border-grey-200 bg-surface"
            }`}
          >
            {d === "all" ? "All" : d === "incoming" ? "Incoming" : "Sent"}
          </button>
        ))}
      </fieldset>
      <div className="mb-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-end">
        <TextField
          id="referral-search"
          type="search"
          label="Search referrals"
          placeholder="Search patient or referral ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SelectField id="urgency" label="Urgency" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
          <option value="all">All</option>
          <option>Routine</option>
          <option>Priority</option>
          <option>Urgent</option>
        </SelectField>
      </div>
      <TableRegion label="Referrals">
        <thead>
          <tr>
            <th scope="col" className={thClass}>Patient / ID</th>
            <th scope="col" className={thClass}>From / destination</th>
            <th scope="col" className={thClass}>Urgency</th>
            <th scope="col" className={thClass}>Status</th>
            <th scope="col" className={thClass}>Next step</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className={`${tdClass} text-center text-secondary-500`}>
                No referrals match these filters.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id}>
                <td className={`${tdClass} font-medium`}>
                  {r.patientName} · {r.id}
                </td>
                <td className={tdClass}>{r.route}</td>
                <td className={tdClass}>{r.urgency}</td>
                <td className={tdClass}>
                  <StatusBadge tone={statusTone[r.status]}>{r.status}</StatusBadge>
                </td>
                <td className={tdClass}>
                  <Link href={r.nextStep.href} className="font-semibold underline-offset-4 hover:underline">
                    {r.nextStep.label} <span aria-hidden="true">→</span>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </TableRegion>
    </>
  );
}
