import type { Metadata } from "next";
import { SettingsScreen } from "@/features/auth/SettingsScreen";

export const metadata: Metadata = { title: "Settings • TULAY" };

/** TULAY / Settings • Pending account (222:5489) */
export default function PendingSettingsPage() {
  return <SettingsScreen state="pending" />;
}
