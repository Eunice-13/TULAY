import type { ReactNode } from "react";
import { requirePatient } from "@/lib/auth";

export default async function PendingPatientLayout({ children }: { children: ReactNode }) {
  await requirePatient("pending");
  return children;
}
