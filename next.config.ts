import type { NextConfig } from "next";

// Served at anarix.ai/platform: CloudFront routes /platform/* to this Vercel project.
const nextConfig: NextConfig = {
  basePath: "/platform",
  reactStrictMode: true,
};

export default nextConfig;
