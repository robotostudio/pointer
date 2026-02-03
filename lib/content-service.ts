import path from "node:path";
import {
  filePathToUrlPath,
  getMDXFiles,
  readMDXFile,
  urlPathToFilePath,
} from "./content-parser";
import type { PageContent, PageMetadata } from "./content-types";

const CONTENT_DIR = path.join(process.cwd(), "content", "pages");

/**
 * Content Service - Handles all content operations with robust error handling
 * and input validation
 */
export class ContentService {
  private readonly contentDir: string;
  private readonly pageCache: Map<string, PageContent>;
  private pathsCache: string[] | null;

  constructor(contentDir: string = CONTENT_DIR) {
    this.contentDir = path.resolve(contentDir);
    this.pageCache = new Map();
    this.pathsCache = null;
  }

  /**
   * Normalizes URL path by removing leading/trailing slashes and resolving relative paths
   * @param urlPath - Raw URL path
   * @returns Normalized path
   */
  private normalizePath(urlPath: string): string {
    if (!urlPath) return "";

    // Remove leading and trailing slashes
    let normalized = urlPath.replaceAll(/^\/+/g, "").replaceAll(/\/+$/g, "");

    // Remove any path traversal attempts
    normalized = normalized.replaceAll("../", "").replaceAll(/\.\.$/g, "");

    // Normalize multiple slashes to single slash
    normalized = normalized.replaceAll(/\/+/g, "/");

    return normalized;
  }

  /**
   * Validates URL path for security and correctness
   * @param urlPath - URL path to validate
   * @returns True if valid
   */
  private isValidPath(urlPath: string): boolean {
    if (!urlPath || typeof urlPath !== "string") return false;

    // Check for path traversal attempts
    if (urlPath.includes("..")) return false;

    // Check for invalid characters (no control characters or special chars)
    // eslint-disable-next-line no-control-regex
    if (/[<>:"|?*\u0000-\u001F]/.test(urlPath)) return false;

    // Check for absolute paths
    if (path.isAbsolute(urlPath)) return false;

    return true;
  }

  /**
   * Gets content for a specific page by path with caching
   * @param urlPath - URL path (e.g., "about" or "company/contact")
   * @returns Page content or null
   */
  getPageByPath(urlPath: string): PageContent | null {
    // Handle root path
    if (urlPath === "" || urlPath === "/") {
      urlPath = "home";
    }

    // Normalize and validate input
    const normalizedPath = this.normalizePath(urlPath);

    if (!this.isValidPath(normalizedPath)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Invalid URL path: ${urlPath}`);
      }
      return null;
    }

    // Check cache first (only in production)
    if (
      process.env.NODE_ENV === "production" &&
      this.pageCache.has(normalizedPath)
    ) {
      return this.pageCache.get(normalizedPath)!;
    }

    try {
      const filePath = urlPathToFilePath(normalizedPath, this.contentDir);

      if (!filePath) {
        return null;
      }

      // Verify file is within content directory (security check)
      const resolvedFilePath = path.resolve(filePath);
      if (!resolvedFilePath.startsWith(this.contentDir)) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `Security: Attempted to access file outside content directory: ${filePath}`
          );
        }
        return null;
      }

      const page = readMDXFile<PageMetadata>(filePath);
      const pageContent: PageContent = {
        ...page,
        type: "page",
        path: normalizedPath,
      };

      // Cache the result (only in production)
      if (process.env.NODE_ENV === "production") {
        this.pageCache.set(normalizedPath, pageContent);
      }

      return pageContent;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(`Error loading page "${normalizedPath}":`, error);
      }
      return null;
    }
  }

  /**
   * Gets all available pages with caching
   * @returns Array of all page paths
   */
  getAllPagePaths(): string[] {
    // Return cached result if available (only in production)
    if (process.env.NODE_ENV === "production" && this.pathsCache !== null) {
      return [...this.pathsCache];
    }

    try {
      const files = getMDXFiles(this.contentDir);

      const paths = files
        .filter((file) => {
          // Exclude index files except root index
          if (file === "index.mdx") return true;
          if (file.endsWith("/index.mdx")) return false;
          return true;
        })
        .map((file) => filePathToUrlPath(file))
        .filter((p) => p !== "" && p !== "index");

      // Cache the result (only in production)
      if (process.env.NODE_ENV === "production") {
        this.pathsCache = [...paths];
      }

      return paths;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error getting all page paths:", error);
      }
      return [];
    }
  }

  /**
   * Gets all pages with metadata (for navigation, sitemap, etc.)
   * @returns Array of page metadata with paths
   */
  getAllPages(): Array<{
    path: string;
    metadata: Partial<PageMetadata>;
  }> {
    try {
      const paths = this.getAllPagePaths();

      const pages = paths
        .map(
          (
            urlPath
          ): {
            path: string;
            metadata: Partial<PageMetadata>;
          } | null => {
            try {
              const filePath = urlPathToFilePath(urlPath, this.contentDir);
              if (!filePath) return null;

              const { metadata } = readMDXFile<PageMetadata>(filePath);

              return {
                path: `/${urlPath}`,
                metadata: metadata as Partial<PageMetadata>,
              };
            } catch (error) {
              if (process.env.NODE_ENV === "development") {
                console.error(
                  `Error loading metadata for "${urlPath}":`,
                  error
                );
              }
              return null;
            }
          }
        )
        .filter(
          (
            item
          ): item is {
            path: string;
            metadata: Partial<PageMetadata>;
          } => item !== null
        );

      return pages;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error getting all pages:", error);
      }
      return [];
    }
  }

  /**
   * Checks if a page exists
   * @param urlPath - URL path
   * @returns True if page exists
   */
  pageExists(urlPath: string): boolean {
    try {
      const normalizedPath = this.normalizePath(urlPath);

      if (!this.isValidPath(normalizedPath)) {
        return false;
      }

      return urlPathToFilePath(normalizedPath, this.contentDir) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Clears all caches (useful for development/testing)
   */
  clearCache(): void {
    this.pageCache.clear();
    this.pathsCache = null;
  }

  /**
   * Gets cache statistics (useful for monitoring)
   */
  getCacheStats(): { pagesCached: number; pathsCached: boolean } {
    return {
      pagesCached: this.pageCache.size,
      pathsCached: this.pathsCache !== null,
    };
  }
}

// Export singleton instance
export const contentService = new ContentService();

// Convenience exports
export const getPageByPath = (urlPath: string) =>
  contentService.getPageByPath(urlPath);

export const getAllPagePaths = () => contentService.getAllPagePaths();

export const getAllPages = () => contentService.getAllPages();

export const pageExists = (urlPath: string) =>
  contentService.pageExists(urlPath);
