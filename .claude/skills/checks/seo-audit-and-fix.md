# SEO Audit Agent Rules

A reusable ruleset for AI agents to audit and fix SEO issues on any web project.

---

## Phase 1: Discovery

Before auditing, understand the project structure.

### Step 1.1: Identify the Tech Stack

Look for these indicators:

```bash
# Check for framework
ls -la | grep -E "next.config|nuxt.config|astro.config|gatsby-config|vite.config"

# Check for CMS
ls -la | grep -E "sanity.config|contentful|strapi"

# Check package.json for clues
cat package.json | grep -E "next|nuxt|astro|gatsby|remix"
```

**Common patterns:**
| Framework | Content Location | Metadata Pattern |
|-----------|-----------------|------------------|
| Next.js App Router | `app/` or `src/app/` | `generateMetadata()` or `metadata` export |
| Next.js Pages | `pages/` | `<Head>` component or next-seo |
| Astro | `src/pages/` or `src/content/` | Frontmatter or `<BaseHead>` |
| Nuxt | `pages/` or `content/` | `useHead()` or `useSeoMeta()` |
| Gatsby | `src/pages/` | `gatsby-plugin-react-helmet` |

### Step 1.2: Find Content Files

```bash
# Find MDX/MD content
find . -name "*.mdx" -o -name "*.md" | grep -v node_modules | head -20

# Find content directories
find . -type d -name "content" -o -name "posts" -o -name "blog" | grep -v node_modules

# Find page components
find . -name "page.tsx" -o -name "page.jsx" | grep -v node_modules
```

### Step 1.3: Identify SEO Infrastructure

Look for these files:

```bash
# Sitemap
find . -name "sitemap*" | grep -v node_modules

# Robots
find . -name "robots*" | grep -v node_modules

# SEO utilities
grep -r "generateMetadata\|getMetadata\|useSeo" --include="*.ts" --include="*.tsx" | head -10

# Structured data
grep -r "json-ld\|schema.org\|structuredData" --include="*.ts" --include="*.tsx" | head -10

# OpenGraph
grep -r "openGraph\|og:title\|twitter:card" --include="*.ts" --include="*.tsx" | head -10
```

---

## Phase 2: Audit Checklist

Run through each category systematically.

### 2.1: Technical SEO

| Check | How to Verify | Pass Criteria |
|-------|---------------|---------------|
| Sitemap exists | `curl [site]/sitemap.xml` | Returns valid XML |
| Robots.txt exists | `curl [site]/robots.txt` | Returns valid directives |
| Canonical URLs | Check `<link rel="canonical">` in HTML | Present on all pages |
| Meta robots | Check for `noindex` tags | Only on pages that should be excluded |
| HTTPS | Check URL scheme | All URLs use HTTPS |
| Mobile viewport | Check `<meta name="viewport">` | Present with proper values |

**Commands to run:**
```bash
# Check sitemap
curl -s [SITE_URL]/sitemap.xml | head -50

# Check robots
curl -s [SITE_URL]/robots.txt

# Check page HTML for meta tags
curl -s [SITE_URL] | grep -E "<title>|<meta|canonical|og:|twitter:"
```

### 2.2: Content SEO (Per Page)

| Field | Requirement | How to Check |
|-------|-------------|--------------|
| Title | 50-60 chars, unique, keyword-rich | `<title>` tag |
| Meta description | 150-160 chars, compelling | `<meta name="description">` |
| H1 | One per page, includes keyword | Count `<h1>` tags |
| Image alt text | All images have descriptive alt | `<img>` tags without alt or alt="" |
| Internal links | Related content linked | Check `<a href>` to same domain |

**Frontmatter audit for content files:**
```bash
# Find empty or missing titles
grep -l 'title: ""' [CONTENT_DIR]/**/*.mdx
grep -L 'title:' [CONTENT_DIR]/**/*.mdx

# Find empty descriptions
grep -l 'description: ""' [CONTENT_DIR]/**/*.mdx

# Find empty alt text
grep -l 'imageAlt: ""' [CONTENT_DIR]/**/*.mdx
grep -l "alt: ''" [CONTENT_DIR]/**/*.mdx
```

### 2.3: Structured Data

