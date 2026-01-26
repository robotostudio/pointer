import fs from "node:fs";
import path from "node:path";
import type { BaseMetadata, ContentItem } from "./content-types";

/**
 * Parses frontmatter from MDX content
 * @param fileContent - Raw file content
 * @returns Parsed metadata and content
 */
export function parseFrontmatter<T extends BaseMetadata>(
  fileContent: string
): { metadata: Partial<T>; content: string } {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match) {
    return {
      metadata: {} as Partial<T>,
      content: fileContent.trim(),
    };
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Record<string, any> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    if (!key) return;

    let value: any = valueArr.join(": ").trim();

    // Remove quotes
    value = value.replace(/^['"](.*)['"]$/, "$1");

    // Parse arrays (tags, etc.)
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^['"](.*)['"]$/, "$1"));
    }

    // Convert to number if it's a number
    if (!Number.isNaN(Number(value)) && value !== "" && !Array.isArray(value)) {
      value = Number(value);
    }

    // Convert to boolean
    if (value === "true") value = true;
    if (value === "false") value = false;

    metadata[key.trim()] = value;
  });

  return { metadata: metadata as Partial<T>, content };
}

/**
 * Gets all MDX files from a directory
 * @param dir - Directory path
 * @returns Array of MDX filenames
 */
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

/**
 * Reads and parses a single MDX file
 * @param filePath - Path to MDX file
 * @returns Parsed content item
 */
export function readMDXFile<T extends BaseMetadata>(
  filePath: string
): ContentItem<T> {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { metadata, content } = parseFrontmatter<T>(rawContent);

  const slug = path.basename(filePath, path.extname(filePath));

  return {
    metadata: metadata as T,
    slug,
    content,
  };
}

/**
 * Validates required metadata fields
 * @param metadata - Metadata to validate
 * @param requiredFields - Array of required field names
 * @throws Error if validation fails
 */
export function validateMetadata<T extends BaseMetadata>(
  metadata: Partial<T>,
  requiredFields: (keyof T)[]
): asserts metadata is T {
  const missing = requiredFields.filter((field) => !metadata[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required metadata fields: ${missing.join(", ")}`);
  }
}

/**
 * Converts file path to URL path
 * @param filePath - File path relative to content directory
 * @returns URL path
 */
export function filePathToUrlPath(filePath: string): string {
  return filePath
    .replace(/\.mdx$/, "")
    .replace(/\/index$/, "")
    .replace(/\\/g, "/");
}

/**
 * Converts URL path to file path
 * @param urlPath - URL path
 * @param contentDir - Content directory
 * @returns File path
 */
export function urlPathToFilePath(
  urlPath: string,
  contentDir: string
): string | null {
  const normalizedPath = urlPath.replace(/^\//, "").replace(/\/$/, "");

  const possiblePaths = [
    path.join(contentDir, `${normalizedPath}.mdx`),
    path.join(contentDir, normalizedPath, "index.mdx"),
    path.join(contentDir, `${normalizedPath}/index.mdx`),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}
