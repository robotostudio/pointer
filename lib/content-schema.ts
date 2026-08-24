import { z } from "zod";
import { BLOG_CATEGORIES } from "./blog-categories";

const dateMessage = (field: string) =>
  `\`${field}\` must be a valid ISO date, e.g. 2026-05-12.`;

const typeError = (field: string) => ({
  error: (issue: { input: unknown }) =>
    issue.input === undefined
      ? `\`${field}\` is required.`
      : `\`${field}\` must be a string.`,
});

const requiredString = (field: string) =>
  z
    .string(typeError(field))
    .min(1, { message: `\`${field}\` must not be empty.` });

// Meta descriptions under ~80 chars get rewritten by search engines. Aim 120-160.
const MAX_DESCRIPTION_LENGTH = 220;

const seoDescription = (field: string) =>
  z
    .string(typeError(field))
    .min(80, {
      message: `\`${field}\` should be at least 80 characters (aim for 120-160). It's used as the meta description and social preview, so write something with substance.`,
    })
    .max(MAX_DESCRIPTION_LENGTH, {
      message: `\`${field}\` should be under ${MAX_DESCRIPTION_LENGTH} characters — search engines truncate longer ones.`,
    });

export const pageSchema = z
  .object({
    author: z.string().optional(),
    // Existing page copy runs under the 80-char floor, so only the ceiling
    // applies here. Blog summaries still get the full seoDescription check.
    description: requiredString("description").max(MAX_DESCRIPTION_LENGTH, {
      message: `\`description\` should be under ${MAX_DESCRIPTION_LENGTH} characters — search engines truncate longer ones.`,
    }),
    image: z.string().optional(),
    layout: z.string().default("default"),
    publishedAt: z.coerce
      .date({ message: dateMessage("publishedAt") })
      .optional(),
    // page-templates hides only on an explicit false, so defaulting to false
    // would silently drop the h1 on any page omitting the field.
    showTitle: z.boolean().default(true),
    title: requiredString("title"),
    updatedAt: z.coerce.date({ message: dateMessage("updatedAt") }).optional(),
  })
  .strict();

export const blogSchema = z
  .object({
    author: requiredString("author"),
    category: z.enum(BLOG_CATEGORIES).optional(),
    image: z.string().optional(),
    imageAlt: z.string().default(""),
    publishedAt: z.coerce.date({ message: dateMessage("publishedAt") }),
    summary: seoDescription("summary"),
    title: requiredString("title"),
    updatedAt: z.coerce.date({ message: dateMessage("updatedAt") }).optional(),
  })
  .strict();

export type PageMetadata = z.infer<typeof pageSchema>;
export type BlogPostMetadata = z.infer<typeof blogSchema>;

export interface ContentItem<T> {
  content: string;
  metadata: T;
  path?: string;
  slug: string;
}

export type PageContent = ContentItem<PageMetadata> & { type: "page" };
export type BlogPost = ContentItem<BlogPostMetadata>;

// Callers that swallow read errors (missing file, bad path) must rethrow this,
// or malformed frontmatter silently 404s instead of failing the build.
export class ContentValidationError extends Error {}

export function parseFrontmatter<T extends z.ZodType>(
  schema: T,
  data: unknown,
  filePath: string
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.message}`)
      .join("\n");
    throw new ContentValidationError(
      `Invalid frontmatter in ${filePath}:\n${issues}`
    );
  }

  return result.data;
}
