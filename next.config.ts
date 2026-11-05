import type { NextConfig } from "next";

// Served at anarix.ai/platform: CloudFront routes /platform/* to this Vercel project.
const nextConfig: NextConfig = {
  basePath: "/platform",
  reactStrictMode: true,
  // The bare Vercel URL (no /platform) would otherwise 404. On anarix.ai the
  // root is the services site, so this only matters on the vercel.app domain.
  async redirects() {
    return [{ source: "/", destination: "/platform", basePath: false, permanent: false }];
  },
};

export default nextConfig;
