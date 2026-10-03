"use client";

import { type FormEvent, useState } from "react";

import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { SelectField, TextField } from "@/components/ui/field";
import { PreviewNotice } from "@/components/ui/notice";
import { StatusBadge } from "@/components/ui/status-badge";

const SLOTS = ["09:00 AM", "10:30 AM", "01:00 PM"];

interface Props {
  patient: { id: string; displayName: string; philHealthId: string };
  referralId: string;
  referralRoute: string;
}

/** Figma M10 → M10C — book on behalf of a referred patient (mock-only). */
export function ReferralBooking({ patient, referralId, referralRoute }: Props) {
  const [service, setService] = useState("");
  const [date, setDate] = useState("2026-10-05");
  const [slot, setSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const longDate = (() => {
    const [y, m, d] = date.split("-").map(Number);
    return y ? new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "";
  })();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!service || !date || !slot) {
      setError("Choose a service, date and time slot.");
      return;
    }
    setError(null);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <Card>
        <StatusBadge tone="warning">Preview · Not booked</StatusBadge>
        <CardTitle className="mt-4">Appointment details ready</CardTitle>
        <p className="mt-2 text-sm leading-6">
          <strong className="font-semibold">{patient.displayName}</strong>
          <br />
          {longDate} · {slot}
          <br />
          {service} · Selected referral destination
          <br />
          Referral {referralId}
        </p>
        <p className="mt-3 text-sm text-secondary-500">
          Bring an identity document, referral details and relevant consultation records.
        </p>
        <div className="mt-4">
          <PreviewNotice>
            The appointment was not booked and will not appear in the patient's dashboard until scheduling is connected.
          </PreviewNotice>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <LinkButton href={`/doctor/patients/${patient.id}`}>Open patient record</LinkButton>
          <LinkButton href="/doctor/appointments" variant="secondary">
            View appointments
          </LinkButton>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card labelledBy="booking-heading">
        <CardTitle id="booking-heading">Appointment</CardTitle>
        <dl className="mt-3 grid gap-2 text-sm leading-6">
          <div>
            <dt className="inline text-secondary-500">Patient: </dt>
            <dd className="inline">
              {patient.displayName} · {patient.philHealthId}
            </dd>
          </div>
          <div>
            <dt className="inline text-secondary-500">Referral: </dt>
            <dd className="inline">
              {referralId} · {referralRoute}
            </dd>
          </div>
          <div>
            <dt className="inline text-secondary-500">Destination facility: </dt>
            <dd className="inline">Selected referral destination</dd>
          </div>
        </dl>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <SelectField id="service" label="Service / specialist" value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">Choose the referred service</option>
            <option>Referred consultation</option>
            <option>Specialist consultation</option>
            <option>Laboratory test</option>
          </SelectField>
          <TextField id="date" label="Appointment date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold">Available time slots</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SLOTS.map((s) => (
              <label
                key={s}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-tulay-8 border border-grey-200 px-4 text-sm has-[:checked]:border-primary has-[:checked]:bg-secondary-100"
              >
                <input type="radio" name="slot" value={s} checked={slot === s} onChange={() => setSlot(s)} className="accent-primary" />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
        {error ? (
          <p role="alert" className="mt-4 text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="mt-6">
          Confirm appointment
        </Button>
      </Card>
      <Card labelledBy="next-heading">
        <CardTitle id="next-heading">Referral and next steps</CardTitle>
        <p className="mt-2 text-sm leading-6 text-secondary-500">
          Patient: {patient.displayName}
          <br />
          Referral: {referralId}
          <br />
          Destination: Selected hospital
          <br />
          Service: {service || "Not chosen yet"}
        </p>
        <h3 className="mt-5 text-sm font-semibold">What to bring</h3>
        <p className="mt-1 text-sm text-secondary-500">Identity document, referral details and relevant consultation records.</p>
        <p className="mt-4 text-xs text-secondary-500">The confirmed appointment is shared with the patient's appointment view.</p>
      </Card>
    </form>
  );
}
