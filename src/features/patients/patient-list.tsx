"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TableRegion, tdClass, thClass } from "@/components/ui/data-table";
import { SelectField, TextField } from "@/components/ui/field";
import { AccountStatusBadge } from "@/components/ui/status-badge";

export interface PatientRow {
  id: string;
  displayName: string;
  philHealthId: string;
  status: "active" | "pending";
  lastVisit: string | null;
}

/** Figma M8. Pending accounts cannot be opened by doctors. */
export function PatientList({ patients }: { patients: PatientRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "pending">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter(
      (p) =>
        (status === "all" || p.status === status) &&
        (!q || p.displayName.toLowerCase().includes(q) || p.philHealthId.toLowerCase().includes(q)),
    );
  }, [patients, query, status]);

  return (
    <>
      <div className="mb-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
        <TextField
          id="patient-search"
          label="Search patients"
          type="search"
          placeholder="Search name or PhilHealth ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SelectField
          id="patient-status"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="pending">Pending activation</option>
        </SelectField>
      </div>
      <p className="mb-3 text-sm text-secondary-500" aria-live="polite">
        {filtered.length} of {patients.length} patients
      </p>
      <TableRegion label="Patients at your assigned clinic">
        <thead>
          <tr>
            <th scope="col" className={thClass}>Patient</th>
            <th scope="col" className={thClass}>PhilHealth ID</th>
            <th scope="col" className={thClass}>Account status</th>
            <th scope="col" className={thClass}>Last visit</th>
            <th scope="col" className={thClass}>Next step</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className={`${tdClass} text-center text-secondary-500`}>
                No patients match your search.
              </td>
            </tr>
          ) : (
            filtered.map((p) => (
              <tr key={p.id}>
                <td className={`${tdClass} font-medium`}>{p.displayName}</td>
                <td className={tdClass}>{p.philHealthId}</td>
                <td className={tdClass}>
                  <AccountStatusBadge status={p.status} />
                </td>
                <td className={tdClass}>{p.lastVisit ?? "—"}</td>
                <td className={tdClass}>
                  {p.status === "active" ? (
                    <Link
                      href={`/doctor/patients/${p.id}`}
                      className="font-semibold underline-offset-4 hover:underline"
                      aria-label={`Open record for ${p.displayName}`}
                    >
                      Open record <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <span className="text-secondary-500">Clinic Staff verification required</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </TableRegion>
    </>
  );
}
