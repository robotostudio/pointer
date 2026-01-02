# Migration Guide: V1 to V2

Guide for upgrading from the simple MDX CMS to the nested pages architecture.

## Overview

**V1**: Simple homepage sections in `content/home/`  
**V2**: Full nested page structure with `content/pages/`

## What Changed

### Content Structure

**Before (V1)**:
```
content/
└── home/
    ├── hero.mdx
    ├── features.mdx
    └── testimonials.mdx
```

**After (V2)**:
```
content/
└── pages/
    ├── home.mdx
    ├── home/
    │   ├── hero.mdx
    │   ├── features.mdx
    │   └── testimonials.mdx
    ├── about.mdx
    └── company/
        ├── contact.mdx
        └── careers.mdx
```

### Import Statements

**Before (V1)**:
```typescript
import { getHomeContent } from "./lib/content";
```

**After (V2)**:
```typescript
import { getPageByPath } from "./lib/content-service";
```

### Page Component

**Before (V1)**:
```typescript
// app/page.tsx
export default function Page() {
  const sections = getHomeContent();
  return <main>{sections.map(renderSection)}</main>;
}
```

**After (V2)**:
```typescript
// app/page.tsx
export default function HomePage() {
  const page = getPageByPath("home");
  return <PageTemplate page={page} />;
}
```

## Migration Steps

### Step 1: Backup Your Content

```bash
# Create backup
cp -r content content.backup
```

### Step 2: Update File Structure

```bash
# Create new directory structure
mkdir -p content/pages/home

# Move existing content
mv content/home/* content/pages/home/

# Create main homepage file
cat > content/pages/home.mdx << 'EOF'
---
title: Home
description: Welcome to our site
layout: multi-section
showTitle: false
---
EOF
```

### Step 3: Update Frontmatter

For **multi-section pages**, update the main file:

**Before**:
```mdx
# content/home/hero.mdx
---
section: hero
order: 1
---
```

**After**:
```mdx
# content/pages/home.mdx (main file)
---
title: Home
layout: multi-section
showTitle: false
---

# content/pages/home/hero.mdx (section file - unchanged)
---
section: hero
order: 1
---
```

For **simple pages**, update frontmatter:

**Before**:
```mdx
---
section: about
order: 1
---
```

**After**:
```mdx
---
title: About
description: About our company
layout: default
---
```

### Step 4: Update Import Statements

Find and replace in your codebase:

```bash
# Find old imports
grep -r "from './lib/content'" app/

# Replace with new imports
# OLD: import { getHomeContent } from "./lib/content"
# NEW: import { getPageByPath } from "./lib/content-service"
```

### Step 5: Update Components

If you have custom components using the old API:

**Before**:
```typescript
const sections = getHomeContent();
sections.map((section) => /* render */);
```

**After**:
```typescript
const page = getPageByPath("home");
if (page.sections) {
  page.sections.map((section) => /* render */);
}
```

### Step 6: Test

```bash
# Clean build
rm -rf .next

# Build
pnpm build

# Test locally
pnpm dev
```

Visit each page and verify:
- Homepage loads correctly
- All sections appear
- Content renders properly
- Links work

### Step 7: Deploy

```bash
# Deploy to production
git add .
git commit -m "Migrate to V2 architecture"
git push
```

## Detailed Changes

### Type System

**New Types**:
```typescript
// app/lib/content-types.ts
interface PageMetadata {
  title: string;
  description?: string;
  layout?: PageLayout;
  showTitle?: boolean;
}

interface PageContent {
  metadata: PageMetadata;
  content: string;
  sections?: ContentItem<SectionMetadata>[];
}
```

**Usage**:
```typescript
import type { PageContent, PageMetadata } from "./lib/content-types";

function MyComponent({ page }: { page: PageContent }) {
  const { metadata, content, sections } = page;
  // ...
}
```

### Service Layer

**New Service**:
```typescript
// app/lib/content-service.ts
class ContentService {
  getPageByPath(urlPath: string): PageContent | null
  getAllPagePaths(): string[]
  getAllPages(): Array<{ path: string; metadata }>
}
```