| Schema Type | When Required | Validation |
|-------------|---------------|------------|
| Organization | Homepage | Company info present |
| WebSite | Homepage | Site name, URL |
| Article | Blog posts | Title, author, dates, image |
| BreadcrumbList | All pages with hierarchy | Correct path structure |
| FAQPage | FAQ sections | Question/answer pairs |
| Product | E-commerce | Price, availability |
| LocalBusiness | Local businesses | Address, hours, contact |

**How to check:**
```bash
# Find JSON-LD in page source
curl -s [PAGE_URL] | grep -o '<script type="application/ld+json">.*</script>'

# Or in browser console:
document.querySelectorAll('script[type="application/ld+json"]')
  .forEach(s => console.log(JSON.parse(s.textContent)));
```

### 2.4: Open Graph & Social

| Tag | Requirement |
|-----|-------------|
| `og:title` | Present, matches or improves on title |
| `og:description` | Present, compelling summary |
| `og:image` | Present, 1200x630px recommended |
| `og:url` | Present, canonical URL |
| `og:type` | Present (website, article, etc.) |
| `twitter:card` | Present (summary_large_image recommended) |
| `twitter:image` | Present, proper dimensions |

---

## Phase 3: Common Issues and Fixes

### Issue: Empty or Missing Alt Text

**Detection:**
```bash
# In content files
grep -r 'imageAlt: ""' [CONTENT_DIR]/
grep -r "alt=''" [CONTENT_DIR]/
grep -r 'alt=""' [CONTENT_DIR]/

# In HTML output
curl -s [URL] | grep -o '<img[^>]*>' | grep -v 'alt='
curl -s [URL] | grep -o '<img[^>]*alt=""[^>]*>'
```

**Fix rules:**
1. Read the surrounding content to understand context
2. Describe what the image shows, not what page it's on
3. Keep under 125 characters
4. Include relevant keywords naturally
5. Never start with "Image of..." or "Picture of..."
6. Never leave empty

**Good alt text patterns:**
```
"[Product/Client] [main feature] [context]"
"[Person name] [action] at [location/event]"
"[Chart/diagram] showing [data insight]"
"[Screenshot] of [feature] in [product]"
```

### Issue: Missing or Poor Meta Descriptions

**Detection:**
```bash
# Missing in frontmatter
grep -L 'description:' [CONTENT_DIR]/**/*.mdx

# Empty
grep -l 'description: ""' [CONTENT_DIR]/**/*.mdx

# Too short (under 100 chars) or too long (over 160 chars)
# Requires reading each file
```

**Fix rules:**
1. 150-160 characters optimal
2. Include primary keyword in first 100 chars
3. Write for humans - make it compelling
4. Include a value proposition or call-to-action
5. Unique for every page

### Issue: Title Problems

**Detection:**
```bash
# Missing
grep -L 'title:' [CONTENT_DIR]/**/*.mdx

# Empty
grep -l 'title: ""' [CONTENT_DIR]/**/*.mdx

# Duplicate titles (requires aggregation)
grep -h 'title:' [CONTENT_DIR]/**/*.mdx | sort | uniq -d
```

**Fix rules:**
1. 50-60 characters optimal
2. Primary keyword near the front
3. Unique for every page
4. Compelling and clickable
5. Don't include site name (usually added by framework)

### Issue: Missing Sitemap Entries

**Detection:**
1. Count content files vs sitemap URLs
2. Check for missing content types

```bash
# Count MDX files
find [CONTENT_DIR] -name "*.mdx" | wc -l

# Count sitemap URLs
curl -s [SITE]/sitemap.xml | grep -c "<url>"
```

**Fix:** Ensure sitemap generation includes all content types.

### Issue: Broken Internal Links

**Detection:**
```bash
# Extract all internal links from content
grep -roh 'href="\/[^"]*"' [CONTENT_DIR]/ | sort | uniq

# Check if linked pages exist
# (requires scripting to verify each)
```

### Issue: Missing Structured Data

**Detection:**
```bash
# Check if JSON-LD exists
curl -s [URL] | grep -c "application/ld+json"

# Should be > 0 for most pages
```

**Fix:** Add appropriate JSON-LD schema based on page type.

---

## Phase 4: Reporting Format

When reporting audit results, use this structure:

