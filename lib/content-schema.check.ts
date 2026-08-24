/** Run with: pnpm dlx tsx lib/content-schema.check.ts */

import assert from "node:assert/strict";
import path from "node:path";
import { getMDXFiles, readMDXFile } from "./content-parser";
import {
  blogSchema,
  ContentValidationError,
  isValidCategory,
  pageSchema,
  parseFrontmatter,
} from "./content-schema";

const validPage = {
  description: "x".repeat(120),
  layout: "default",
  showTitle: false,
  title: "Pricing",
};

const validPost = {
  author: "Pointer Team",
  category: "news",
  publishedAt: "2026-01-30",
  summary: "y".repeat(120),
  title: "A post",
};

assert.equal(parseFrontmatter(pageSchema, validPage, "t.mdx").showTitle, false);
assert.equal(parseFrontmatter(pageSchema, validPage, "t.mdx").draft, false);

// Pages allow short marketing copy; only the 220-char ceiling applies.
assert.equal(
  parseFrontmatter(
    pageSchema,
    { ...validPage, description: "Short but fine" },
    "t.mdx"
  ).description,
  "Short but fine"
);

assert.throws(
  () =>
    parseFrontmatter(
      pageSchema,
      { ...validPage, description: "x".repeat(221) },
      "t.mdx"
    ),
  ContentValidationError,
  "page descriptions over 220 chars must fail"
);

assert.throws(
  () =>
    parseFrontmatter(
      blogSchema,
      { ...validPost, summary: "too short" },
      "t.mdx"
    ),
  ContentValidationError,
  "blog summaries under 80 chars must fail"
);

assert.throws(
  () => parseFrontmatter(pageSchema, { ...validPage, typo: true }, "t.mdx"),
  ContentValidationError,
  "unknown frontmatter keys must fail"
);

const post = parseFrontmatter(blogSchema, validPost, "t.mdx");
assert.ok(post.publishedAt instanceof Date, "publishedAt must coerce to Date");
assert.equal(post.publishedAt.getUTCFullYear(), 2026);

assert.throws(
  () =>
    parseFrontmatter(blogSchema, { ...validPost, category: "nope" }, "t.mdx"),
  ContentValidationError,
  "unknown categories must fail"
);

assert.ok(isValidCategory("news"));
assert.ok(!isValidCategory("nope"));
assert.ok(!isValidCategory(undefined));

// Every real content file must satisfy its schema.
const pagesDir = path.join(process.cwd(), "content", "pages");
const postsDir = path.join(process.cwd(), "app", "blog", "posts");

for (const file of getMDXFiles(pagesDir)) {
  readMDXFile(path.join(pagesDir, file), pageSchema);
}
for (const file of getMDXFiles(postsDir)) {
  readMDXFile(path.join(postsDir, file), blogSchema);
}

console.log("content-schema: all checks passed");
