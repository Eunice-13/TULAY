"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

/** P8 • Add demo claim (222:4173) — nothing is submitted or stored. */
export function DemoClaimForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/benefit-balance?view=deductions");
  }

  const field = { tone: "muted" } as const;

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-6">
        <div className="flex flex-col gap-2">
          <TextField {...field} label="Medicine or service" name="item" defaultValue="Demo medicine A" />
          <span aria-hidden="true" className="block h-5" />
        </div>
        <div className="flex flex-col gap-2">
          <TextField {...field} label="Claim date" name="date" defaultValue="October 4, 2026" />
          <span aria-hidden="true" className="block h-5" />
        </div>
        <div className="flex flex-col gap-2">
          <TextField {...field} label="Quantity" name="quantity" inputMode="numeric" defaultValue="30" />
          <span aria-hidden="true" className="block h-5" />
        </div>
        <div className="flex flex-col gap-2">
          <TextField {...field} label="Example amount (₱)" name="amount" inputMode="decimal" defaultValue="1,200" />
          <p className="text-sm text-muted">Illustrative price, not an official tariff.</p>
        </div>
      </div>

      <section aria-labelledby="preview-note" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4">
        <h2 id="preview-note" className="text-base font-semibold text-primary">
          This is an interface preview
        </h2>
        <p className="text-sm text-muted">
          Your sample claim will not be submitted to PhilHealth or stored by this prototype.
        </p>
      </section>

      <Button type="submit">Preview recorded claim</Button>
    </form>
  );
}
