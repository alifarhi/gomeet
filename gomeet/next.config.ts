import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* existing config options here */

  eslint: {
    // Prevent ESLint errors from failing production builds
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Allow production builds even if there are type errors
    ignoreBuildErrors: false, // you can set to true if you want to ignore TS errors too
  },
};

export default nextConfig;
