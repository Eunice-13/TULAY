import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TULAY (YAKAP-GAMOT)",
  description:
    "Bridging beneficiaries to covered medicines — register, get activated, find covered medicines, and locate a pharmacy with live stock.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-tulay focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-surface"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
