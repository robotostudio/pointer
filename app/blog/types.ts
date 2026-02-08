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
  imageAlt?: string;
  category?: BlogCategory;
  author?: string;
}

export interface BlogPost {
  metadata: BlogPostMetadata;
  slug: string;
  content: string;
}

export const VALID_CATEGORIES: BlogCategory[] = [
  "product",
  "research",
  "company",
  "news",
];

export function isValidCategory(
  value: string | undefined
): value is BlogCategory {
  if (!value) {
    return false;
  }
  return VALID_CATEGORIES.includes(value as BlogCategory);
}

export function formatDate(date: string, includeRelative = false): string {
  let dateString = date;

  if (!dateString.includes("T")) {
    dateString = `${dateString}T00:00:00`;
  }

  const targetDate = new Date(dateString);

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  const currentDate = new Date();
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

  return `${fullDate} (${formattedDate})`;
}
