import type { ReactNode } from "react";
import { requirePatient } from "@/lib/auth";

export default async function ActivePatientLayout({ children }: { children: ReactNode }) {
  await requirePatient("active");
  return children;
}
