"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { LinkField, TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";

/**
 * Shared dependent form.
 * - variant "onboarding": P1 • Dependents (222:2506)
 * - variant "edit": P1 • Edit dependents • Active (222:5680) / • Pending (222:5775)
 */
type DependentFormProps = {
  variant: "onboarding" | "edit";
  birthDateLabel?: string;
  birthDateHref: string;
  /** Where "Save and continue" and the "no dependents" action lead. */
  nextHref: string;
};

const COPY = {
  onboarding: {
    contactLabel: "Contact number",
    birthHint: undefined,
    skipLabel: "I do not have any qualified dependents",
  },
  edit: {
    contactLabel: "Mobile number",
    birthHint: "Calendar picker.",
    skipLabel: "I have no qualified dependents",
  },
} as const;

export function DependentForm({ variant, birthDateLabel, birthDateHref, nextHref }: DependentFormProps) {
  const router = useRouter();
  const copy = COPY[variant];
  const tone = variant === "edit" ? "faint" : "black";
  const field = { tone, labelGap: "gap-1.5" } as const;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(nextHref);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      <fieldset className="contents">
        <legend className="sr-only">Dependent details</legend>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-6">
          <TextField {...field} label="Last name" name="depLastName" defaultValue="Dela Cruz" />
          <TextField {...field} label="First name" name="depFirstName" defaultValue="Juan" />
          <TextField {...field} label="Middle initial" name="depMiddleInitial" defaultValue="A." />
          <TextField {...field} label="Affix (optional)" name="depAffix" defaultValue="None" />
          <LinkField
            {...field}
            href={birthDateHref}
            label="Birth date"
            value={birthDateLabel ?? "Select birth date"}
            hint={copy.birthHint}
          />
          <TextField {...field} label="Relationship" name="depRelationship" defaultValue="Child" />
        </div>
      </fieldset>

      <fieldset className="w-full">
        <legend className="mb-5 block text-base font-bold text-primary">Dependent’s registered address</legend>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-6">
          <TextField {...field} label="House number / street" name="depStreet" placeholder="Enter street" className="md:col-span-2" />
          <TextField {...field} label="Barangay" name="depBarangay" placeholder="Enter barangay" />
          <TextField {...field} label="City / municipality" name="depCity" placeholder="Select city" />
          <TextField {...field} label="Province / region" name="depProvince" placeholder="Select province" />
          <TextField {...field} label="Postal code" name="depPostal" inputMode="numeric" placeholder="Enter postal code" />
          <TextField {...field} label={copy.contactLabel} name="depContact" type="tel" placeholder="Optional demo number" />
          <TextField {...field} label="Email address" name="depEmail" type="email" placeholder="Optional demo email" />
        </div>
      </fieldset>

      <div className={cn("flex w-full flex-col gap-5 md:flex-row md:gap-4")}>
        <Button type="submit">Save and continue</Button>
        <ButtonLink href={nextHref} variant="secondary">
          {copy.skipLabel}
        </ButtonLink>
      </div>
      <p className="w-full text-sm text-black">You can add dependents later from Edit profile.</p>
    </form>
  );
}
