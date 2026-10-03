import type { Metadata } from "next";
import { EditDependentsScreen } from "@/features/registration/EditDependentsScreen";

export const metadata: Metadata = { title: "Your Dependents • TULAY" };

type SearchParams = Promise<{ birth?: string }>;

/** P1 • Edit dependents • Active (222:5680) */
export default async function ActiveDependentsPage({ searchParams }: { searchParams: SearchParams }) {
  const { birth } = await searchParams;
  return <EditDependentsScreen state="active" birth={birth} />;
}
