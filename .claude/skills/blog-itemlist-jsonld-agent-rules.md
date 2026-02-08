# Blog ItemList JSON-LD Agent Rules

Rules for an AI agent to implement automated ItemList JSON-LD structured data on blog index pages.

---

## What This Does

Adds structured data to blog listing pages so search engines understand:
- This is a collection of articles
- The articles belong together
- Their order and hierarchy
- Can enable rich results (carousels) in search

---

## Phase 1: Discovery

Before implementing, identify the project structure.

### Step 1.1: Find the Blog Index Page

```bash
# Next.js App Router
find . -path "*/app/blog/page.tsx" -o -path "*/app/blog/page.jsx" | grep -v node_modules

# Next.js Pages Router
find . -path "*/pages/blog/index.tsx" -o -path "*/pages/blog.tsx" | grep -v node_modules

# Astro
find . -path "*/pages/blog/index.astro" -o -path "*/pages/blog.astro" | grep -v node_modules
```

### Step 1.2: Find How Blog Posts Are Fetched

Look for functions that get all blog posts:

```bash
grep -r "getAllPosts\|getAllBlogPosts\|getPosts\|getCollection" --include="*.ts" --include="*.tsx" | head -10
```

### Step 1.3: Check for Existing JSON-LD Infrastructure

```bash
# Look for existing JSON-LD components
find . -name "*json-ld*" -o -name "*jsonld*" -o -name "*structured*" | grep -v node_modules

# Check for schema-dts package (typed schemas)
grep "schema-dts" package.json
```

---

## Phase 2: Implementation

### Option A: Project Has Existing JSON-LD Components

If the project already has JSON-LD utilities, use them.

**Pattern to look for:**
```typescript
// Existing component like CollectionPageJsonLd or CombinedJsonLd
import { CombinedJsonLd } from "@/components/json-ld";
```

**Implementation:**
```typescript
<CombinedJsonLd
  collectionPage={{
    title: "Blog",
    description: "Articles about web development",
    slug: "/blog",
    items: posts.map((post) => ({
      title: post.title,
      slug: `/blog/${post.slug}`,
    })),
  }}
/>
```

### Option B: Create New JSON-LD Component

If no existing infrastructure, create a new component.

**Step 2.1: Create the Component**

```typescript
// components/json-ld/blog-collection-jsonld.tsx

interface BlogPost {
  title: string;
  slug: string;
}

interface BlogCollectionJsonLdProps {
  title: string;
  description: string;
  url: string;
  posts: BlogPost[];
}

export function BlogCollectionJsonLd({
  title,
  description,
  url,
  posts,
}: BlogCollectionJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description,
    url: url,
    publisher: {
      "@type": "Organization",
      name: "YOUR_SITE_NAME", // Replace with actual site name
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: post.slug,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

**Step 2.2: Add to Blog Index Page**

```typescript
// app/blog/page.tsx (Next.js App Router example)

import { BlogCollectionJsonLd } from "@/components/json-ld/blog-collection-jsonld";

export default async function BlogPage() {
  const posts = await getAllPosts(); // Your data fetching function
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";

  return (
    <main>
      <BlogCollectionJsonLd
        title="Blog"
        description="Articles about web development and design"
        url={`${baseUrl}/blog`}
        posts={posts.map((post) => ({
          title: post.title,
          slug: `${baseUrl}/blog/${post.slug}`,
        }))}
      />

      {/* Rest of your blog listing UI */}
    </main>
  );
}
```

---

## Phase 3: JSON-LD Schema Reference

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `@context` | string | Always `"https://schema.org"` |
| `@type` | string | `"CollectionPage"` for index pages |
| `name` | string | Page title (e.g., "Blog") |
| `url` | string | Full URL of the page |
| `mainEntity.@type` | string | `"ItemList"` |
| `mainEntity.itemListElement` | array | Array of ListItem objects |

### ListItem Fields

| Field | Type | Description |
|-------|------|-------------|
| `@type` | string | Always `"ListItem"` |
| `position` | number | 1-indexed position in list |
| `name` | string | Article title |
| `url` | string | Full URL to article |

### Optional but Recommended

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Page description |
| `numberOfItems` | number | Total count of items |
| `publisher` | Organization | Site/company info |

---

## Phase 4: Example Output

The component should generate JSON-LD like this:

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Blog",
  "description": "Articles about web development and design",
  "url": "https://example.com/blog",
  "publisher": {
    "@type": "Organization",
    "name": "Example Company"
  },
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": 3,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "How to Build a Blog",
        "url": "https://example.com/blog/how-to-build-a-blog"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "SEO Best Practices",
        "url": "https://example.com/blog/seo-best-practices"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Web Performance Tips",
        "url": "https://example.com/blog/web-performance-tips"
      }
    ]
  }
}
```

---

## Phase 5: Validation

### Step 5.1: Check JSON-LD Renders

In browser DevTools console:

```javascript
const scripts = document.querySelectorAll('script[type="application/ld+json"]');
scripts.forEach(s => console.log(JSON.parse(s.textContent)));
```

### Step 5.2: Validate Structure

Use Google's Rich Results Test:
- https://search.google.com/test/rich-results

Or Schema.org Validator:
- https://validator.schema.org/

### Step 5.3: Check for Errors

Common issues:
- Missing `@context`
- URLs not fully qualified (must include `https://`)
- Position not starting at 1
- Empty or null titles

---

## Phase 6: Framework-Specific Notes

### Next.js App Router

```typescript
// Can use in Server Components directly
// No need for "use client"
export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* content */}
    </>
  );
}
```

### Next.js Pages Router

```typescript
import Head from "next/head";

export default function BlogPage() {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      {/* content */}
    </>
  );
}
```

### Astro

```astro
---
const jsonLd = { /* ... */ };
---
<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

### Remix

```typescript
import { json } from "@remix-run/node";

export function meta() {
  return [
    {
      "script:ld+json": jsonLd,
    },
  ];
}
```

---

## Checklist

Before marking complete:

- [ ] JSON-LD component created or existing one identified
- [ ] Component receives array of posts with title and slug
- [ ] Full URLs used (not relative paths)
- [ ] Position starts at 1 and increments
- [ ] Renders in page `<head>` or `<body>`
- [ ] Validated with Rich Results Test
- [ ] No console errors related to JSON-LD

---

## Extending to Other Collections

This same pattern works for:

- **Case Studies:** `@type: "CollectionPage"` with `ItemList`
- **Products:** `@type: "CollectionPage"` or `"ItemList"` directly
- **Services:** `@type: "CollectionPage"` with `ItemList`
- **Team Members:** `@type: "CollectionPage"` with `ItemList` of `Person`

Just change the `name`, `description`, `url`, and item mappings accordingly.
