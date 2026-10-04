import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: "/patient",
  turbopack: {
    // Prevent the parent app's src/proxy.ts from being included when this
    // standalone app is built from a repository containing two lockfiles.
    root: __dirname,
  },
};

export default nextConfig;
