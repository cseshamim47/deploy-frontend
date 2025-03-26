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
};

module.exports = nextConfig;
