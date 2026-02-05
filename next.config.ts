import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000, // 1 year cache
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tnxdfwwsvqp8lylo.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
