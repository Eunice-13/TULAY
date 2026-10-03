import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TULAY (YAKAP-GAMOT)",
  description:
    "Bridging beneficiaries to covered medicines — register, get activated, find covered medicines, and locate a pharmacy with live stock.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
