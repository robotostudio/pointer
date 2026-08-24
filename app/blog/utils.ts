import "server-only";

import path from "node:path";
import { getMDXFiles, readMDXFile } from "@/lib/content-parser";
import {
  type BlogCategory,
  type BlogPost,
  blogSchema,
  CATEGORY_LABELS,
} from "@/lib/content-schema";

const POSTS_DIR = path.join(process.cwd(), "app", "blog", "posts");

export function getBlogPosts(): BlogPost[] {
  const posts = getMDXFiles(POSTS_DIR).map((file) =>
    readMDXFile(path.join(POSTS_DIR, file), blogSchema)
  );

  return posts.sort(
    (a, b) =>
      b.metadata.publishedAt.getTime() - a.metadata.publishedAt.getTime()
  );
}

export function getBlogCategories(): {
  id: BlogCategory;
  label: string;
  count: number;
}[] {
  const categoryCounts = new Map<BlogCategory, number>();

  for (const post of getBlogPosts()) {
    if (post.metadata.category) {
      const count = categoryCounts.get(post.metadata.category) ?? 0;
      categoryCounts.set(post.metadata.category, count + 1);
    }
  }

  return Array.from(categoryCounts.entries()).map(([id, count]) => ({
    count,
    id,
    label: CATEGORY_LABELS[id],
  }));
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return getBlogPosts().filter((post) => post.metadata.category === category);
}
