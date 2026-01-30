# MDX Components

Components registered in `app/components/mdx.tsx` can be used directly in MDX files.

When creating or modifying MDX components, update this file with props and usage examples.

## Hero

```jsx
<Hero variant="default" />
<Hero variant="centered" />
<Hero variant="full-width" />
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `"default" \| "centered" \| "full-width"` | Yes | Layout variant |

## Frontmatter

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
