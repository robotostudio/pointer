import fs from "node:fs";
import path from "node:path";

export interface BlogPostMetadata {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
}

export interface BlogPost {
  metadata: BlogPostMetadata;
  slug: string;
  content: string;
}

function parseFrontmatter(fileContent: string): {
  metadata: BlogPostMetadata;
  content: string;
} {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match) {
    return {
      metadata: { title: "", publishedAt: "", summary: "" },
      content: fileContent.trim(),
    };
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<BlogPostMetadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    if (!key) return;

    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");
    metadata[key.trim() as keyof BlogPostMetadata] = value;
  });

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