```markdown
## SEO Audit Report: [Project Name]

**Date:** YYYY-MM-DD
**Audited by:** [Agent/Person]
**Overall Score:** X/10

### Summary

| Category | Status | Issues Found |
|----------|--------|--------------|
| Technical SEO | Pass/Fail | X issues |
| Content SEO | Pass/Fail | X issues |
| Structured Data | Pass/Fail | X issues |
| Social/OG Tags | Pass/Fail | X issues |

### Critical Issues (Fix Immediately)

1. **[Issue Name]**
   - Location: [file path or URL]
   - Problem: [description]
   - Fix: [specific action]

### High Priority Issues

1. ...

### Medium Priority Issues

1. ...

### Low Priority / Nice to Have

1. ...

### What's Working Well

- [List positive findings]
```

---

## Phase 5: Fix Workflow

When fixing issues, follow this process:

### Step 5.1: Prioritize

1. **Critical:** Blocking indexing or causing errors
2. **High:** Missing required fields, empty alt text
3. **Medium:** Optimization opportunities
4. **Low:** Nice-to-haves, minor improvements

### Step 5.2: Batch by Type

Group fixes by issue type:
- All empty alt text fixes together
- All missing description fixes together
- All structured data fixes together

### Step 5.3: Fix Process

For each file:

1. **Read** the entire file first
2. **Understand** the content context
3. **Generate** the fix based on content
4. **Apply** only the specific field change
5. **Preserve** all other content exactly
6. **Verify** the fix makes sense

### Step 5.4: Verification

After fixes:

```bash
# Re-run detection commands to verify fixes
grep -r 'imageAlt: ""' [CONTENT_DIR]/  # Should return nothing

# Rebuild and check output
npm run build  # or equivalent

# Spot-check pages
curl -s [URL] | grep -E "og:image|alt="
```

---

## Quick Reference: SEO Field Requirements

### Content Frontmatter

| Field | Required | Length | Notes |
|-------|----------|--------|-------|
| title | Yes | 50-60 chars | Keyword near front |
| description | Yes | 150-160 chars | Compelling, unique |
| image | Yes | Valid URL | 1200x630px for OG |
| imageAlt | Yes | <125 chars | Descriptive, never empty |
| publishedAt | Yes | ISO date | YYYY-MM-DD |
| updatedAt | Recommended | ISO date | Update when content changes |
| author | Recommended | String/array | For attribution |
| categories/tags | Recommended | Array | For organization |

### HTML Output

| Element | Required | Notes |
|---------|----------|-------|
| `<title>` | Yes | Unique per page |
| `<meta name="description">` | Yes | Unique per page |
| `<link rel="canonical">` | Yes | Self-referencing |
| `<meta name="viewport">` | Yes | Mobile-friendly |
| `<html lang="x">` | Yes | Language code |
| OG tags | Recommended | For social sharing |
| JSON-LD | Recommended | For rich results |

---

## Tools for Validation

### Online Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [OpenGraph Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Search Console](https://search.google.com/search-console)

### CLI Tools

```bash
# Lighthouse CLI
npx lighthouse [URL] --only-categories=seo --output=json

# Check structured data
curl -s [URL] | grep -o '<script type="application/ld+json">.*</script>'

# Check meta tags
curl -s [URL] | grep -E "<title>|<meta name=\"description\"|og:|twitter:"
```

---

## Adapting to Different Frameworks

### Next.js (App Router)

- Metadata: `generateMetadata()` in `page.tsx` or `layout.tsx`
- Sitemap: `sitemap.ts` in `app/`
- Robots: `robots.ts` in `app/`
- Content: Usually `app/` routes or `content/` directory

### Astro

- Metadata: Frontmatter in `.astro` files or `<BaseHead>` component
- Sitemap: `@astrojs/sitemap` integration
- Content: `src/content/` with content collections

### Nuxt

- Metadata: `useHead()` or `useSeoMeta()` composables
- Sitemap: `@nuxtjs/sitemap` module
- Content: `content/` directory with Nuxt Content

### Gatsby

- Metadata: `gatsby-plugin-react-helmet` or Gatsby Head API
- Sitemap: `gatsby-plugin-sitemap`
- Content: `src/pages/` or CMS integration

---

## Summary

1. **Discover** the project structure and tech stack
2. **Audit** systematically using the checklist
3. **Report** findings in priority order
4. **Fix** issues in batches, preserving existing content
5. **Verify** fixes were applied correctly
