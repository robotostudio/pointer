import type { MetadataRoute } from "next";
import { baseUrl } from "@/app/sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    host: baseUrl,
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
