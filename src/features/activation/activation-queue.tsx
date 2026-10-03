"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TableRegion, tdClass, thClass } from "@/components/ui/data-table";
import { TextField } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PendingActivationRow } from "@/lib/data/types";

type QueueRow = PendingActivationRow;

type Tab = "pending" | "activated" | "denied";

/** Figma CS2 / CS2N. Walk-in queue: no scheduled verification visits. */
export function ActivationQueue({ rows }: { rows: QueueRow[] }) {
  const [tab, setTab] = useState<Tab>("pending");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) => !q || r.displayName.toLowerCase().includes(q) || r.mockPhilHealthId.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: "pending", label: `Pending · ${rows.length}` },
    { key: "activated", label: "Activated" },
    { key: "denied", label: "Denied" },
  ];

  return (
    <>
      <fieldset className="mb-4 flex flex-wrap gap-2">
        <legend className="sr-only">Activation status</legend>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`min-h-11 rounded-tulay-8 px-4 text-sm font-semibold ${
              tab === t.key ? "bg-tertiary" : "border border-grey-200 bg-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </fieldset>

      {tab !== "pending" ? (
        <p className="rounded-tulay-12 border border-secondary-100 bg-surface p-6 text-center text-sm text-secondary-500">
          No {tab} accounts to show yet. The history list appears once activation is connected.
        </p>
      ) : (
        <>
          <div className="mb-4 max-w-md">
            <TextField
              id="queue-search"
              type="search"
              label="Search pending patients"
              placeholder="Search patient or PhilHealth ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <TableRegion label="Pending activations">
            <thead>
              <tr>
                <th scope="col" className={thClass}>Patient</th>
                <th scope="col" className={thClass}>PhilHealth ID</th>
                <th scope="col" className={thClass}>Registered</th>
                <th scope="col" className={thClass}>Record match</th>
                <th scope="col" className={thClass}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`${tdClass} text-center text-secondary-500`}>
                    No pending patients match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.beneficiaryId}>
                    <td className={`${tdClass} font-medium`}>{r.displayName}</td>
                    <td className={tdClass}>{r.mockPhilHealthId}</td>
                    <td className={tdClass}>{r.registeredAt} · Walk-in</td>
                    <td className={tdClass}>
                      <StatusBadge tone={r.recordMatch === "Needs review" ? "warning" : "info"}>{r.recordMatch}</StatusBadge>
                    </td>
                    <td className={tdClass}>
                      <Link
                        href={`/clinic/activations/${r.beneficiaryId}`}
                        className="font-semibold underline-offset-4 hover:underline"
                        aria-label={`Review identity for ${r.displayName}`}
                      >
                        Review identity <span aria-hidden="true">→</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableRegion>
        </>
      )}
    </>
  );
}
