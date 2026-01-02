# Blog System

Simple MDX-based blog system.

## Structure

```
app/blog/
├── posts/           # Blog post MDX files
│   └── *.mdx
├── [slug]/          # Dynamic route for posts
│   └── page.tsx
├── page.tsx         # Blog index page
└── utils.ts         # Blog utilities
```

## Creating a Blog Post

1. **Create file** in `app/blog/posts/`:

```bash
touch app/blog/posts/my-post.mdx
```

2. **Add frontmatter and content**:

```mdx
---
title: My Blog Post Title
publishedAt: 2026-01-02
summary: A brief description of your post
image: /images/my-post.jpg  # Optional
---

# Your Blog Post

Write your content here using Markdown...

## Subheading

You can use all standard Markdown features:

- Lists
- **Bold** and _italic_
- [Links](https://example.com)
- Code blocks
- Images
- Tables
- And more!

You can also use custom components:

<Callout type="info">
This is a callout in your blog post!
</Callout>

<FeatureCard 
  title="Feature" 
  description="Description"
  icon="🎯"
/>
```

3. **Done!** Visit `/blog/my-post`

## Frontmatter Fields

All fields:

```yaml
title: string       # Required - Post title
publishedAt: string # Required - YYYY-MM-DD format
summary: string     # Required - Brief description for SEO
image: string       # Optional - OG image path
```

## Features

- ✅ Automatic sorting (newest first)
- ✅ SEO metadata generation
- ✅ JSON-LD structured data
- ✅ RSS feed integration
- ✅ Syntax highlighting
- ✅ Custom MDX components
- ✅ TypeScript support

## Utilities

### `getBlogPosts()`

Get all blog posts, sorted by date (newest first).

```typescript
import { getBlogPosts } from "app/blog/utils";

const posts = getBlogPosts();
```

### `formatDate(date, includeRelative?)`

Format a date string for display.

```typescript
import { formatDate } from "app/blog/utils";

formatDate("2026-01-02");           // "January 2, 2026"
formatDate("2026-01-02", true);     // "January 2, 2026 (2d ago)"
```

## Custom Components

All custom MDX components work in blog posts:

- `<FeatureCard>`
- `<CardGrid>`
- `<Button>`
- `<Callout>`
- `<Testimonial>`

See `content/pages/_examples.md` for component examples.

## Styling

Blog posts use the `prose` class from Tailwind Typography for automatic styling:

- Headings
- Paragraphs
- Lists
- Blockquotes
- Code blocks
- Tables
- Images

## SEO

Each blog post automatically generates:

- Meta tags (title, description)
- Open Graph tags (for social sharing)
- Twitter Card tags
- JSON-LD structured data
- Sitemap entry
- RSS feed entry

## Tips

1. **Write descriptive summaries** - Used for SEO and previews
2. **Use consistent dates** - YYYY-MM-DD format
3. **Add images** - Improves social sharing
4. **Use headings** - For better structure and SEO
5. **Keep it simple** - Focus on content, not complex layouts

## Example Post

See `app/blog/posts/getting-started.mdx` for a complete example.
