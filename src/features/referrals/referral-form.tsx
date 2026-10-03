"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { SelectField, TextAreaField } from "@/components/ui/field";
import { PreviewNotice } from "@/components/ui/notice";

interface ReferralFormProps {
  kind: "escalation" | "digital";
  patient: { id: string; displayName: string; philHealthId: string; summary: string };
  destinations: string[];
  /** Where "Send referral" goes in the preview (e.g. continuation e-reseta for escalations). */
  sendHref: string;
}

type FieldKey = "findings" | "reason" | "urgency" | "destination";

/**
 * Figma M5E (clinic → hospital escalation) and M7 (digital referral).
 * Fields are written by the doctor; TULAY stores them but never diagnoses.
 * MOCK ONLY: nothing is sent.
 */
export function ReferralForm({ kind, patient, destinations, sendHref }: ReferralFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [draftSaved, setDraftSaved] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: typeof errors = {};
    if (!String(data.get("findings") ?? "").trim()) next.findings = "Record the findings from the consultation.";
    if (!String(data.get("reason") ?? "").trim()) next.reason = "Enter the referral reason.";
    if (!data.get("urgency")) next.urgency = "Select urgency.";
    if (!data.get("destination")) next.destination = "Choose a destination.";
    setErrors(next);
    if (Object.keys(next).length === 0) router.push(sendHref);
  }

  const isEscalation = kind === "escalation";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card labelledBy="findings-heading">
        <CardTitle id="findings-heading">Patient and clinical findings</CardTitle>
        <p className="mt-1 text-sm text-secondary-500">
          {patient.displayName} · {patient.philHealthId} · Active · Your assigned clinic
        </p>
        <div className="mt-5 grid gap-5">
          <TextAreaField
            id="findings"
            name="findings"
            label="Screening findings"
            hint={isEscalation ? "Record findings from the physical consultation." : "Enter or review the referring provider's findings."}
            error={errors.findings}
          />
          <TextAreaField
            id="reason"
            name="reason"
            label={isEscalation ? "Referral reason" : "Suspected condition / referral reason"}
            hint="Entered by the doctor. TULAY does not diagnose."
            error={errors.reason}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField id="urgency" name="urgency" label="Urgency" defaultValue="" error={errors.urgency}>
              <option value="" disabled>
                Select urgency
              </option>
              <option>Routine</option>
              <option>Priority</option>
              <option>Urgent</option>
            </SelectField>
            {isEscalation ? (
              <SelectField id="specialist" name="specialist" label="Recommended specialist" optional defaultValue="">
                <option value="">Select specialty</option>
                <option>Internal medicine</option>
                <option>Cardiology</option>
                <option>Endocrinology</option>
                <option>Pulmonology</option>
              </SelectField>
            ) : null}
          </div>
          <SelectField
            id="destination"
            name="destination"
            label={isEscalation ? "Destination hospital" : "Receiving clinic"}
            hint={isEscalation ? "Choose a hospital appropriate to the referral." : "Choose a facility after checking its services."}
            defaultValue=""
            error={errors.destination}
          >
            <option value="" disabled>
              Select a destination
            </option>
            {destinations.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </SelectField>
          {isEscalation ? null : (
            <TextAreaField id="note" name="note" label="Referral note" optional hint="Add information needed by the receiving clinic." />
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="submit">{isEscalation ? "Send referral" : "Send to selected clinic"}</Button>
          <Button variant="secondary" onClick={() => setDraftSaved(true)}>
            Save draft
          </Button>
        </div>
        {draftSaved ? (
          <div className="mt-4">
            <PreviewNotice>Drafts are not stored until referrals are connected.</PreviewNotice>
          </div>
        ) : null}
      </Card>

      <Card labelledBy="summary-heading">
        <CardTitle id="summary-heading">Patient summary</CardTitle>
        <p className="mt-2 text-sm leading-6 whitespace-pre-line text-secondary-500">{patient.summary}</p>
        {isEscalation ? (
          <div className="mt-5 rounded-tulay-12 bg-canvas p-4">
            <h3 className="text-sm font-semibold">Maintenance care</h3>
            <p className="mt-1 text-sm text-secondary-500">
              If maintenance medication is needed during escalation, attach a continuation e-reseta after the
              referral is created.
            </p>
          </div>
        ) : null}
        <Link href={`/doctor/patients/${patient.id}`} className={buttonClasses("secondary", "md", "mt-5")}>
          View patient record
        </Link>
        <p className="mt-4 text-xs text-secondary-500">Referral destinations and clinical details are entered by the doctor.</p>
      </Card>
    </form>
  );
}
