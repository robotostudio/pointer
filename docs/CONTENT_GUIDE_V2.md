
# Content Management Guide V2

Complete guide for managing content in the MDX CMS.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Content Structure](#content-structure)
3. [Creating Pages](#creating-pages)
4. [Page Layouts](#page-layouts)
5. [Advanced Features](#advanced-features)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Quick Start

### View Your Site

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
open http://localhost:3000
```

### Edit Content

All content lives in `content/pages/`:

```
content/pages/
├── home.mdx              → /
├── about.mdx             → /about
└── company/
    ├── contact.mdx       → /company/contact
    └── careers.mdx       → /company/careers
```

## Content Structure

### Simple Page

For single pages like `/about`:

```
content/pages/about.mdx
```

**Example**:

```mdx
---
title: About Us
description: Learn more about our company
layout: default
showTitle: true
---

# Our Story

Content goes here...
```

### Nested Page

For pages like `/company/contact`:

```
content/pages/company/contact.mdx
```

**Example**:

```mdx
---
title: Contact Us
description: Get in touch
layout: centered
---

## Get In Touch

Contact form here...
```

### Multi-Section Page

For pages with multiple sections (like homepage):

```
content/pages/home.mdx        # Main file
content/pages/home/           # Sections
  ├── hero.mdx
  ├── features.mdx
  └── testimonials.mdx
```

**Main file** (`home.mdx`):

```mdx
---
title: Home
layout: multi-section
showTitle: false
---
```

**Section file** (`home/hero.mdx`):

```mdx
---
section: hero
order: 1
title: Welcome
---

# Hero Content
```

## Creating Pages

### 1. Create New Page

```bash
# Simple page
touch content/pages/pricing.mdx

# Nested page
mkdir -p content/pages/products
touch content/pages/products/pro.mdx
```

### 2. Add Frontmatter

```mdx
---
title: Your Page Title
description: Brief description for SEO
layout: default
showTitle: true
---
```

### 3. Write Content

Use standard Markdown:

```mdx
# Main Heading

Your content with **bold**, _italic_, and [links](/).

## Sub Heading

- Lists
- Work
- Great

> Blockquotes too!
```

### 4. Preview

```bash
pnpm dev
# Visit http://localhost:3000/your-page
```

## Frontmatter Options

### Required Fields

```mdx
---
title: Page Title          # Required
---
```

### Optional Fields

```mdx
---
title: Page Title
description: SEO description
layout: default             # default | multi-section | full-width | centered
showTitle: true            # Show title in page (default: true)
showBreadcrumbs: false     # Show breadcrumbs (default: false)
author: John Doe           # Author name
publishedAt: 2026-01-01    # Publication date
updatedAt: 2026-01-02      # Last update date
tags: [tag1, tag2]         # Tags for categorization
image: /images/hero.jpg    # OG image for social sharing
---
```

### Section-Specific (Multi-Section Pages)

```mdx
---
section: hero              # Unique section identifier
order: 1                   # Display order (lower = first)
title: Optional Title      # Section title
---
```

## Page Layouts

### Default Layout

Standard single-column layout, max width 4xl.

```mdx
---
layout: default
---
```

**Best for**: Documentation, blog posts, standard pages

### Multi-Section Layout

Multiple sections with different components.

```mdx
---
layout: multi-section
---
```

**Best for**: Marketing pages, landing pages, homepage

### Full-Width Layout

Spans entire viewport width.

```mdx
---
layout: full-width
---
```

**Best for**: Dashboards, wide tables, full-width content

### Centered Layout

Narrow, centered content (max width 2xl).

```mdx
---
layout: centered
---
```

**Best for**: Forms, focused content, contact pages

## Advanced Features

### Using Custom Components

```mdx
# Use in your MDX content

<FeatureCard 
  title="Fast" 
  description="Lightning fast performance"
  icon="⚡"
/>

<CardGrid columns={3}>
  <FeatureCard title="One" description="First" icon="1️⃣" />
  <FeatureCard title="Two" description="Second" icon="2️⃣" />
  <FeatureCard title="Three" description="Third" icon="3️⃣" />
</CardGrid>

<Button variant="primary" href="/signup">
  Get Started
</Button>

<Callout type="info">
  Important information here!
</Callout>
```

### Available Components

- `<FeatureCard>` - Feature highlight cards
- `<CardGrid>` - Responsive grid (2, 3, or 4 columns)
- `<Button>` - CTA buttons (primary/secondary)
- `<Testimonial>` - Customer testimonials
- `<Callout>` - Info/warning/success boxes

### Images

```mdx
# Standard markdown
![Alt text](/images/hero.jpg)

# With Next.js Image component (better)
<Image 
  src="/images/hero.jpg" 
  alt="Description"
  width={800}
  height={600}
/>
```

### Code Blocks

````mdx
# Inline code
Use `const example = true` for examples.

# Code blocks
```typescript
function hello() {
  return "world";
}
```
````

### Links

```mdx
# Internal links
[About Us](/about)
[Contact](/company/contact)

# External links (opens in new tab automatically)
[Google](https://google.com)

# Anchor links
[Jump to section](#section-name)
```

## Multi-Section Pages

### Creating Sections

1. **Create main page file**:

```bash
touch content/pages/features.mdx
```

```mdx
---
title: Features
layout: multi-section
---
```

2. **Create sections directory**:

```bash
mkdir content/pages/features
```

3. **Add section files**:

```bash
touch content/pages/features/hero.mdx
touch content/pages/features/showcase.mdx
touch content/pages/features/testimonials.mdx
```

4. **Write section content**:

```mdx
---
section: hero
order: 1
---

# Amazing Features

Discover what makes us special...
```

### Section Order

Control order with the `order` field:

```mdx
# First section
---
section: hero
order: 1
---

# Second section
---
section: features
order: 2
---

# Third section
---
section: testimonials
order: 3
---
```

### Section Components

Different section types use different components:

- `hero` → HeroSection (with CTAs)
- `features` → FeaturesSection
- `testimonials` → TestimonialsSection
- `changelog` → ChangelogSection
- Other → ContentSection (default)

## Best Practices

### Content Organization

✅ **Do**:
```
content/pages/
├── about.mdx
├── pricing.mdx
└── company/
    ├── contact.mdx
    ├── careers.mdx
    └── about.mdx
```

❌ **Don't**:
```
content/pages/
├── about.mdx
├── company-contact.mdx      # Don't use hyphens for nesting
└── company_careers.mdx      # Use directories instead
```

### File Naming

✅ **Do**:
- `about.mdx`
- `contact.mdx`
- `pricing-plans.mdx` (kebab-case)

❌ **Don't**:
- `About.mdx` (capitals)
- `contact us.mdx` (spaces)
- `pricing_plans.mdx` (underscores)

### Frontmatter

✅ **Do**:
```mdx
---
title: Clear Descriptive Title
description: Concise description under 160 characters
layout: default
---
```

❌ **Don't**:
```mdx
---
title: my page
description: this is a page about stuff
---
```

### Content Writing

✅ **Do**:
- Use clear, scannable headings
- Keep paragraphs short
- Use lists and formatting
- Add alt text to images
- Write descriptive links

❌ **Don't**:
- Write walls of text
- Use generic link text ("click here")
- Forget image alt text
- Skip headings

## Troubleshooting

### Page Not Showing

**Problem**: Created page but getting 404

**Solutions**:
1. Check file location: `content/pages/your-page.mdx`
2. Verify frontmatter has `title` field
3. Restart dev server: `pnpm dev`
4. Check for frontmatter syntax errors

### Frontmatter Errors

**Problem**: Build fails with frontmatter error

**Solutions**:
1. Ensure `---` on separate lines
2. Check YAML syntax (spaces, colons)
3. Quote values with special characters
4. Verify all required fields present

### Layout Not Working

**Problem**: Page using wrong layout

**Solutions**:
1. Check `layout` field spelling
2. Valid options: `default`, `multi-section`, `full-width`, `centered`
3. Ensure field is in frontmatter section
4. Clear Next.js cache: `rm -rf .next`

### Sections Not Appearing

**Problem**: Multi-section page not showing sections

**Solutions**:
1. Verify directory structure:
   - `content/pages/page.mdx`
   - `content/pages/page/section.mdx`
2. Check `layout: multi-section` in main file
3. Ensure sections have `section` and `order` fields
4. Verify section filenames end in `.mdx`

### Custom Components Not Working

**Problem**: Components not rendering

**Solutions**:
1. Check component name (case-sensitive)
2. Ensure component imported in `mdx.tsx`
3. Verify JSX syntax: `<Component />` not `{Component}`
4. Check component props match interface

### Build Errors

**Problem**: Build fails

**Solutions**:
1. Check all MDX files for syntax errors
2. Verify all images exist
3. Run TypeScript check: `pnpm tsc`
4. Check console for specific error
5. Try clean build: `rm -rf .next && pnpm build`

## Examples

### Simple About Page

**File**: `content/pages/about.mdx`

```mdx
---
title: About Our Company
description: Learn about our mission and values
layout: default
---

# About Us

We're building the future of software development.

## Our Mission

To make developers more productive.

## Our Values

- Innovation
- Quality
- Community
```

### Contact Page with Form

**File**: `content/pages/company/contact.mdx`

```mdx
---
title: Contact Us
description: Get in touch with our team
layout: centered
---

## Get In Touch

<Callout type="info">
We typically respond within 24 hours.
</Callout>

### General Inquiries
**Email**: hello@example.com

### Support
**Email**: support@example.com
```

### Multi-Section Landing Page

**Main File**: `content/pages/product.mdx`

```mdx
---
title: Our Product
layout: multi-section
---
```

**Hero**: `content/pages/product/hero.mdx`

```mdx
---
section: hero
order: 1
---

# Revolutionary Product

<Button variant="primary" href="/signup">
  Start Free Trial
</Button>
```

**Features**: `content/pages/product/features.mdx`

```mdx
---
section: features
order: 2
---

## Features

<CardGrid columns={3}>
  <FeatureCard 
    title="Fast" 
    description="Lightning performance"
    icon="⚡"
  />
  <FeatureCard 
    title="Secure" 
    description="Bank-level security"
    icon="🔒"
  />
  <FeatureCard 
    title="Scalable" 
    description="Grows with you"
    icon="📈"
  />
</CardGrid>
```

## Next Steps

1. **Read**: [ARCHITECTURE_V2.md](./ARCHITECTURE_V2.md) for technical details
2. **Explore**: Example pages in `content/pages/`
3. **Experiment**: Create test pages in development
4. **Deploy**: Run `pnpm build` when ready

---

**Need Help?** Check the [Troubleshooting](#troubleshooting) section or create an issue.
