# MDX CMS - Simple & Clean

A Next.js template with MDX-based content management. **One file per page, components as blocks.**

## Features

- ✅ **Simple Structure**: One MDX file per page
- ✅ **Nested Routes**: `/about`, `/company/contact`
- ✅ **Custom Components**: Use React components directly in MDX
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **SEO Optimized**: Meta tags, sitemap, RSS
- ✅ **Three Layouts**: Default, centered, full-width

## Quick Start

```bash
# Install
pnpm install

# Run
pnpm dev

# Visit
open http://localhost:3000
```

## Content Structure

```
content/pages/
├── home.mdx              → /
├── about.mdx             → /about
└── company/
    ├── contact.mdx       → /company/contact
    └── careers.mdx       → /company/careers
```

## Create a Page

**1. Create file:**
```bash
touch content/pages/pricing.mdx
```

**2. Add content:**
```mdx
---
title: Pricing
description: Our pricing plans
layout: default
---

# Pricing Plans

Choose the plan that fits your needs.

<CardGrid columns={3}>
  <FeatureCard 
    title="Free" 
    description="For individuals"
    icon="🎯"
  />
  <FeatureCard 
    title="Pro" 
    description="For teams"
    icon="⚡"
  />
  <FeatureCard 
    title="Enterprise" 
    description="For organizations"
    icon="🏢"
  />
</CardGrid>

<Button variant="primary" href="/signup">
  Get Started
</Button>
```

**3. Done!** Visit `/pricing`

## Page Frontmatter

```mdx
---
title: Page Title         # Required
description: SEO text     # Optional
layout: default           # default | centered | full-width
showTitle: true          # Show page title (default: true)
---
```

## Available Components

Use these directly in your MDX:

### Cards & Grid

```mdx
<CardGrid columns={3}>
  <FeatureCard 
    title="Fast" 
    description="Lightning performance"
    icon="⚡"
  />
</CardGrid>
```

### Buttons

```mdx
<Button variant="primary" href="/signup">
  Get Started
</Button>

<Button variant="secondary" href="/docs">
  Learn More
</Button>
```

### Callouts

```mdx
<Callout type="info">
  Important information!
</Callout>

<Callout type="warning">
  Be careful!
</Callout>

<Callout type="success">
  Great job!
</Callout>
```

### Testimonials

```mdx
<Testimonial 
  quote="This product changed everything!"
  author="Jane Doe"
  role="CEO"
  company="Acme Inc"
/>
```

## Layouts

### Default (Standard Width)
```mdx
---
layout: default
---
```
Max-width container, good for most pages.

### Centered (Narrow)
```mdx
---
layout: centered
---
```
Narrow width, perfect for forms and focused content.

### Full Width
```mdx
---
layout: full-width
---
```
Spans entire viewport, great for dashboards.

## Blog

Blog posts work separately in `app/blog/posts/`:

```bash
touch app/blog/posts/my-post.mdx
```

```mdx
---
title: My Post
publishedAt: 2026-01-02
summary: Post description
---

# Content here
```

Visit: `/blog/my-post`

## Project Structure

```
pointer/
├── app/
│   ├── [...slug]/              # Dynamic routes
│   ├── blog/                   # Blog system
│   ├── components/             # React components
│   │   ├── page-templates.tsx  # Page layouts
│   │   └── custom-mdx-components.tsx
│   └── lib/
│       ├── content-service.ts  # Content API
│       ├── content-parser.ts   # MDX parser
│       └── content-types.ts    # TypeScript types
│
└── content/pages/              # All pages here
    ├── home.mdx
    ├── about.mdx
    └── company/
```

## Type-Safe API

```typescript
import { getPageByPath, getAllPages } from "@/lib/content-service";

// Get a page
const page = getPageByPath("about");

// Get all pages (for nav)
const pages = getAllPages();
```

## Why This Approach?

✅ **Simple**: One file = one page  
✅ **Flexible**: Components for rich UI  
✅ **Fast**: Static generation  
✅ **Clean**: No complex abstractions  
✅ **Scalable**: Easy to add pages  

## Examples

See `content/pages/_examples.md` for more examples.

## Documentation

- `docs/CONTENT_GUIDE_V2.md` - Content guide
- `docs/ARCHITECTURE_V2.md` - Technical docs
- `docs/API_REFERENCE.md` - API reference

## Deploy

```bash
pnpm build
```

Deploy to Vercel, Netlify, or any static host.

---

**Simple. Clean. One file per page. Components as blocks.**
