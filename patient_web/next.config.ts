import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: "/patient",
  // Pin the workspace root to THIS app so Next doesn't walk up to the
  // parent repo (which has its own lockfile and src/).
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
