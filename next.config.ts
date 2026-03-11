import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["hypercorrect-ying-aplastic.ngrok-free.dev"],
   experimental: {
    proxyClientMaxBodySize: '70mb',
     serverActions: {
      bodySizeLimit: '70mb',
    },
  },
};

export default nextConfig;
