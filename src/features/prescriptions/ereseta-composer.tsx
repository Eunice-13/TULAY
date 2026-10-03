"use client";

import Link from "next/link";
import { type FormEvent, useState, useTransition } from "react";

import { ActionFeedback } from "@/components/ui/action-feedback";
import { PreviewNotice } from "@/components/ui/notice";
import { issuePrescription } from "@/lib/data/mutations";
import { isNotConnected } from "@/lib/data/result";
import { formatDateTime } from "@/lib/format";
import type { ApiResult, IssuePrescriptionRequest, IssuePrescriptionResponse } from "@/types/domain";

import { Button, LinkButton, buttonClasses } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";

interface ComposerProps {
  patient: { id: string; displayName: string; firstName: string; philHealthId: string };
  medicines: Array<{ id: string; label: string }>;
  /** Continuation e-reseta for an existing escalation referral (Figma M6). */
  referralId?: string;
  /** Where "Book appointment" goes after a continuation e-reseta. */
  bookHref?: string;
}

interface Draft {
  medicineId: string;
  prescribedQuantity: string;
  instructions: string;
  fileName: string | null;
  note: string;
}

type Step = "edit" | "review" | "sent";

/**
 * Figma M4 → M4R. Follows the API contract: the doctor enters the prescription
 * and the BACKEND generates the unique mock UPSC on send. The doctor never types
 * a code. In this preview nothing is sent and no UPSC is generated.
 */
