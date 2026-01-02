# MDX Content Management System

This directory contains all MDX content files that power the website. The structure is designed to use MDX as a lightweight CMS, making content easily editable without touching code.

## Directory Structure

```
content/
├── home/           # Homepage sections
│   ├── hero.mdx
│   ├── features.mdx
│   ├── testimonials.mdx
│   ├── frontier.mdx
│   ├── changelog.mdx
│   └── highlights.mdx
└── README.md       # This file
```

## How It Works

### Frontmatter Metadata

Each MDX file includes frontmatter (YAML metadata) at the top:

```mdx
---
section: hero
order: 1
title: Optional Section Title
---

# Your content here
```

**Required fields:**
- `section`: Unique identifier for the section
- `order`: Numeric value to control display order (1, 2, 3, etc.)

**Optional fields:**
- `title`: Display title for the section
- Any custom fields you need

### Content Format

After the frontmatter, write standard MDX/Markdown:

```mdx
---
section: example
order: 1
---

## Heading

Regular **markdown** content with _formatting_.

- Lists
- Work
- Great

> Blockquotes too!
```

## Adding New Sections

1. Create a new `.mdx` file in the appropriate directory
2. Add frontmatter with `section`, `order`, and optional fields
3. Write your content using Markdown/MDX syntax
4. The section will automatically appear on the page

### Example: Adding a "Pricing" Section

Create `content/home/pricing.mdx`:

```mdx
---
section: pricing
order: 5
title: Simple, transparent pricing
---

## Choose your plan

### Free
Perfect for individuals and hobbyists.
- Unlimited basic completions
- Community support

### Pro
For professional developers.
- All Free features
- Advanced AI models
- Priority support
```

Then create a corresponding component in `app/components/content-section.tsx`:

```tsx
export function PricingSection({ content, metadata }: ContentSectionProps) {
  return (
    <section className="mb-20">
      {metadata?.title && (
        <h2 className="text-3xl font-bold text-center mb-12">
          {metadata.title}
        </h2>
      )}
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <CustomMDX source={content} />
      </article>
    </section>
  )
}
```

And add the case in `app/page.tsx`:

```tsx
case 'pricing':
  return <PricingSection key={slug} content={content} metadata={metadata} />
```

## Editing Content

Simply edit the `.mdx` files in this directory. Changes will be reflected after the next build or page refresh (in development mode).

### Supported Markdown Features

- **Headings**: `#`, `##`, `###`, etc.
- **Bold**: `**text**`
- **Italic**: `_text_`
- **Links**: `[text](url)`
- **Lists**: `-` or `1.`
- **Blockquotes**: `>`
- **Code**: `` `code` `` or ` ```language `
- **Images**: `![alt](url)`

## Section Types

### Hero Section
The main headline and CTA at the top of the page.

### Features Section
Showcase key features and capabilities.

### Testimonials Section
Customer quotes and social proof.

### Frontier Section
Advanced features and technical capabilities.

### Changelog Section
Recent updates and version history.

### Highlights Section
Featured blog posts or announcements.

## Best Practices

1. **Keep sections focused**: Each file should cover one topic
2. **Use descriptive filenames**: Match the section name
3. **Order logically**: Use the `order` field to control flow
4. **Write clear content**: Remember, this is what users see
5. **Test your changes**: Preview in development mode before deploying

## Technical Details

- **Parser**: Uses frontmatter parsing to extract metadata
- **Renderer**: MDX Remote for server-side rendering
- **Components**: Custom MDX components in `app/components/mdx.tsx`
- **Utilities**: Content reading functions in `app/lib/content.ts`
