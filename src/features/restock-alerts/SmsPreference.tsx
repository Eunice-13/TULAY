"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

/**
 * SMS • Visual preference (222:3988, Off) and SMS • Visual On state (222:5562).
 * Visual only: nothing is saved or sent, as stated in the design.
 */
export function SmsPreference({ initialOn = false, backHref }: { initialOn?: boolean; backHref: string }) {
  const [on, setOn] = useState(initialOn);
  const labelId = useId();

  return (
    <>
      <section aria-labelledby="notify" className="flex w-full flex-col gap-2 rounded-tulay bg-soft p-4">
        <h2 id="notify" className="text-base font-semibold text-primary">
          Notify me when restocked
        </h2>
        <div className="flex w-full items-center justify-between">
          <span id={labelId} className="min-w-0 flex-1 text-sm font-semibold text-primary">
            SMS alerts
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-labelledby={labelId}
            onClick={() => setOn((value) => !value)}
            className="relative -my-[7px] shrink-0 rounded-full py-[7px]"
          >
            <Image src={on ? "/icons/toggle-on.svg" : "/icons/toggle-off.svg"} alt="" width={52} height={30} />
          </button>
        </div>
      </section>

      <div className="flex w-full flex-col gap-2">
        <TextField tone="muted" label="Mobile number" type="tel" name="smsNumber" autoComplete="tel" placeholder="+63 9XX XXX XXXX" />
        <span aria-hidden="true" className="block h-5" />
      </div>

      <section aria-labelledby="no-messages" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4">
        <h2 id="no-messages" className="text-base font-semibold text-primary">
          No messages will be sent
        </h2>
        <p className="text-sm text-muted">
          This design shows the preference only. It does not save a subscription, schedule alerts or send an SMS.
        </p>
      </section>

      <ButtonLink href={backHref} variant="secondary">
        {on ? "Back to pharmacy" : "Back to Pharmacy"}
      </ButtonLink>
    </>
  );
}
