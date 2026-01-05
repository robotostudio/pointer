# MDX CMS

Simple, clean, agent-friendly content management with Next.js and MDX.

> **Philosophy**: "The cost of abstractions with AI is very high. Content is just code."  
> — [Lee Robinson](https://leerob.com/agents)

## Features

- ✅ One MDX file per page
- ✅ Custom React components in Markdown
- ✅ No CMS, no database, no API calls
- ✅ Everything in git, AI agent-friendly
- ✅ Full TypeScript, type-safe
- ✅ Fast static generation

## Quick Start

```bash
pnpm install && pnpm dev
open http://localhost:3000
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
---

# Pricing

<CardGrid columns={3}>
  <FeatureCard title="Free" description="For individuals" icon="🎯" />
  <FeatureCard title="Pro" description="For teams" icon="⚡" />
  <FeatureCard title="Enterprise" description="For orgs" icon="🏢" />
</CardGrid>

<Button variant="primary" href="/signup">Get Started</Button>
```

**3. Done!** Visit `/pricing`

## Create a Blog Post

```bash
touch app/blog/posts/my-post.mdx
```

```mdx
---
title: My Post
publishedAt: 2026-01-02
summary: Brief description
---

# Content here

<Callout type="info">
Use components in blog posts too!
</Callout>
```

Visit: `/blog/my-post`

## Components

**FeatureCard** · **CardGrid** · **Button** · **Callout** · **Testimonial**

See [`DOCS.md`](./DOCS.md) for details.

## Structure

```
content/pages/     # Pages (/) 
app/blog/posts/    # Blog (/blog/slug)
app/lib/           # Content utilities
app/components/    # React components
```

## Why This Design?

Based on [leerob.com/agents](https://leerob.com/agents):

- **No CMS**: No $56k/mo CDN bills, no API overhead
- **Agent-friendly**: AI can grep, read, edit directly
- **Git-based**: Full history, easy rollbacks, PR previews
- **Simple**: One file per page, no over-abstraction
- **Fast**: Static generation, no network I/O

## Deploy

```bash
pnpm build
```

Deploy to Vercel, Netlify, or any static host.

## Documentation

See [`DOCS.md`](./DOCS.md) for complete documentation.

---

**Simple. Clean. Agent-ready.**