export function EResetaComposer({ patient, medicines, referralId, bookHref }: ComposerProps) {
  const [step, setStep] = useState<Step>("edit");
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [draft, setDraft] = useState<Draft>({
    medicineId: "",
    prescribedQuantity: "",
    instructions: "",
    fileName: null,
    note: "",
  });

  const [sendResult, setSendResult] = useState<ApiResult<IssuePrescriptionResponse> | null>(null);
  const [pending, startTransition] = useTransition();
  const medicineLabel = medicines.find((m) => m.id === draft.medicineId)?.label ?? "";

  /** Sends an IssuePrescriptionRequest (domain.ts). The backend generates the UPSC. */
  function send() {
    const request: IssuePrescriptionRequest = {
      beneficiaryId: patient.id,
      items: [
        {
          medicineId: draft.medicineId,
          instructions: draft.instructions.trim(),
          ...(draft.prescribedQuantity ? { prescribedQuantity: Number(draft.prescribedQuantity) } : {}),
        },
      ],
    };
    startTransition(async () => {
      const result = await issuePrescription(request);
      setSendResult(result);
      if (result.data || isNotConnected(result)) setStep("sent");
    });
  }

  function onReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: typeof errors = {};
    if (!draft.medicineId) next.medicineId = "Select the prescribed medicine.";
    if (!draft.instructions.trim()) next.instructions = "Enter the dosage instructions.";
    if (draft.prescribedQuantity && !/^\d{1,4}$/.test(draft.prescribedQuantity)) {
      next.prescribedQuantity = "Enter a whole number.";
    }
    setErrors(next);
    if (Object.keys(next).length === 0) setStep("review");
  }

  if (step === "sent" && sendResult) {
    const issued = sendResult.data;
    return (
      <Card>
        {issued ? (
          <>
            <StatusBadge tone="success">Sent to patient</StatusBadge>
            <CardTitle className="mt-4">E-reseta sent to {patient.displayName}</CardTitle>
            <p className="mt-2 text-sm leading-6">
              UPSC · <span className="font-mono font-semibold">{issued.mockUpsc}</span>
              <br />
              Issued {formatDateTime(issued.issuedAt)}
            </p>
            <p className="mt-2 text-sm text-secondary-500">
              It now appears in the patient's dashboard and prescription history.
            </p>
          </>
        ) : (
          <>
            <StatusBadge tone="warning">Preview · Not sent</StatusBadge>
            <CardTitle className="mt-4">E-reseta ready for the backend</CardTitle>
            <p className="mt-2 text-sm leading-6 text-secondary-500">
              When the backend is connected, sending saves this prescription for {patient.displayName}, generates its
              unique UPSC, and shows it in the patient's dashboard and prescription history.
            </p>
            <div className="mt-4">
              <PreviewNotice>No prescription was saved and no UPSC was generated.</PreviewNotice>
            </div>
          </>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <LinkButton href={`/doctor/patients/${patient.id}`}>Back to patient record</LinkButton>
          {referralId && bookHref ? (
            <LinkButton href={bookHref} variant="secondary">
              Book appointment
            </LinkButton>
          ) : null}
        </div>
      </Card>
    );
  }

  if (step === "review") {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card labelledBy="review-heading">
          <StatusBadge tone="info">Ready to send</StatusBadge>
          <CardTitle id="review-heading" className="mt-4">
            Recipient: {patient.displayName}
          </CardTitle>
          <p className="text-sm text-secondary-500">{patient.philHealthId} · Your assigned clinic</p>
          <dl className="mt-5 grid gap-4 text-sm leading-6">
            <div>
              <dt className="text-xs text-secondary-500">Prescribed medicine</dt>
              <dd className="font-medium">{medicineLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-secondary-500">Instructions</dt>
              <dd>{draft.instructions}</dd>
            </div>
            {draft.prescribedQuantity ? (
              <div>
                <dt className="text-xs text-secondary-500">Prescribed quantity</dt>
                <dd>{draft.prescribedQuantity}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs text-secondary-500">Attached file</dt>
              <dd>{draft.fileName ?? "No file attached"}</dd>
            </div>
            <div>
              <dt className="text-xs text-secondary-500">UPSC · Unique Prescription Code</dt>
              <dd>Generated by TULAY when you send</dd>
            </div>
            <div>
              <dt className="text-xs text-secondary-500">Issued by</dt>
              <dd>Dr. Andrea Reyes · Physical consultation · 04 Oct 2026</dd>
            </div>
            {draft.note ? (
              <div>
                <dt className="text-xs text-secondary-500">Note to patient</dt>
                <dd>{draft.note}</dd>
              </div>
            ) : null}
          </dl>
          <StatusBadge tone="warning">Not sent yet · Review required</StatusBadge>
        </Card>
        <Card labelledBy="send-heading">
          <CardTitle id="send-heading">Send to {patient.firstName}</CardTitle>
          <p className="mt-2 text-sm leading-6 text-secondary-500">
            Sending makes this e-reseta visible in {patient.firstName}'s patient dashboard and prescription history.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Button onClick={send} disabled={pending}>
              {pending ? "Sending…" : `Send to ${patient.firstName}`}
            </Button>
            {sendResult && !isNotConnected(sendResult) ? <ActionFeedback result={sendResult} /> : null}
            <Button variant="secondary" onClick={() => setStep("edit")}>
              Edit prescription
            </Button>
            <Link href={`/doctor/patients/${patient.id}`} className={buttonClasses("ghost")}>
              Cancel
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={onReview} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Card labelledBy="compose-heading">
        <CardTitle id="compose-heading">{patient.displayName}</CardTitle>
        <p className="text-sm text-secondary-500">{patient.philHealthId} · Active · Your assigned clinic</p>

        <div className="mt-6 grid gap-5">
          <SelectField
            id="medicine"
            label="Prescribed medicine"
            value={draft.medicineId}
            error={errors.medicineId}
            onChange={(e) => setDraft({ ...draft, medicineId: e.target.value })}
          >
            <option value="">Select a supported medicine</option>
            {medicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </SelectField>
          <div className="grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)]">
            <TextField
              id="quantity"
              label="Quantity"
              optional
              inputMode="numeric"
              value={draft.prescribedQuantity}
              error={errors.prescribedQuantity}
              hint="As written on the prescription."
              onChange={(e) => setDraft({ ...draft, prescribedQuantity: e.target.value })}
            />
            <TextField
              id="instructions"
              label="Instructions"
              placeholder="e.g. 1 tablet once daily"
              value={draft.instructions}
              error={errors.instructions}
              onChange={(e) => setDraft({ ...draft, instructions: e.target.value })}
            />
          </div>
          <TextField
            id="rx-file"
            type="file"
            label="Attach the e-reseta file"
            optional
            accept="application/pdf,image/png,image/jpeg"
            hint="Prescription document or image from the physical checkup."
            onChange={(e) => setDraft({ ...draft, fileName: e.target.files?.[0]?.name ?? null })}
          />
          <div className="rounded-tulay-12 bg-canvas p-4">
            <p className="text-sm font-semibold">UPSC · Unique Prescription Code</p>
            <p className="mt-1 text-sm text-secondary-500">
              Generated by TULAY when you send. You don't need to enter a code.
            </p>
          </div>
          <TextAreaField
            id="note"
            label="Note to patient"
            optional
            placeholder="Add instructions about the attached prescription."
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
          />
          <p className="text-xs text-secondary-500">Only this patient can view the prescription in their dashboard.</p>
        </div>
      </Card>

      <Card labelledBy="checklist-heading">
        <CardTitle id="checklist-heading">Review and send</CardTitle>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-secondary-500">
          <li>Confirm the patient name and PhilHealth ID.</li>
          <li>Enter the medicine and instructions from the physical checkup.</li>
          <li>Attach the prescription file if you have one.</li>
          <li>Review the preview before sending.</li>
        </ul>
        <Button type="submit" className="mt-5 w-full">
          Review e-reseta
        </Button>
        {referralId ? null : (
          <p className="mt-4 text-xs leading-5 text-secondary-500">
            For a continuation e-reseta, open the patient's escalation referral first.{" "}
            <Link href="/doctor/referrals" className="font-semibold underline">
              View referrals
            </Link>
          </p>
        )}
      </Card>
    </form>
  );
}
