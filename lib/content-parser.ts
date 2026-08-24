import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import { type ContentItem, parseFrontmatter } from "./content-schema";

const MDX_EXT_REGEX = /\.mdx$/;
const INDEX_SUFFIX_REGEX = /\/index$/;
const BACKSLASH_REGEX = /\\/g;

export function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const subFiles = getMDXFiles(path.join(dir, item.name));
      files.push(...subFiles.map((f) => path.join(item.name, f)));
    } else if (path.extname(item.name) === ".mdx") {
      files.push(item.name);
    }
  }

  return files;
}

/** Throws ContentValidationError when frontmatter fails the schema. */
export function readMDXFile<T extends z.ZodType>(
  filePath: string,
  schema: T
): ContentItem<z.infer<T>> {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  return {
    content: content.trim(),
    metadata: parseFrontmatter(schema, data, filePath),
    slug: path.basename(filePath, path.extname(filePath)),
  };
}

export function filePathToUrlPath(filePath: string): string {
  return filePath
    .replace(MDX_EXT_REGEX, "")
    .replace(INDEX_SUFFIX_REGEX, "")
    .replace(BACKSLASH_REGEX, "/");
}
