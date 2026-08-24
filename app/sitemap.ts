import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/app/blog/utils";
import { getBaseUrl } from "@/lib/config";
import { getAllPagePaths } from "@/lib/content-service";

export const baseUrl = getBaseUrl();

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
    lastModified: new Date(),
    priority: getSlugPriority(pagePath),
    url: `${baseUrl}/${pagePath}`,
  }));

  const blogs: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    lastModified: new Date(post.metadata.publishedAt),
    priority: 0.8,
    url: `${baseUrl}/blog/${post.slug}`,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      lastModified: new Date(),
      priority: 1,
      url: baseUrl,
    },
    {
      lastModified: new Date(),
      priority: 0.9,
      url: `${baseUrl}/blog`,
    },
  ];

  return [...staticRoutes, ...pages, ...blogs];
}
