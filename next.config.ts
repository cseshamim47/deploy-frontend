import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "194.31.53.148",
        port: "3001",
        pathname: "/public/**",
      },
    ],
    domains: ["localhost", "194.31.53.148"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
