import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker production builds
  output: "standalone",
  webpack: (config) => {
    // Required for pdf.js worker
    config.resolve.alias.canvas = false;
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/preview/:id",
        destination: "/api/files/:id",
      },
    ];
  },
};

export default nextConfig;
