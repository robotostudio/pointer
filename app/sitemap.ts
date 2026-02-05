import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/app/blog/utils";
import { getAllPagePaths } from "@/lib/content-service";

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://pointer-roboto.vercel.app";

function getSlugPriority(slug: string): number {
  if (slug.endsWith("/privacy") || slug.endsWith("/terms")) {
    return 0.2;
  }
  return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getBlogPosts();
  const pagePaths = getAllPagePaths();

  const pages: MetadataRoute.Sitemap = pagePaths.map((pagePath) => ({
    url: `${baseUrl}/${pagePath}`,
    lastModified: new Date(),
    priority: getSlugPriority(pagePath),
  }));

  const blogs: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.publishedAt),
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      priority: 0.9,
    },
  ];

  return [...staticRoutes, ...pages, ...blogs];
}
