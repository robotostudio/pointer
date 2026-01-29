# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MDX CMS - A Next.js 16 portfolio/content platform using file-based MDX content management. Philosophy: "Content is just code" - no CMS, no database, everything in git for AI agent-friendly editing.

## Commands

```bash
pnpm install    # Install dependencies
pnpm dev        # Development server at localhost:3000
pnpm build      # Production build
pnpm start      # Start production server
```

> **IMPORTANT**: Never run `pnpm dev` or `pnpm build` commands unless explicitly asked by the user.

## Architecture

### Content System

Two content types with separate locations:
- **Pages**: `content/pages/*.mdx` → Routes to `/*` (e.g., `about.mdx` → `/about`)
- **Blog Posts**: `app/blog/posts/*.mdx` → Routes to `/blog/*`

Nested pages supported: `content/pages/company/about.mdx` → `/company/about`

Home page is special: `content/pages/home.mdx` → `/`

### Content Service (`app/lib/content-service.ts`)

Singleton service handles all content loading with caching (production only):
- `getPageByPath(urlPath)` - Load page by URL path
- `getAllPagePaths()` - Get all page routes for static generation
- `pageExists(urlPath)` - Check if page exists

Security: Path traversal protection, whitelist validation, directory containment checks.

### MDX Frontmatter

**Pages:**
```yaml
title: Page Title
description: SEO description
layout: default | full-width | centered  # optional
showTitle: true | false                   # optional
```

**Blog Posts:**
```yaml
title: Post Title
publishedAt: 2026-01-02
summary: Brief description for listing
```

### Available MDX Components

> **IMPORTANT**: When creating or modifying MDX components, always update this section with the component's props and usage examples. This serves as the source of truth for AI agents and developers editing MDX files.

Components are registered in `app/components/mdx.tsx` and can be used directly in MDX files:

#### Hero

```jsx
<Hero variant="default" />
<Hero variant="centered" />
<Hero variant="full-width" />
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `"default" \| "centered" \| "full-width"` | Yes | Layout variant |

### Key Files

- `app/[...slug]/page.tsx` - Catch-all dynamic routing for pages
- `app/blog/[slug]/page.tsx` - Blog post routing
- `app/lib/content-service.ts` - Content loading with caching
- `app/lib/content-parser.ts` - MDX parsing utilities
- `app/lib/content-types.ts` - TypeScript interfaces
- `app/components/mdx.tsx` - MDX renderer with component registration
- `app/components/custom-mdx-components.tsx` - Reusable MDX components

### Static Generation

All pages pre-rendered at build time via `generateStaticParams()` in route files. SEO handled with `generateMetadata()` per page.

## Code Style

### Comments

Never add unnecessary comments to the codebase. Code should be self-documenting. Only add comments when explaining complex business logic that isn't obvious from the code itself.

### Tailwind CSS

Use `size-*` utility when height and width are the same value:

```tsx
// ✅ Good
<div className="size-4" />

// ❌ Bad
<div className="h-4 w-4" />
```

### Imports

Always use absolute import path aliases when importing components or modules. Never use relative paths like `../` or `./`.

```typescript
// ✅ Good - absolute imports
import { Button } from "@/app/components/button"
import { ContentService } from "@/app/lib/content-service"

// ❌ Bad - relative imports
import { Button } from "../components/button"
import { ContentService } from "./content-service"
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strictNullChecks enabled)
- Tailwind CSS 4
- next-mdx-remote for MDX rendering
- sugar-high for syntax highlighting
- Vercel Analytics/Speed Insights
- **pnpm** - Always use `pnpm` instead of `npm` for all commands

## Git Conventions

### Commit Messages

Use semantic prefixes, short and concise. Wrap code/component names in backticks.

```
feat: add `Button` component
fix: resolve `ContentService` caching issue
chore: update dependencies
docs: add API documentation
refactor: simplify `getPageByPath` logic
test: add tests for `MDX` parser
```

### Branch Names

Use semantic prefixes with kebab-case:

```
feat/add-button-component
fix/content-service-cache
chore/update-dependencies
docs/api-documentation
```

### PR Titles

Same as commit messages - semantic prefix, concise, backticks for code:

```
feat: add `CardGrid` component
fix: handle null in `getPageByPath`
```

### PR Descriptions

Keep descriptions concise with a summary section only. **NEVER include a "Test plan" section unless explicitly requested.**

```markdown
## Summary
- Brief bullet points describing the changes
- Focus on what and why
```
