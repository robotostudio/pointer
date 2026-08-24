export const BLOG_CATEGORIES = [
  "product",
  "research",
  "company",
  "news",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  company: "Company",
  news: "News",
  product: "Product",
  research: "Research",
};

export function isValidCategory(
  value: string | undefined
): value is BlogCategory {
  return value !== undefined && BLOG_CATEGORIES.includes(value as BlogCategory);
}
