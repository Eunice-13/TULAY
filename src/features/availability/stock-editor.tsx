"use client";

import { useMemo, useState, useTransition } from "react";

import { ActionFeedback } from "@/components/ui/action-feedback";
import { updateAvailability } from "@/lib/data/mutations";
import { formatDateTime } from "@/lib/format";
import type { ApiResult, MedicineAvailability } from "@/types/domain";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TableRegion, tdClass, thClass } from "@/components/ui/data-table";
import { SelectField, TextField } from "@/components/ui/field";
import { PillIcon } from "@/components/ui/icons";
import { Notice } from "@/components/ui/notice";
import { StockBadge, StatusBadge } from "@/components/ui/status-badge";
import type { PreviewMedicineReport, StockStatus } from "@/lib/preview/types";

const PAGE_SIZE = 6;

interface Props {
  /** The caller's own facility. The server must still verify the assignment. */
  facilityId: string;
  medicines: PreviewMedicineReport[];
  reportSource: string;
  updatedBy: string;
}

interface SavedReport {
  label: string;
  status: StockStatus;
  previous: StockStatus;
  result: ApiResult<MedicineAvailability>;
}

/**
 * Figma PH2 / PH2O → PH2S / PH2SO (pharmacy) and CS4 (clinic dispensary).
 * Status is only available / out_of_stock with a timestamp: no counts.
 * Saves through updateAvailability (PATCH /api/medicines/availability).
 */
export function StockEditor({ facilityId, medicines, reportSource, updatedBy }: Props) {
  const [pending, startTransition] = useTransition();
  const [rows, setRows] = useState(medicines);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StockStatus>("all");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState(medicines[0]?.id ?? null);
  const [choice, setChoice] = useState<StockStatus>(medicines[0]?.status ?? "available");
  const [saved, setSaved] = useState<SavedReport | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (m) =>
        (statusFilter === "all" || m.status === statusFilter) &&
        (!q || `${m.genericName} ${m.dosageForm}`.toLowerCase().includes(q)),
    );
  }, [rows, query, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const selected = rows.find((m) => m.id === selectedId) ?? null;

  function select(m: PreviewMedicineReport) {
    setSelectedId(m.id);
    setChoice(m.status);
    setSaved(null);
  }

  function save() {
    if (!selected) return;
    const target = selected;
    const status = choice;
    startTransition(async () => {
      const result = await updateAvailability({ facilityId, medicineId: target.id, status });
      if (result.data) {
        const lastReport = formatDateTime(result.data.updatedAt);
        setRows((prev) => prev.map((m) => (m.id === target.id ? { ...m, status, lastReport } : m)));
      }
      setSaved({ label: `${target.genericName} · ${target.dosageForm}`, status, previous: target.status, result });
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      <section aria-label="Supported medicines" className="min-w-0">
        <div className="mb-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-end">
          <TextField
            id="medicine-search"
            type="search"
            label="Search medicines"
            placeholder="Search medicine or dosage form"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
          />
          <SelectField
            id="stock-filter"
            label="Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setPage(0);
            }}
          >
            <option value="all">All</option>
            <option value="available">In stock</option>
            <option value="out_of_stock">Out of stock</option>
          </SelectField>
        </div>
        <p className="mb-3 text-sm text-secondary-500" aria-live="polite">
          {filtered.length} supported medicines · Page {safePage + 1} of {pageCount}
        </p>
        <TableRegion label="Medicine availability reports">
          <thead>
            <tr>
              <th scope="col" className={thClass}>Medicine / form</th>
              <th scope="col" className={thClass}>Status</th>
              <th scope="col" className={thClass}>Last report</th>
              <th scope="col" className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={4} className={`${tdClass} text-center text-secondary-500`}>
                  No medicines match your search.
                </td>
              </tr>
            ) : (
              visible.map((m) => (
                <tr key={m.id} className={m.id === selectedId ? "bg-secondary-100" : undefined}>
                  <td className={tdClass}>
                    {m.genericName} {m.strength} · {m.dosageForm}
                  </td>
                  <td className={tdClass}>
                    <StockBadge status={m.status} />
                  </td>
                  <td className={tdClass}>{m.lastReport}</td>
                  <td className={tdClass}>
                    <button
                      type="button"
                      onClick={() => select(m)}
                      aria-pressed={m.id === selectedId}
                      className="font-semibold underline-offset-4 hover:underline"
                    >
                      Update status<span className="sr-only"> for {m.genericName}</span> <span aria-hidden="true">→</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </TableRegion>
        <div className="mt-4 flex items-center gap-3">
          <Button variant="secondary" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
            Previous
          </Button>
          <span className="text-sm">{safePage + 1}</span>
          <Button variant="secondary" disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)}>
            Next
          </Button>
        </div>
      </section>

      <Card labelledBy="report-heading" className="h-fit">
        {selected ? (
          <>
            <PillIcon />
            <CardTitle id="report-heading" className="mt-3">
              {selected.genericName} · {selected.dosageForm}
            </CardTitle>
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold">Report availability</legend>
              <div className="mt-2 flex flex-wrap gap-3">
                {(["available", "out_of_stock"] as const).map((s) => (
                  <label
                    key={s}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-tulay-8 border border-grey-200 px-4 text-sm font-semibold has-[:checked]:border-primary has-[:checked]:bg-tertiary"
                  >
                    <input
                      type="radio"
                      name="availability"
                      value={s}
                      checked={choice === s}
                      onChange={() => {
                        setChoice(s);
                        setSaved(null);
                      }}
                      className="accent-primary"
                    />
                    {s === "available" ? "In stock" : "Out of stock"}
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="mt-3 text-xs leading-5 text-secondary-500">
              Report source: {reportSource}
              <br />
              Last updated: {selected.lastReport}
            </p>
            <Button className="mt-4" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save stock report"}
            </Button>
            <p className="mt-3 text-sm text-secondary-500">The report is visible in the patient's pharmacy finder.</p>

            {saved?.result.data ? (
              <div className="mt-4 flex flex-col gap-3" role="status">
                <p className="text-sm font-semibold">
                  Stock report saved
                </p>
                <StatusBadge>Provider-reported</StatusBadge>
                <p className="text-sm leading-6">
                  {saved.label}
                  <br />
                  Availability: {saved.status === "available" ? "In stock" : "Out of stock"}
                  <br />
                  Updated by: {updatedBy}
                </p>
                {saved.previous === "out_of_stock" && saved.status === "available" ? (
                  <p className="text-sm text-secondary-500">
                    This Out of stock → In stock change notifies subscribed patients once.
                  </p>
                ) : null}
                <ActionFeedback result={saved.result} />
              </div>
            ) : (
              <div className="mt-4">
                <ActionFeedback result={saved?.result ?? null} />
              </div>
            )}
            <Notice className="mt-4">Reports describe availability at the time of update.</Notice>
          </>
        ) : (
          <CardTitle id="report-heading">Select a medicine to update</CardTitle>
        )}
      </Card>
    </div>
  );
}
