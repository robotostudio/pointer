/**
 * Legacy content utilities - kept for backward compatibility
 * 
 * Note: This file is intentionally minimal.
 * - For pages: use content-service.ts
 * - For blog: use app/blog/utils.ts
 */

// Re-export for any legacy code
export { getPageByPath as getHomeContent } from "./content-service";
