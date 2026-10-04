import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PatientLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (typeof userId !== "string") redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", userId)
    .maybeSingle();

  if (!profile || profile.role !== "beneficiary") redirect("/login?error=role");
  if (profile.account_status !== "active") redirect("/onboarding/pending");

  return children;
}
