import type { Metadata } from "next";
import { EditDependentsScreen } from "@/features/registration/EditDependentsScreen";

export const metadata: Metadata = { title: "Your Dependents • TULAY" };

type SearchParams = Promise<{ birth?: string }>;

/** P1 • Edit dependents • Pending (222:5775) */
export default async function PendingDependentsPage({ searchParams }: { searchParams: SearchParams }) {
  const { birth } = await searchParams;
  return <EditDependentsScreen state="pending" birth={birth} />;
}
