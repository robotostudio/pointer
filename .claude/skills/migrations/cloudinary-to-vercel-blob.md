# Cloudinary to Vercel Blob Migration Guide

A step-by-step guide for migrating images from Cloudinary (or any CDN) to Vercel Blob storage.

---

## Overview

This migration moves all remote images from Cloudinary to Vercel Blob storage for:
- Simplified infrastructure (one provider)
- Better integration with Vercel deployments
- Cost optimization
- Consistent URL patterns

---

## Phase 1: Inventory & Discovery

### 1.1 Find All Cloudinary URLs

```bash
# Find all Cloudinary URLs in the codebase
grep -r "res.cloudinary.com" --include="*.tsx" --include="*.mdx" --include="*.ts" --include="*.md"

# Find all Unsplash URLs (if migrating those too)
grep -r "images.unsplash.com" --include="*.tsx" --include="*.mdx" --include="*.ts"

# Count total URLs
grep -r "res.cloudinary.com" --include="*.mdx" | wc -l
```

### 1.2 Extract Unique Image Filenames

Create a list of all unique images to migrate. Cloudinary URLs follow this pattern:
```
https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{filename}
```

Example:
```
https://res.cloudinary.com/daxxuu72a/image/upload/v1770278236/hero-bg_kvjfkg.png
                          ↑ cloud      ↑ version    ↑ filename with public_id
```

---

## Phase 2: Download Images

### 2.1 Create Download Script

Create `scripts/download-images.mjs`:

```javascript
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// All Cloudinary image URLs to download
const cloudinaryImages = [
  "https://res.cloudinary.com/daxxuu72a/image/upload/v1770278236/hero-bg_kvjfkg.png",
  "https://res.cloudinary.com/daxxuu72a/image/upload/v1770278236/feature-1_abc123.png",
  // Add all your Cloudinary URLs here
];

// Unsplash avatar URLs (if migrating those too)
const unsplashImages = [
  {
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    filename: "photo-1494790108377-be9c29b29330_avatar.jpg",
  },
  // Add all avatar URLs with desired filenames
];

const OUTPUT_DIR = "./downloaded-images";

async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    const outputPath = path.join(OUTPUT_DIR, filename);
    await writeFile(outputPath, Buffer.from(buffer));
    console.log(`✓ Downloaded: ${filename}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed: ${filename} - ${error.message}`);
    return false;
  }
}

function extractFilename(url) {
  // Extract filename from Cloudinary URL
  // e.g., "hero-bg_kvjfkg.png" from the full URL
  const parts = url.split("/");
  return parts[parts.length - 1];
}

async function main() {
  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  console.log("Downloading Cloudinary images...\n");

  // Download Cloudinary images
  let success = 0;
  let failed = 0;

  for (const url of cloudinaryImages) {
    const filename = extractFilename(url);
    const result = await downloadImage(url, filename);
    if (result) success++;
    else failed++;
  }

  // Download Unsplash images
  console.log("\nDownloading Unsplash images...\n");

  for (const { url, filename } of unsplashImages) {
    const result = await downloadImage(url, filename);
    if (result) success++;
    else failed++;
  }

  console.log(`\n✓ Downloaded: ${success}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`\nImages saved to: ${OUTPUT_DIR}/`);
}

main();
```

### 2.2 Run Download Script

```bash
node scripts/download-images.mjs
```

### 2.3 Verify Downloads

```bash
ls -la downloaded-images/
```

---

## Phase 3: Upload to Vercel Blob

### 3.1 Via Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Blob**
3. Create a new store (if not exists)
4. Click **Upload** and select all files from `downloaded-images/`

### 3.2 Via Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Upload all images
for file in downloaded-images/*; do
  vercel blob put "$file" --store-name your-store-name
done
```

### 3.3 Get Your Blob Store URL

Your Vercel Blob URL will look like:
```
https://{random-id}.public.blob.vercel-storage.com/
```

Example:
```
https://tnxdfwwsvqp8lylo.public.blob.vercel-storage.com/
```

---

## Phase 4: Update Codebase

### 4.1 Update next.config.ts

Replace Cloudinary remote pattern with Vercel Blob:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tnxdfwwsvqp8lylo.public.blob.vercel-storage.com",
        // Replace with your actual Blob store hostname
      },
    ],
  },
};

