import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // CRITICAL: Transpile workspace packages for proper resolution
  transpilePackages: ["@sigil/core"],

  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Ensure server-side packages work correctly in API routes
  serverExternalPackages: ["adm-zip"],
};

export default nextConfig;
