"use client";

import { type FormEvent, useState, useTransition } from "react";

import { ActionFeedback } from "@/components/ui/action-feedback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextAreaField, TextField } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { updateFacilityProfile } from "@/lib/data/mutations";
import type { ApiResult } from "@/types/domain";
import type { PreviewFacilityProfile } from "@/lib/preview/types";

type Errors = Partial<Record<"name" | "address" | "email", string>>;

/** Figma FacilityPharmacy — public facility profile editor. Preview: not saved. */
export function FacilityForm({ facilityId, facility }: { facilityId: string; facility: PreviewFacilityProfile }) {
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<ApiResult<unknown> | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const e: Errors = {};
    if (!String(data.get("name") ?? "").trim()) e.name = "Enter the facility name.";
    if (!String(data.get("address") ?? "").trim()) e.address = "Enter the registered address.";
    const email = String(data.get("email") ?? "");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email address.";
    setErrors(e);
    setResult(null);
    if (Object.keys(e).length > 0) return;
    const field = (k: string) => String(data.get(k) ?? "").trim();
    startTransition(async () =>
      setResult(
        await updateFacilityProfile({
          facilityId,
          name: field("name"),
          address: field("address"),
          contact: field("contact"),
          email: field("email"),
          hours: field("hours"),
          notice: field("notice"),
        }),
      ),
    );
  }

  return (
    <Card className="max-w-3xl">
      <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField id="name" name="name" label="Facility name" defaultValue={facility.name} error={errors.name} />
        </div>
        <div className="sm:col-span-2">
          <TextField
            id="address"
            name="address"
            label="Address"
            placeholder="Enter the facility's registered address"
            defaultValue={facility.address}
            error={errors.address}
          />
        </div>
        <TextField id="contact" name="contact" type="tel" label="Contact number" placeholder="Facility contact number" defaultValue={facility.contact} />
        <TextField id="email" name="email" type="email" label="Email" placeholder="Facility email address" defaultValue={facility.email} error={errors.email} />
        <TextField id="services" label="Services" defaultValue={facility.services} disabled hint="Configured by your administrator." />
        <TextField id="hours" name="hours" label="Operating days and hours" defaultValue={facility.hours} />
        <div className="sm:col-span-2">
          <TextAreaField id="notice" name="notice" label="Temporary notice" optional placeholder="Add a closure, holiday or service notice" defaultValue={facility.notice} />
        </div>
        <p className="text-xs text-secondary-500 sm:col-span-2">
          Source: Authorized facility staff · Updated {facility.updatedAt}
        </p>
        <Notice className="sm:col-span-2">
          Only your own assigned facility can be edited. Patients see the profile in the provider directory.
        </Notice>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save profile"}
          </Button>
        </div>
        <div className="sm:col-span-2">
          <ActionFeedback
            result={result}
              success={<p className="text-sm font-medium text-success">Facility profile saved.</p>}
            previewMessage="The facility profile is not saved or published until the directory is connected."
          />
        </div>
      </form>
    </Card>
  );
}
