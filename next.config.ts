import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.144.211.184","168.144.24.145"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "highflyer910.sirv.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {},
};


export default nextConfig;