export default nextConfig;
```

### 4.2 Update MDX/Content Files

Replace all Cloudinary URLs with Vercel Blob URLs:

**Before:**
```mdx
<HeroMedia
  backgroundSrc="https://res.cloudinary.com/daxxuu72a/image/upload/v1770278236/hero-bg_kvjfkg.png"
  windowSrc="https://res.cloudinary.com/daxxuu72a/image/upload/v1770278236/hero-window_abc123.png"
/>
```

**After:**
```mdx
<HeroMedia
  backgroundSrc="https://tnxdfwwsvqp8lylo.public.blob.vercel-storage.com/hero-bg_kvjfkg.png"
  windowSrc="https://tnxdfwwsvqp8lylo.public.blob.vercel-storage.com/hero-window_abc123.png"
/>
```

### 4.3 Bulk Find & Replace

Use your editor's find/replace or sed:

```bash
# Replace Cloudinary base URL with Vercel Blob
find content/ -name "*.mdx" -exec sed -i '' \
  's|https://res.cloudinary.com/daxxuu72a/image/upload/v[0-9]*/|https://tnxdfwwsvqp8lylo.public.blob.vercel-storage.com/|g' {} \;

# Replace Unsplash URLs (need to match exact URLs to new filenames)
# This is trickier - may need manual replacement or a script
```

### 4.4 Update Avatar/Unsplash URLs

Unsplash URLs need special handling since filenames change:

**Before:**
```mdx
avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
```

**After:**
```mdx
avatar="https://tnxdfwwsvqp8lylo.public.blob.vercel-storage.com/photo-1494790108377-be9c29b29330_avatar.jpg"
```

---

## Phase 5: Verification

### 5.1 Check for Remaining Old URLs

```bash
# Should return no results
grep -r "res.cloudinary.com" --include="*.tsx" --include="*.mdx" --include="*.ts"
grep -r "images.unsplash.com" --include="*.tsx" --include="*.mdx" --include="*.ts"
```

### 5.2 Test Image Loading

```bash
# Start dev server
pnpm dev

# Visit pages with images and check:
# 1. Images load correctly
# 2. No 404 errors in console
# 3. No CORS errors
```

### 5.3 Verify Image Optimization

Open DevTools → Network → filter by "Img":
- Images should be served as AVIF (or WebP fallback)
- Check `content-type` header in response

---

## Phase 6: Cleanup

### 6.1 Remove Downloaded Images Directory

```bash
rm -rf downloaded-images/
```

### 6.2 Remove Download Script (Optional)

```bash
rm scripts/download-images.mjs
```

### 6.3 Update .gitignore

Add if not already present:
```gitignore
downloaded-images/
```

---

## Troubleshooting

### Image Returns 404

1. Verify the filename matches exactly (case-sensitive)
2. Check the file was uploaded to Vercel Blob
3. Verify the hostname in remotePatterns

### CORS Errors

Vercel Blob has permissive CORS by default. If issues persist:
1. Check the image URL is using HTTPS
2. Verify the domain is in remotePatterns

### Images Not Optimized (Serving Original Format)

1. Check `formats` in next.config.ts includes AVIF and WebP
2. Verify the image is served via Next.js Image component
3. Clear `.next` cache and rebuild

### Slow Image Loading

1. Ensure `sizes` attribute is set correctly
2. Add `priority` only to above-fold images
3. Use background colors for CLS prevention (not blur placeholders)

---

## URL Mapping Reference

Keep a reference of old → new URLs:

| Old URL (Cloudinary) | New URL (Vercel Blob) |
|---------------------|----------------------|
| `res.cloudinary.com/.../hero-bg_kvjfkg.png` | `{blob-store}/hero-bg_kvjfkg.png` |
| `images.unsplash.com/photo-149...` | `{blob-store}/photo-149..._avatar.jpg` |

---

## Rollback Plan

If issues arise, you can rollback by:

1. Reverting next.config.ts to include Cloudinary in remotePatterns
2. Reverting MDX files to use Cloudinary URLs
3. Git revert the migration commit

```bash
git revert <migration-commit-hash>
```

---

## Summary Checklist

```
□ Inventory all Cloudinary/external image URLs
□ Create and run download script
□ Verify all images downloaded successfully
□ Upload images to Vercel Blob storage
□ Get Vercel Blob store URL
□ Update next.config.ts remotePatterns
□ Replace all image URLs in codebase
□ Verify no old URLs remain
□ Test image loading in dev
□ Verify AVIF optimization working
□ Clean up downloaded-images directory
□ Commit and deploy
```
