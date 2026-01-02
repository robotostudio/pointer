# API Reference

Quick reference for developers working with the MDX CMS.

## Content Service API

### Import

```typescript
import { 
  getPageByPath, 
  getAllPagePaths, 
  getAllPages,
  pageExists 
} from "@/lib/content-service";
```

### Functions

#### `getPageByPath(urlPath: string): PageContent | null`

Get a page by its URL path.

**Parameters**:
- `urlPath` - URL path without leading slash (e.g., `"about"`, `"company/contact"`)

**Returns**:
- `PageContent` object if found
- `null` if not found

**Example**:
```typescript
const page = getPageByPath("about");
if (page) {
  console.log(page.metadata.title);
  console.log(page.content);
  console.log(page.sections); // For multi-section pages
}
```

#### `getAllPagePaths(): string[]`

Get all available page paths for static generation.

**Returns**:
- Array of URL paths

**Example**:
```typescript
const paths = getAllPagePaths();
// ["about", "company/contact", "company/careers"]

// Use in generateStaticParams
export async function generateStaticParams() {
  return getAllPagePaths().map(path => ({
    slug: path.split("/")
  }));
}
```

#### `getAllPages(): Array<{ path: string; metadata: Partial<PageMetadata> }>`

Get all pages with their metadata (useful for navigation, sitemaps).

**Returns**:
- Array of objects with path and metadata

**Example**:
```typescript
const pages = getAllPages();
pages.forEach(({ path, metadata }) => {
  console.log(`${path}: ${metadata.title}`);
});

// Use for navigation
function Nav() {
  const pages = getAllPages();
  return (
    <nav>
      {pages.map(({ path, metadata }) => (
        <Link key={path} href={path}>
          {metadata.title}
        </Link>
      ))}
    </nav>
  );
}
```

#### `pageExists(urlPath: string): boolean`

Check if a page exists.

**Parameters**:
- `urlPath` - URL path to check

**Returns**:
- `true` if page exists
- `false` otherwise

**Example**:
```typescript
if (pageExists("about")) {
  // Page exists
}
```

## Type Definitions

### Import

```typescript
import type {
  PageContent,
  PageMetadata,
  SectionMetadata,
  ContentItem,
  PageLayout,
} from "@/lib/content-types";
```

### Types

#### `PageMetadata`

```typescript
interface PageMetadata extends BaseMetadata {
  layout?: PageLayout;        // Layout template
  showTitle?: boolean;        // Show title in page
  showBreadcrumbs?: boolean;  // Show breadcrumbs
}
```

#### `BaseMetadata`

```typescript
interface BaseMetadata {
  title: string;          // Required: Page title
  description?: string;   // SEO description
  publishedAt?: string;   // Publication date (ISO)
  updatedAt?: string;     // Last update (ISO)
  author?: string;        // Author name
  tags?: string[];        // Tags array
  image?: string;         // OG image URL
}
```

#### `PageContent`

```typescript
interface PageContent extends ContentItem<PageMetadata> {
  type: "page";
  sections?: ContentItem<SectionMetadata>[];
}
```

#### `SectionMetadata`

```typescript
interface SectionMetadata extends BaseMetadata {
  section: string;  // Unique section identifier
  order: number;    // Display order
}
```

#### `PageLayout`

```typescript
type PageLayout = 
  | "default"        // Standard layout
  | "multi-section"  // Multiple sections
  | "full-width"     // Full viewport
  | "centered";      // Narrow, centered
```

## Template Components

### Import

```typescript
import { 
  PageTemplate,
  DefaultPageTemplate,
  MultiSectionPageTemplate,
  FullWidthPageTemplate,
  CenteredPageTemplate,
} from "@/components/page-templates";
```

### Components

#### `PageTemplate`

Automatic template selector based on `layout` metadata.

```typescript
function Page() {
  const page = getPageByPath("about");
  return <PageTemplate page={page} />;
}
```

#### `DefaultPageTemplate`

Standard single-column layout (max-width 4xl).

```typescript
<DefaultPageTemplate page={page} />
```

#### `MultiSectionPageTemplate`

Multiple sections with section-specific components.

```typescript
<MultiSectionPageTemplate page={page} />
```

#### `FullWidthPageTemplate`

Full viewport width layout.

```typescript
<FullWidthPageTemplate page={page} />
```

#### `CenteredPageTemplate`

Narrow, centered layout (max-width 2xl).

```typescript
<CenteredPageTemplate page={page} />
```

## Section Components

### Import

```typescript
import {
  ContentSection,
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  ChangelogSection,
} from "@/components/content-section";
```

### Components

All section components accept the same props:

```typescript
interface ContentSectionProps {
  content: string;
  metadata?: {
    title?: string;
    section?: string;
    [key: string]: any;
  };
}
```

#### `ContentSection`

Default section component.

```typescript
<ContentSection content={content} metadata={metadata} />
```

#### `HeroSection`

Hero section with CTAs.

```typescript
<HeroSection content={content} metadata={metadata} />
```

#### `FeaturesSection`

Features showcase section.

```typescript
<FeaturesSection content={content} metadata={metadata} />
```

#### `TestimonialsSection`

Testimonials section with special styling.

```typescript
<TestimonialsSection content={content} metadata={metadata} />
```

#### `ChangelogSection`

Changelog/updates section.

```typescript
<ChangelogSection content={content} metadata={metadata} />
```

## Custom MDX Components

### Import

