import "server-only";

import fs from "node:fs";
import path from "node:path";
import {
  type BlogCategory,
  type BlogPost,
  type BlogPostMetadata,
  CATEGORY_LABELS,
  isValidCategory,
} from "@/app/blog/types";

const FRONTMATTER_REGEX = /---\s*([\s\S]*?)\s*---/;
const QUOTE_REGEX = /^['"](.*)['"]$/;

function parseFrontmatter(fileContent: string): {
  metadata: BlogPostMetadata;
  content: string;
} {
  const match = FRONTMATTER_REGEX.exec(fileContent);

  if (!match) {
    return {
      metadata: { title: "", publishedAt: "", summary: "" },
      content: fileContent.trim(),
    };
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(FRONTMATTER_REGEX, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<BlogPostMetadata> = {};

  for (const line of frontMatterLines) {
    const [key, ...valueArr] = line.split(": ");
    if (!key) {
      continue;
    }

    const trimmedKey = key.trim();
    let value = valueArr.join(": ").trim();
    value = value.replace(QUOTE_REGEX, "$1");

    if (trimmedKey === "category") {
      if (isValidCategory(value)) {
        metadata.category = value;
      }
    } else {
      metadata[trimmedKey as Exclude<keyof BlogPostMetadata, "category">] =
        value;
    }
  }

  return { metadata: metadata as BlogPostMetadata, content };
}

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string): {
  metadata: BlogPostMetadata;
  content: string;
} {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string): BlogPost[] {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts(): BlogPost[] {
  const posts = getMDXData(path.join(process.cwd(), "app", "blog", "posts"));

  return posts.sort((a, b) => {
    const dateA = new Date(a.metadata.publishedAt);
    const dateB = new Date(b.metadata.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getBlogCategories(): {
  id: BlogCategory;
  label: string;
  count: number;
}[] {
  const posts = getBlogPosts();
  const categoryCounts = new Map<BlogCategory, number>();

  for (const post of posts) {
    if (post.metadata.category) {
      const count = categoryCounts.get(post.metadata.category) || 0;
      categoryCounts.set(post.metadata.category, count + 1);
    }
  }

  return Array.from(categoryCounts.entries()).map(([id, count]) => ({
    id,
    label: CATEGORY_LABELS[id],
    count,
  }));
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return getBlogPosts().filter((post) => post.metadata.category === category);
}
