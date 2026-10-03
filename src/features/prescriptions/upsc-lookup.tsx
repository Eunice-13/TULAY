"use client";

import { type FormEvent, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TextField } from "@/components/ui/field";
import { FileIcon } from "@/components/ui/icons";
import { Notice } from "@/components/ui/notice";
import { StatusBadge } from "@/components/ui/status-badge";
import { lookupPrescription } from "@/lib/data/mutations";
import type { PrescriptionLookupResult } from "@/lib/data/types";
import { formatDate } from "@/lib/format";

interface Props {
  staffLabel: "Clinic Staff" | "Pharmacy Staff";
  demoHint?: string;
}

/**
 * Figma CS3/CS3R and PH3/PH3R. Exact-code lookup only: there is no list of
 * prescriptions to browse. Entering or viewing a UPSC does not consume it,
 * prove validity or authorize dispensing. The code goes in a POST body
 * (server action), never in the URL. Renders PrescriptionLookupResponse.
 */
export function UpscLookup({ staffLabel, demoHint }: Props) {
  const [result, setResult] = useState<PrescriptionLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get("upsc") ?? "");
    startTransition(async () => {
      const res = await lookupPrescription(code);
      if (res.data) {
        setError(null);
        setResult(res.data);
        requestAnimationFrame(() => headingRef.current?.focus());
      } else {
        setResult(null);
        setError(res.error?.message ?? "Unable to look up that UPSC.");
      }
    });
  }

  if (result) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Card labelledBy="rx-heading">
          <StatusBadge>Doctor-issued · Read only</StatusBadge>
          <h2 id="rx-heading" ref={headingRef} tabIndex={-1} className="mt-4 text-2xl font-medium">
            {result.beneficiary.displayName}
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary-500">
            {result.beneficiary.mockPhilHealthId ? (
              <>
                PhilHealth ID: {result.beneficiary.mockPhilHealthId}
                <br />
              </>
            ) : null}
            Confirm beneficiary identity and the doctor-issued prescription before dispensing.
          </p>
          <div className="mt-4 flex gap-3 rounded-tulay-12 bg-canvas p-4">
            <FileIcon className="shrink-0" />
            <div className="min-w-0 text-sm leading-6">
              <p className="font-semibold break-words">{result.attachmentFileName ?? "Structured prescription"}</p>
              <p>
                UPSC · <span className="font-mono">{result.mockUpsc}</span>
              </p>
              <p className="text-secondary-500">
                Issued by {result.doctor.displayName} · {result.clinic.name} · {formatDate(result.issuedAt)}
              </p>
            </div>
          </div>
          <h3 className="mt-5 text-sm font-semibold">Prescription details are preserved</h3>
          <p className="mt-1 text-sm text-secondary-500">
            Review the doctor-issued prescription and patient details. {staffLabel} cannot edit the prescription or
            issue a UPSC.
          </p>
        </Card>
        <Card labelledBy="guidance-heading">
          <CardTitle id="guidance-heading">Prescribed medicine</CardTitle>
          <ul className="mt-3 flex flex-col gap-3">
            {result.items.map((item) => (
              <li key={item.medicineId} className="rounded-tulay-12 border border-secondary-100 p-3 text-sm leading-6">
                <p className="font-semibold">
                  {item.genericName} {item.strength} · {item.dosageForm}
                </p>
                <p className="text-secondary-500">{item.instructions}</p>
                {item.prescribedQuantity !== null ? (
                  <p className="text-secondary-500">Prescribed quantity: {item.prescribedQuantity}</p>
                ) : null}
              </li>
            ))}
          </ul>
          <Notice className="mt-4">
            If the full prescription cannot be supplied, staff manually provide a note/slip for the patient. TULAY does
            not generate slips or track quantities.
          </Notice>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => {
              setResult(null);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
          >
            <span aria-hidden="true">←</span> Back to prescription search
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <Card labelledBy="lookup-heading" className="max-w-2xl">
      <CardTitle id="lookup-heading">Find an e-reseta by UPSC</CardTitle>
      <p className="mt-1 mb-4 text-sm text-secondary-500">Enter the patient's UPSC exactly as shown on their e-reseta.</p>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <TextField
            ref={inputRef}
            id="upsc"
            name="upsc"
            label="UPSC"
            placeholder="Enter UPSC"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            hint={demoHint ? `For example: ${demoHint}` : undefined}

            error={error ?? undefined}
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Finding…" : "Find e-reseta"}
        </Button>
      </form>
      <Notice className="mt-5">
        Review the doctor-issued e-reseta before supplying medicines. Entering or viewing a UPSC does not consume the
        prescription or prove its validity.
      </Notice>
    </Card>
  );
}
