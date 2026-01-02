# MDX Page Examples

## Simple Page

```mdx
---
title: About Us
description: Learn more about our company
layout: default
---

# Our Story

We're building amazing products...

## What We Do

Our mission is to...
```

## Page with Custom Components

```mdx
---
title: Features
description: Discover our amazing features
layout: default
---

# Features

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

## Call to Action

<Button variant="primary" href="/signup">
  Get Started Now
</Button>
```

## Page with Callouts

```mdx
---
title: Documentation
layout: default
---

# Getting Started

<Callout type="info">
Make sure you have Node.js installed before proceeding.
</Callout>

## Installation

```bash
npm install our-package
```

<Callout type="success">
Successfully installed! You're ready to go.
</Callout>
```

## Centered Layout (Contact, Forms)

```mdx
---
title: Contact Us
description: Get in touch
layout: centered
---

# Get In Touch

<Callout type="info">
We typically respond within 24 hours.
</Callout>

**Email**: hello@example.com  
**Phone**: (555) 123-4567
```

## Full Width Layout

```mdx
---
title: Dashboard
layout: full-width
---

# Analytics Dashboard

Wide content that spans the full viewport...
```

## Available Custom Components

- `<FeatureCard>` - Feature cards
- `<CardGrid columns={2|3|4}>` - Grid layout
- `<Button variant="primary|secondary">` - CTA buttons
- `<Callout type="info|warning|success|error">` - Info boxes
- `<Testimonial>` - Customer quotes

## Tips

1. **One file per page** - Keep it simple
2. **Use components for rich UI** - Not separate section files
3. **Layouts**: `default`, `centered`, `full-width`
4. **Set `showTitle: false`** to hide the page title
