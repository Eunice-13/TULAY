"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { Button, buttonClasses } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { signInProfessional } from "@/lib/data/mutations";
import type { PortalRole } from "@/lib/preview/types";

const copy: Record<PortalRole, { subtitle: string; idLabel: string; idPlaceholder: string; next: string }> = {
  doctor: {
    subtitle: "Sign in with your assigned doctor credentials.",
    idLabel: "Doctor ID",
    idPlaceholder: "Enter your ID number",
    next: "/doctor/dashboard",
  },
  clinic_staff: {
    subtitle: "Sign in, then select the clinic you work at.",
    idLabel: "Clinic staff ID",
    idPlaceholder: "Enter your clinic staff ID",
    // Workplace is chosen after sign-in from the clinics assigned to the account.
    next: "/login/workplace",
  },
  pharmacy_staff: {
    subtitle: "Sign in with your assigned pharmacy staff credentials.",
    idLabel: "Pharmacy staff ID",
    idPlaceholder: "Enter your ID number",
    next: "/pharmacy/dashboard",
  },
};

type Errors = Partial<Record<"email" | "password", string>>;

/**
 * PREVIEW sign-in. Fields follow the Figma design. Credentials are only checked
 * for presence and are never sent anywhere; the backend team will connect this
 * to Supabase Auth and route by the trusted server-side role.
 */
export function SignInForm({ role }: { role: PortalRole }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const text = copy[role];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input = {
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    };
    const next: Errors = {};
    if (!input.email.includes("@")) next.email = "Enter your assigned email.";
    if (!input.password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    startTransition(async () => {
      const result = await signInProfessional(role, input);
      if (result.data) {
        router.push(result.data.next); // Destination comes from the trusted server role.
      } else {
        setFormError(result.error?.message ?? "Unable to sign in.");
      }
    });
  }

  return (
    <>
    <h1 className="mt-6 text-[28px] leading-9 font-medium">Welcome back</h1>
    <p className="mt-2 text-sm text-secondary-500">{text.subtitle}</p>
    <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-5">
      <TextField
        id="email"
        name="email"
        type="email"
        label="Assigned email"
        placeholder="name@facility.example"
        autoComplete="username"
        error={errors.email}
      />
      <TextField
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password}
      />
      {formError ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {formError}
        </p>
      ) : null}
      <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-sm text-secondary-500">Need access? Contact your facility administrator.</p>
      <p>
        <Link href="/login" className={buttonClasses("ghost", "sm", "-ml-3")}>
          <span aria-hidden="true">←</span> Change role
        </Link>
      </p>
      <p className="sr-only" aria-live="polite">
        {Object.keys(errors).length > 0 ? "Please correct the highlighted fields." : ""}
      </p>
    </form>
    </>
  );
}