**Usage**:
```typescript
import { getPageByPath, getAllPages } from "./lib/content-service";

// Get single page
const aboutPage = getPageByPath("about");
const contactPage = getPageByPath("company/contact");

// Get all pages
const allPages = getAllPages();
```

### Template System

**New Templates**:
```typescript
// app/components/page-templates.tsx
export function DefaultPageTemplate({ page })
export function MultiSectionPageTemplate({ page })
export function FullWidthPageTemplate({ page })
export function CenteredPageTemplate({ page })
export function PageTemplate({ page }) // Router
```

**Usage**:
```typescript
import { PageTemplate } from "./components/page-templates";

export default function Page() {
  const page = getPageByPath("about");
  return <PageTemplate page={page} />;
}
```

### Routing

**New Routes**:
```
app/
├── [...slug]/              # NEW: Handles all dynamic pages
│   └── page.tsx
├── page.tsx               # Homepage
└── blog/                  # Blog (unchanged)
```

**Dynamic Route Handler**:
```typescript
// app/[...slug]/page.tsx
export default function Page({ params }: { params: { slug: string[] } }) {
  const urlPath = params.slug.join("/");
  const page = getPageByPath(urlPath);
  return <PageTemplate page={page} />;
}
```

## Breaking Changes

### 1. Content Directory Structure

**Impact**: Content files moved from `content/home/` to `content/pages/`

**Action Required**: Move files as shown in Step 2

### 2. Import Paths

**Impact**: Import from `content-service` instead of `content`

**Action Required**: Update imports as shown in Step 4

### 3. Frontmatter Schema

**Impact**: Different required fields for pages vs sections

**Action Required**: Update frontmatter as shown in Step 3

### 4. Component Props

**Impact**: Components now receive `PageContent` instead of sections array

**Action Required**: Update component interfaces

## Backward Compatibility

### Blog System

✅ **No Changes Required**

The blog system (`app/blog/`) continues to work exactly as before.

### Legacy Content API

✅ **Still Available**

The old `content.ts` API is still available but deprecated:

```typescript
// Still works, but deprecated
import { getHomeContent } from "./lib/content";

const sections = getHomeContent(); // ✅ Works
```

## Common Issues

### Issue 1: Page Not Found

**Symptom**: 404 error after migration

**Solution**:
1. Check file path: `content/pages/your-page.mdx`
2. Verify frontmatter has `title` field
3. Restart dev server

### Issue 2: Sections Not Showing

**Symptom**: Multi-section page shows no sections

**Solution**:
1. Create main file: `content/pages/home.mdx`
2. Set `layout: multi-section`
3. Ensure sections in `content/pages/home/` directory

### Issue 3: Import Errors

**Symptom**: TypeScript errors on imports

**Solution**:
```typescript
// Update import path
import { getPageByPath } from "@/lib/content-service";

// Or relative path
import { getPageByPath } from "../lib/content-service";
```

### Issue 4: Type Errors

**Symptom**: TypeScript type mismatch

**Solution**:
```typescript
// Import types
import type { PageContent } from "@/lib/content-types";

// Use correct type
function MyComponent({ page }: { page: PageContent }) {
  // ...
}
```

## Rollback Plan

If you need to rollback:

```bash
# Restore backup
rm -rf content
mv content.backup content

# Revert code changes
git reset --hard HEAD~1

# Clean build
rm -rf .next
pnpm dev
```

## Getting Help

- Check [ARCHITECTURE_V2.md](./ARCHITECTURE_V2.md) for technical details
- Read [CONTENT_GUIDE_V2.md](./CONTENT_GUIDE_V2.md) for content management
- Review example pages in `content/pages/`
- Check linter errors: `pnpm tsc`

## Checklist

- [ ] Backup content directory
- [ ] Create new directory structure
- [ ] Move content files
- [ ] Update frontmatter
- [ ] Update imports
- [ ] Test homepage
- [ ] Test all pages
- [ ] Test blog (should still work)
- [ ] Run build: `pnpm build`
- [ ] Deploy to production

---

**Migration Time**: ~15-30 minutes for most projects  
**Difficulty**: Moderate  
**Impact**: Better structure, more features, cleaner code
