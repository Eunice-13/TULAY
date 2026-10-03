"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { LinkField, TextField } from "@/components/ui/TextField";

/**
 * Edit profile fields (Edit profile 222:4431 / Profile • Pending account 222:5399).
 * Demo only: "Save profile" shows a confirmation and returns to the menu.
 */
export function ProfileForm({ state }: { state: "active" | "pending" }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const menuHref = state === "active" ? "/account" : "/onboarding/menu";
  const dependentsHref = state === "active" ? "/account/dependents" : "/onboarding/dependents";
  const field = { tone: "muted" } as const;
  const spacer = <span aria-hidden="true" className="block h-5" />;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => router.push(menuHref), 600);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-6">
        {(
          [
            ["Last name", "lastName", "Dela Cruz", "family-name"],
            ["First name", "firstName", "Maria", "given-name"],
            ["Middle initial", "middleInitial", "A.", "additional-name"],
            ["Affix", "affix", "None", "honorific-suffix"],
          ] as const
        ).map(([label, name, value, autoComplete]) => (
          <div key={name} className="flex flex-col gap-2">
            <TextField {...field} label={label} name={name} defaultValue={value} autoComplete={autoComplete} />
            {spacer}
          </div>
        ))}
        <LinkField
          {...field}
          href={`/register/birth-date?for=${state === "active" ? "edit-active" : "edit-pending"}`}
          label="Birth date"
          value="June 15, 1985"
          hint={"\u00a0"}
          hintTone="muted"
        />
        <div className="flex flex-col gap-2">
          <TextField {...field} label="Sex" name="sex" defaultValue="Female" />
          {spacer}
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="profile-address" className="text-sm font-semibold text-primary">
            Registered address
          </label>
          <textarea
            id="profile-address"
            name="address"
            rows={2}
            defaultValue={"123 Sample Street, Barangay Demo\nQuezon City, Metro Manila 1100"}
            className="w-full resize-none rounded-lg border border-canvas bg-surface p-3 text-sm text-muted focus:border-teal"
          />
          {spacer}
        </div>
        <LinkField
          {...field}
          href="/register/membership-category"
          label="Membership category"
          value="Direct contributor"
          hint={"\u00a0"}
          hintTone="muted"
        />
        <div className="flex flex-col gap-2">
          <TextField {...field} label="Email address" type="email" name="email" defaultValue="maria.demo@example.com" />
          {spacer}
        </div>
        <div className="flex flex-col gap-2">
          <TextField {...field} label="Mobile number" type="tel" name="mobile" placeholder="+63 9XX XXX XXXX" />
          {spacer}
        </div>
      </div>

      <div className="flex w-full flex-col gap-5 md:flex-row md:gap-4">
        <ButtonLink href={dependentsHref} variant="secondary">
          Edit dependent information
        </ButtonLink>
        <Button type="submit">Save profile</Button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {saved ? "Profile saved (demo)." : ""}
      </p>
    </form>
  );
}
