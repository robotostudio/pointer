import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stops `next dev` rewriting a rules block into the tracked CLAUDE.md.
  agentRules: false,
  cacheComponents: true,
  images: {
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560, 3840],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000, // 1 year cache
    remotePatterns: [
      {
        hostname: "tnxdfwwsvqp8lylo.public.blob.vercel-storage.com",
        protocol: "https",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
