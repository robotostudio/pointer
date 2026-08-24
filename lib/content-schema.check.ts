/** Run with: pnpm dlx tsx lib/content-schema.check.ts */

import assert from "node:assert/strict";
import path from "node:path";
import { isValidCategory } from "./blog-categories";
import { getMDXFiles, readMDXFile } from "./content-parser";
import {
  blogSchema,
  ContentValidationError,
  pageSchema,
  parseFrontmatter,
} from "./content-schema";

const validPage = {
  description: "x".repeat(120),
  layout: "default",
  showTitle: false,
  title: "Pricing",
};

// page-templates hides only on an explicit false.
assert.equal(
  parseFrontmatter(
    pageSchema,
    { description: "x".repeat(120), title: "Pricing" },
    "t.mdx"
  ).showTitle,
  true
);

assert.throws(
  () => parseFrontmatter(pageSchema, { ...validPage, draft: true }, "t.mdx"),
  ContentValidationError,
  "draft must be rejected until it is implemented"
);

assert.throws(
  () => parseFrontmatter(pageSchema, { ...validPage, title: 2026 }, "t.mdx"),
  /`title` must be a string/,
  "type mismatches must not claim the field is missing"
);

const validPost = {
  author: "Pointer Team",
  category: "news",
  publishedAt: "2026-01-30",
  summary: "y".repeat(120),
  title: "A post",
};

assert.equal(parseFrontmatter(pageSchema, validPage, "t.mdx").showTitle, false);

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
