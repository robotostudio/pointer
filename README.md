# Pointer

A modern content platform built with Next.js and MDX. Create pages, blogs, and marketing sites using composable React components — all managed as code in git.

## Features

- **File-based MDX content** — one MDX file per page, no CMS or database
- **Composable components** — Hero, Pricing, FAQ, Testimonials, Changelog, and more
- **Blog with categories** — MDX-powered blog with filtering and post navigation
- **Dynamic OG images** — auto-generated Open Graph images with custom fonts
- **SEO built-in** — sitemap, robots.txt, RSS feed, JSON-LD structured data
- **Dark mode** — system-aware theming with light/dark toggle
- **Static generation** — fast builds, no runtime data fetching
- **Git-native** — full history, PR previews, AI agent-friendly

## Tech Stack

Next.js 16 / React 19 / TypeScript / Tailwind CSS / shadcn/ui / Vercel

## Content as Code

Pages are MDX files that combine markdown with React components:

```
content/pages/     # Site pages → /*
app/blog/posts/    # Blog posts → /blog/*
```

```mdx
---
title: Pricing
description: Plans for every team
---

<PricingHero>
  <PricingGrid>
    <PricingCard title="Free" price="$0">
      <PricingFeatures>
        <PricingFeature>5 projects</PricingFeature>
        <PricingFeature>Community support</PricingFeature>
      </PricingFeatures>
      <PricingAction href="/signup">Get Started</PricingAction>
    </PricingCard>
  </PricingGrid>
</PricingHero>
```

## Project Structure

```
content/pages/     # MDX pages (home, pricing, features, enterprise, etc.)
app/blog/posts/    # MDX blog posts
app/og/            # Dynamic OG image generation
components/        # React + MDX components
lib/               # Utilities and content service
docs/              # Code style, git conventions, MDX component docs
```

## Components

Pointer includes a library of composable MDX components:

**Layout** — Hero, Feature, EnterpriseFeature, CTA, SecuritySection, StatsSection

**Cards** — HighlightCard, FeatureCard, TestimonialCard, PricingCard, ChangelogCard

**Content** — FAQ, LogoCloud, Highlights, Callout, Button

See [`docs/MDX_COMPONENTS.md`](docs/MDX_COMPONENTS.md) for full documentation with props and examples.

## Deploy

Optimized for Vercel — push to git and deploy automatically.
