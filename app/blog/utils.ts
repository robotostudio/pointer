import fs from "node:fs";
import path from "node:path";

export type BlogCategory = "product" | "research" | "company" | "news";

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  product: "Product",
  research: "Research",
  company: "Company",
  news: "News",
};

export interface BlogPostMetadata {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  category?: BlogCategory;
}

export interface BlogPost {
  metadata: BlogPostMetadata;
  slug: string;
  content: string;
}

const FRONTMATTER_REGEX = /---\s*([\s\S]*?)\s*---/;
const QUOTE_REGEX = /^['"](.*)['"]$/;
const VALID_CATEGORIES: BlogCategory[] = [
  "product",
  "research",
  "company",
  "news",
];

function isValidCategory(value: string): value is BlogCategory {
  return VALID_CATEGORIES.includes(value as BlogCategory);
}

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

/**
 * Get all blog posts
 * @returns Array of blog posts sorted by date (newest first)
 */
export function getBlogPosts(): BlogPost[] {
  const posts = getMDXData(path.join(process.cwd(), "app", "blog", "posts"));

  // Sort by date, newest first
  return posts.sort((a, b) => {
    const dateA = new Date(a.metadata.publishedAt);
    const dateB = new Date(b.metadata.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get all categories that have at least one post
 * @returns Array of categories with their labels and post counts
 */
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

/**
 * Get blog posts filtered by category
 * @param category - The category to filter by
 * @returns Array of blog posts in the specified category
 */
export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return getBlogPosts().filter((post) => post.metadata.category === category);
}

/**
 * Format date for display
 * @param date - Date string in YYYY-MM-DD format
 * @param includeRelative - Whether to include relative time (e.g., "2y ago")
 * @returns Formatted date string
 */
export function formatDate(date: string, includeRelative = false): string {
  const currentDate = new Date();
  let dateString = date;

  if (!dateString.includes("T")) {
    dateString = `${dateString}T00:00:00`;
  }

  const targetDate = new Date(dateString);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
