import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: false, // set to true to also log HMR cache hits
    },
  },
  cacheComponents: true,
};

export default nextConfig;
