import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];

    const patientMobileUrl = process.env.PATIENT_MOBILE_DEV_URL ?? "http://localhost:3100";

    return [
      { source: "/patient", destination: `${patientMobileUrl}/patient` },
      { source: "/patient/:path*", destination: `${patientMobileUrl}/patient/:path*` },
    ];
  },
};

export default nextConfig;
