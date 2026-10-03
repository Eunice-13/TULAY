import type { Metadata } from "next";
import { SettingsScreen } from "@/features/auth/SettingsScreen";

export const metadata: Metadata = { title: "Settings • TULAY" };

/** TULAY / Settings (222:4560) */
export default function SettingsPage() {
  return <SettingsScreen state="active" />;
}
