"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { LinkField, TextField } from "@/components/ui/TextField";

type RegistrationFormProps = {
  birthDateLabel: string;
  categoryLabel: string;
};

/** P1 • Registration (222:2397) form body. All values are fictional demo data. */
export function RegistrationForm({ birthDateLabel, categoryLabel }: RegistrationFormProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/register/dependents");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      <fieldset className="contents">
        <legend className="sr-only">Account and personal details</legend>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-6">
          <TextField
            label="Email address"
            type="email"
            name="email"
            autoComplete="email"
            defaultValue="maria.demo@example.com"
            className="md:col-span-2"
          />
          <TextField
            tall
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a password"
            minLength={8}
            hint="At least 8 characters."
            className="md:col-span-2"
          />
          <TextField tall label="Last name" name="lastName" autoComplete="family-name" defaultValue="Dela Cruz" />
          <TextField tall label="First name" name="firstName" autoComplete="given-name" defaultValue="Maria" />
          <TextField tall label="Middle initial" name="middleInitial" autoComplete="additional-name" defaultValue="A." />
          <TextField tall label="Affix (optional)" name="affix" autoComplete="honorific-suffix" defaultValue="None" />
          <LinkField
            tall
            href="/register/birth-date"
            label="Birth date"
            value={birthDateLabel}
            hint="Select from calendar."
          />
          <TextField tall label="Sex" name="sex" defaultValue="Female" />
          <TextField
            tall
            label="PhilHealth ID number"
            name="philhealthId"
            inputMode="numeric"
            placeholder="00-000000000-0"
            hint="Synthetic ID. Do not enter a real government identifier."
          />
          <LinkField
            tall
            href="/register/membership-category"
            label="Membership category"
            value={categoryLabel}
            hint="See category descriptions."
          />
          <TextField
            tall
            label="Contact number"
            type="tel"
            name="contact"
            autoComplete="tel"
            placeholder="+63 9XX XXX XXXX"
            hint="Demo contact number."
            className="md:col-span-2"
          />
        </div>
      </fieldset>

      <fieldset className="w-full">
        <legend className="mb-5 block text-base font-bold text-primary">Registered address</legend>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-6">
          <TextField
            tall
            label="House number / street"
            name="street"
            autoComplete="address-line1"
            defaultValue="123 Sample Street"
            className="md:col-span-2"
          />
          <TextField tall label="Barangay" name="barangay" autoComplete="address-line2" defaultValue="Barangay Demo" />
          <TextField tall label="City / municipality" name="city" autoComplete="address-level2" defaultValue="Quezon City" />
          <TextField tall label="Province / region" name="province" autoComplete="address-level1" defaultValue="Metro Manila" />
          <TextField tall label="Postal code" name="postalCode" autoComplete="postal-code" inputMode="numeric" defaultValue="1100" />
        </div>
      </fieldset>

      <div className="flex w-full flex-col gap-5">
        <Button type="submit">Continue to dependents</Button>
      </div>
    </form>
  );
}
