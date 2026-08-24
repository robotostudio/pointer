# MDX Components

Components registered in `app/components/mdx.tsx` can be used directly in MDX files.

When creating or modifying MDX components, update this file with props and usage examples.

## Hero

Composable hero section with dark background. Compose with child components for full flexibility.

```jsx
<Hero>
  <HeroBackdrop variant="gradient" />
  <HeroLabel>Features</HeroLabel>
  <HeroTitle>The best way to build software.</HeroTitle>
  <HeroDescription>
    Build faster with AI-powered code completion and generation.
  </HeroDescription>
  <HeroActions>
    <HeroButton href="/download">Download for Windows ↓</HeroButton>
    <HeroButton href="/docs" variant="secondary">Documentation</HeroButton>
  </HeroActions>
</Hero>
```

### Hero

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `"default" \| "centered" \| "split"` | No | Layout variant (default: "default") |
| `className` | `string` | No | Additional CSS classes |
| `children` | `ReactNode` | Yes | Hero child components |

### HeroLabel

Small uppercase label text above the title.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Label text |
| `className` | `string` | No | Additional CSS classes |

### HeroTitle

Main headline. Renders as h1 by default.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Title text |
| `as` | `"h1" \| "h2" \| "h3"` | No | HTML heading level (default: "h1") |
| `className` | `string` | No | Additional CSS classes |

### HeroDescription

Supporting text below the title.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Description text |
| `className` | `string` | No | Additional CSS classes |

### HeroActions

Container for action buttons.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | HeroButton components |
| `className` | `string` | No | Additional CSS classes |

### HeroButton

Call-to-action button with pill shape.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Button text |
| `href` | `string` | No | Link URL |
| `variant` | `"primary" \| "secondary" \| "ghost"` | No | Button style (default: "primary") |
| `className` | `string` | No | Additional CSS classes |

### HeroMedia

Container for media content (images, videos) in split layouts.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Media content |
| `className` | `string` | No | Additional CSS classes |

### HeroBackdrop

Background decoration layer.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `"gradient" \| "grid" \| "dots" \| "none"` | No | Background style (default: "gradient") |
| `className` | `string` | No | Additional CSS classes |

## Frontmatter

Validated against `lib/content-schema.ts` at build time — unknown keys and
missing required fields fail `pnpm build`.

**Pages:**

```yaml
title: Page Title                         # required
description: SEO description              # required, max 220 chars
layout: default | full-width | centered   # optional, defaults to "default"
showTitle: true | false                   # optional, defaults to true
author: Name                              # optional
image: /path.png                          # optional
publishedAt: 2026-01-02                   # optional
updatedAt: 2026-01-02                     # optional
```

**Blog Posts:**

```yaml
title: Post Title                         # required
publishedAt: 2026-01-02                   # required
summary: Brief description for listing    # required, 80-220 chars
author: Name                              # required
category: product | research | company | news  # optional
image: /path.png                          # optional
imageAlt: Alt text                        # optional
updatedAt: 2026-01-02                     # optional
```

## Feature

Two-column section with text and media. Use `reverse` prop to swap positions.

```jsx
<Feature>
  <FeatureContent>
    <FeatureTitle>Agent turns ideas into code</FeatureTitle>
    <FeatureDescription>
      A human-AI programmer, orders of magnitude more effective than any developer alone.
    </FeatureDescription>
    <FeatureActions>
      <FeatureButton href="/agent">Learn about Agent →</FeatureButton>
    </FeatureActions>
  </FeatureContent>
  <FeatureMedia>
    <img src="/agent-screenshot.png" alt="Agent interface" />
  </FeatureMedia>
</Feature>

<Feature reverse>
  <FeatureContent>
    <FeatureTitle>Image on the left</FeatureTitle>
    <FeatureDescription>Text on the right with reverse prop.</FeatureDescription>
  </FeatureContent>
  <FeatureMedia>
    <img src="/screenshot.png" alt="Screenshot" />
  </FeatureMedia>
</Feature>
```

### Feature

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `reverse` | `boolean` | No | Swap text/media positions |
| `className` | `string` | No | Additional CSS classes |
| `children` | `ReactNode` | Yes | FeatureContent and FeatureMedia |

### FeatureContent

Container for text elements.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Title, description, actions |
| `className` | `string` | No | Additional CSS classes |

### FeatureTitle

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Title text |
| `as` | `"h1" \| "h2" \| "h3" \| "h4"` | No | Heading level (default: "h2") |
| `className` | `string` | No | Additional CSS classes |

### FeatureDescription

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Description text |
| `className` | `string` | No | Additional CSS classes |

### FeatureActions

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | FeatureButton components |
| `className` | `string` | No | Additional CSS classes |

### FeatureButton

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Button text |
| `href` | `string` | No | Link URL |
| `variant` | `"primary" \| "secondary"` | No | Style (default: "primary") |
| `className` | `string` | No | Additional CSS classes |

### FeatureMedia

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Image or media content |
| `className` | `string` | No | Additional CSS classes |

## FAQ

Composable Q&A section using accordions.

```jsx
<FAQ title="Questions & Answers">
  <FAQItem question="What is the right plan for me?">
    Choose based on your team size and usage needs.
  </FAQItem>
  <FAQItem question="What are my payment options?">
    We accept all major credit cards and offer annual billing discounts.
  </FAQItem>
</FAQ>
```

### FAQ

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | No | Section heading |
| `className` | `string` | No | Additional CSS classes |
| `children` | `ReactNode` | Yes | FAQItem components |

### FAQItem

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `question` | `string` | Yes | The question text (displayed as trigger) |
| `value` | `string` | No | Unique identifier (auto-generated from question if omitted) |
| `children` | `ReactNode` | Yes | Answer content (supports markdown) |
