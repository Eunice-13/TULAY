"use client";

import { type FormEvent, useState, useTransition } from "react";

import { ActionFeedback } from "@/components/ui/action-feedback";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { SelectField, TextAreaField } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { activateBeneficiary, denyActivation } from "@/lib/data/mutations";
import type { DenyActivationResponse } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format";
import type { ActivateBeneficiaryResponse, ApiResult } from "@/types/domain";

const CHECKS = [
  "Identity document reviewed in person",
  "Name and birth date match submitted record",
  "PhilHealth ID matches the registry record",
];

type Step = "review" | "deny" | "activated" | "denied";

interface Props {
  beneficiaryId: string;
  patient: { displayName: string; philHealthId: string };
  recordMatch: string;
  staffName: string;
}

/**
 * Figma CS2R → CS2A (activate) / CS2D (deny). Activation is an explicit staff
 * decision after in-person review; every checklist item must be confirmed.
 * Calls activateBeneficiary / denyActivation in src/lib/data/mutations.ts.
 */
export function ActivationReview({ beneficiaryId, patient, recordMatch, staffName }: Props) {
  const [step, setStep] = useState<Step>("review");
  const [checked, setChecked] = useState<boolean[]>(CHECKS.map(() => false));
  const [checkError, setCheckError] = useState<string | null>(null);
  const [denyError, setDenyError] = useState<string | null>(null);
  const [denial, setDenial] = useState({ reason: "", nextStep: "" });
  const [activation, setActivation] = useState<ApiResult<ActivateBeneficiaryResponse> | null>(null);
  const [denialResult, setDenialResult] = useState<ApiResult<DenyActivationResponse> | null>(null);
  const [pending, startTransition] = useTransition();

  function activate() {
    if (!checked.every(Boolean)) {
      setCheckError("Confirm every verification step before activating.");
      return;
    }
    setCheckError(null);
    startTransition(async () => {
      const result = await activateBeneficiary(beneficiaryId);
      setActivation(result);
      if (result.data) setStep("activated");
    });
  }

  function confirmDenial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!denial.reason || !denial.nextStep.trim()) {
      setDenyError("Choose a reason and describe the next step for the patient.");
      return;
    }
    setDenyError(null);
    startTransition(async () => {
      const result = await denyActivation({ beneficiaryId, reason: denial.reason, nextStep: denial.nextStep.trim() });
      setDenialResult(result);
      if (result.data) setStep("denied");
    });
  }

  if (step === "activated" && activation) {
    const done = activation.data;
    return (
      <Card className="max-w-2xl">
        <StatusBadge tone="success">{done ? "Active" : "Active (preview)"}</StatusBadge>
        <CardTitle className="mt-4">Account activated</CardTitle>
        <p className="mt-2 text-sm leading-6">
          {patient.displayName} · {patient.philHealthId}
          <br />
          Verified by {staffName} · Clinic Staff{done ? ` · ${formatDateTime(done.activatedAt)}` : ""}
        </p>
        <p className="mt-2 text-sm text-secondary-500">
          The patient can view prescriptions, referrals, appointments and benefit estimates.
        </p>
        <div className="mt-4">
          <ActionFeedback
            result={activation}
            previewMessage="The account is still pending. Activation is recorded once the backend is connected."
          />
        </div>
        <LinkButton href="/clinic/activations" className="mt-5">
          Back to activations
        </LinkButton>
      </Card>
    );
  }

  if (step === "denied" && denialResult) {
    return (
      <Card className="max-w-2xl">
        <StatusBadge tone="danger">{denialResult.data ? "Denied" : "Denied (preview)"}</StatusBadge>
        <CardTitle className="mt-4">Activation denied</CardTitle>
        <p className="mt-2 text-sm leading-6">
          Reason: {denial.reason}
          <br />
          Next step for patient: {denial.nextStep}
        </p>
        <div className="mt-4">
          <ActionFeedback
            result={denialResult}
            previewMessage="The denial was not recorded and the patient was not notified."
          />
        </div>
        <LinkButton href="/clinic/activations" className="mt-5">
          Back to activations
        </LinkButton>
      </Card>
    );
  }

  if (step === "deny") {
    return (
      <Card className="max-w-2xl" labelledBy="deny-heading">
        <StatusBadge tone="warning">Review required</StatusBadge>
        <CardTitle id="deny-heading" className="mt-4">
          Deny activation
        </CardTitle>
        <p className="mt-1 text-sm text-secondary-500">
          Explain what {patient.displayName} needs to correct before another review.
        </p>
        <form onSubmit={confirmDenial} noValidate className="mt-5 grid gap-5">
          <SelectField
            id="deny-reason"
            label="Reason for denial"
            value={denial.reason}
            onChange={(e) => setDenial({ ...denial, reason: e.target.value })}
          >
            <option value="">Select a reason</option>
            <option>Missing or mismatched identity information</option>
            <option>Identity document not presented</option>
            <option>PhilHealth ID does not match the record</option>
          </SelectField>
          <TextAreaField
            id="deny-next"
            label="Next step for patient"
            placeholder="Bring the correct document to your clinic for re-verification."
            value={denial.nextStep}
            onChange={(e) => setDenial({ ...denial, nextStep: e.target.value })}
            hint="The patient will see the reason and next step."
          />
          {denyError ? (
            <p role="alert" className="text-sm font-medium text-danger">
              {denyError}
            </p>
          ) : null}
          <ActionFeedback result={denialResult} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="danger" disabled={pending}>
              {pending ? "Saving…" : "Confirm denial"}
            </Button>
            <Button variant="secondary" onClick={() => setStep("review")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card labelledBy="verify-heading">
      <StatusBadge tone="info">{recordMatch === "Needs review" ? "Needs review" : "Matched · Awaiting verification"}</StatusBadge>
      <CardTitle id="verify-heading" className="mt-4">
        Clinic verification
      </CardTitle>
      <fieldset className="mt-3">
        <legend className="sr-only">Verification checklist</legend>
        <ul className="flex flex-col gap-1">
          {CHECKS.map((label, i) => (
            <li key={label}>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={(e) => setChecked(checked.map((c, j) => (j === i ? e.target.checked : c)))}
                  className="size-5 accent-primary"
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="mt-3">
        <TextAreaField id="staff-notes" label="Staff review notes" optional placeholder="Identity verified during clinic visit." />
      </div>
      {checkError ? (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {checkError}
        </p>
      ) : null}
      <div className="mt-3">
        <ActionFeedback result={activation} />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
        <Button onClick={activate} aria-describedby="activate-note" disabled={pending}>
          {pending ? "Activating…" : "Activate account"}
        </Button>
        <Button variant="secondary" onClick={() => setStep("deny")}>
          Deny with reason
        </Button>
      </div>
      <p id="activate-note" className="mt-3 text-xs text-secondary-500">
        Only authorized Clinic Staff may activate an account.
      </p>
    </Card>
  );
}