```typescript
import {
  FeatureCard,
  Button,
  CardGrid,
  Testimonial,
  Callout,
} from "@/components/custom-mdx-components";
```

### Components

#### `FeatureCard`

```typescript
interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
}

// Usage in MDX
<FeatureCard 
  title="Fast" 
  description="Lightning performance"
  icon="⚡"
/>
```

#### `Button`

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
}

// Usage in MDX
<Button variant="primary" href="/signup">
  Get Started
</Button>
```

#### `CardGrid`

```typescript
interface CardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

// Usage in MDX
<CardGrid columns={3}>
  <FeatureCard ... />
  <FeatureCard ... />
  <FeatureCard ... />
</CardGrid>
```

#### `Testimonial`

```typescript
interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

// Usage in MDX
<Testimonial 
  quote="This is amazing!"
  author="John Doe"
  role="CEO"
  company="Acme Inc"
/>
```

#### `Callout`

```typescript
interface CalloutProps {
  children: React.ReactNode;
  type?: "info" | "warning" | "success" | "error";
}

// Usage in MDX
<Callout type="info">
  Important information!
</Callout>
```

## Parser Utilities

### Import

```typescript
import {
  parseFrontmatter,
  getMDXFiles,
  readMDXFile,
  validateMetadata,
  filePathToUrlPath,
  urlPathToFilePath,
} from "@/lib/content-parser";
```

### Functions

#### `parseFrontmatter<T>(fileContent: string)`

Parse frontmatter from MDX content.

```typescript
const { metadata, content } = parseFrontmatter<PageMetadata>(rawContent);
```

#### `getMDXFiles(dir: string): string[]`

Get all MDX files in directory (recursive).

```typescript
const files = getMDXFiles("content/pages");
// ["about.mdx", "company/contact.mdx"]
```

#### `readMDXFile<T>(filePath: string): ContentItem<T>`

Read and parse an MDX file.

```typescript
const page = readMDXFile<PageMetadata>("content/pages/about.mdx");
```

#### `validateMetadata<T>(metadata, requiredFields)`

Validate required metadata fields.

```typescript
validateMetadata(metadata, ["title", "description"]);
// Throws if missing
```

#### `filePathToUrlPath(filePath: string): string`

Convert file path to URL path.

```typescript
filePathToUrlPath("company/contact.mdx");
// "company/contact"
```

#### `urlPathToFilePath(urlPath: string, contentDir: string): string | null`

Convert URL path to file path.

```typescript
urlPathToFilePath("company/contact", "content/pages");
// "content/pages/company/contact.mdx"
```

## Examples

### Creating a Custom Page

```typescript
// app/custom/page.tsx
import { getPageByPath } from "@/lib/content-service";
import { PageTemplate } from "@/components/page-templates";

export default function CustomPage() {
  const page = getPageByPath("custom");
  
  if (!page) {
    return <div>Page not found</div>;
  }
  
  return <PageTemplate page={page} />;
}
```

### Building a Navigation Menu

```typescript
// components/nav.tsx
import { getAllPages } from "@/lib/content-service";
import Link from "next/link";

export function Nav() {
  const pages = getAllPages();
  
  return (
    <nav>
      {pages.map(({ path, metadata }) => (
        <Link key={path} href={path}>
          {metadata.title}
        </Link>
      ))}
    </nav>
  );
}
```

### Generating a Sitemap

```typescript
// app/sitemap.ts
import { getAllPages } from "@/lib/content-service";

export default function sitemap() {
  const pages = getAllPages();
  
  return pages.map(({ path, metadata }) => ({
    url: `https://example.com${path}`,
    lastModified: metadata.updatedAt || metadata.publishedAt,
  }));
}
```

### Custom Template

```typescript
// components/custom-template.tsx
import { CustomMDX } from "./mdx";
import type { PageContent } from "@/lib/content-types";

export function CustomTemplate({ page }: { page: PageContent }) {
  return (
    <div className="custom-layout">
      <header>
        <h1>{page.metadata.title}</h1>
      </header>
      <main>
        <CustomMDX source={page.content} />
      </main>
    </div>
  );
}
```

### Type-Safe Page Component

```typescript
import type { PageContent, PageMetadata } from "@/lib/content-types";

interface MyPageProps {
  page: PageContent;
}

function MyPage({ page }: MyPageProps) {
  const { metadata, content, sections } = page;
  
  // TypeScript knows the exact types
  const title: string = metadata.title;
  const layout: PageLayout | undefined = metadata.layout;
  
  return (
    <div>
      <h1>{title}</h1>
      {/* ... */}
    </div>
  );
}
```

## Environment Variables

None required. All configuration is in code.

## Performance Tips

1. **Static Generation**: Use `getAllPagePaths()` in `generateStaticParams()`
2. **Caching**: ContentService singleton provides automatic caching
3. **Code Splitting**: Dynamic imports for large components
4. **Image Optimization**: Use Next.js Image component

## Debugging

### Enable Verbose Logging

```typescript
// In development only
if (process.env.NODE_ENV === "development") {
  console.log("All pages:", getAllPages());
  console.log("All paths:", getAllPagePaths());
}
```

### Check Page Exists

```typescript
const path = "about";
if (!pageExists(path)) {
  console.error(`Page not found: ${path}`);
}
```

### Validate Content

```typescript
const page = getPageByPath("about");
if (!page) {
  throw new Error("Page not found");
}

if (!page.metadata.title) {
  throw new Error("Missing title");
}
```

## Version

API Version: 2.0  
Last Updated: January 2026
