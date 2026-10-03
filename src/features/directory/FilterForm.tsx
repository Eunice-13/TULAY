"use client";

import { useRouter } from "next/navigation";
import { useRef, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/TextField";
import { DEFAULT_FILTERS, FILTER_OPTIONS } from "./filters";

/** Filter fields + Apply / Reset (P3 • Pending clinic filters 222:4923, P3 • Search filters 222:3273). */
export function FilterForm({ applyHref }: { applyHref: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      if (typeof value === "string") params.set(key, value);
    }
    router.push(`${applyHref}?${params.toString()}`);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-6">
        <SelectField reserveHint label="City / Municipality" name="city" options={FILTER_OPTIONS.city} defaultValue={DEFAULT_FILTERS.city} />
        <SelectField reserveHint label="Distance" name="distance" options={FILTER_OPTIONS.distance} defaultValue={DEFAULT_FILTERS.distance} />
        <SelectField
          reserveHint
          label="Provider Type"
          name="type"
          options={FILTER_OPTIONS.providerType}
          defaultValue={DEFAULT_FILTERS.providerType}
        />
        <SelectField reserveHint label="Operating Hours" name="hours" options={FILTER_OPTIONS.hours} defaultValue={DEFAULT_FILTERS.hours} />
      </div>
      <div className="flex w-full flex-col gap-5 md:flex-row md:gap-4">
        <Button type="submit">Apply Filters</Button>
        <Button type="button" variant="secondary" onClick={() => formRef.current?.reset()}>
          Reset filters
        </Button>
      </div>
    </form>
  );
}
