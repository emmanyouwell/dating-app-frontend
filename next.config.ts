import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove console statements in production builds
  // Works with both webpack and Turbopack
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
};

export default nextConfig;
