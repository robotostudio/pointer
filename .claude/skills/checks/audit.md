# Image Optimization Audit & Implementation Prompt

Use this prompt to audit and implement image optimization best practices in any Next.js/React project.

---

## Prompt for AI Agent

You are an image optimization specialist. Audit and implement image optimization for this Next.js project following these steps:

### Phase 1: Configuration Audit (CRITICAL)

**1. Check `next.config.ts` or `next.config.js` for image settings:**

```typescript
images: {
  // REQUIRED: Enable modern formats - AVIF must come first (smaller, better quality)
  formats: ["image/avif", "image/webp"],

  // REQUIRED: Long cache TTL for production (1 year = 31536000 seconds)
  minimumCacheTTL: 31536000,

  // RECOMMENDED: Responsive device sizes
  deviceSizes: [640, 828, 1080, 1440, 1920, 2560, 3840],

  // RECOMMENDED: Disable in dev to speed up development
  unoptimized: process.env.NODE_ENV === "development",

  // REQUIRED: Whitelist all external image domains
  remotePatterns: [
    { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    // Add all your image sources here
  ],
}
```

**2. AVIF Verification Checklist:**
- [ ] `formats` array exists in images config
- [ ] `"image/avif"` is FIRST in the formats array (takes priority)
- [ ] `"image/webp"` is SECOND as fallback
- [ ] NOT using the old `formats: ["image/webp"]` without AVIF

**Why AVIF first?** AVIF provides ~50% smaller files than WebP at same quality. Browser checks formats in order, so AVIF-capable browsers get the smaller file.

**3. Verify remote patterns include ALL external image sources:**
- CDN domains (Vercel Blob, Cloudinary, imgix, etc.)
- CMS domains (Sanity CDN, Contentful, etc.)
- Social/embed domains (YouTube thumbnails, etc.)

### Phase 2: Component Audit

Search for all `<Image` and `<img` usage and verify each follows these rules:

#### Rule 1: Always Prevent CLS (Cumulative Layout Shift)
```typescript
// Option A: Explicit dimensions (preferred for known sizes)
<Image src={src} width={800} height={600} alt="..." />

// Option B: Fill with sized parent (for responsive/unknown sizes)
<div className="relative aspect-video">
  <Image src={src} fill alt="..." className="object-cover" />
</div>
```

#### Rule 2: Use Responsive `sizes` Attribute
```typescript
// BAD - loads largest image always, wastes bandwidth
<Image src={src} width={1200} height={800} alt="..." />

// GOOD - loads appropriate size per viewport
<Image
  src={src}
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
  alt="..."
/>
```

**Common `sizes` patterns:**

| Layout | sizes value |
|--------|-------------|
| Full-width hero | `100vw` |
| Full-width with max container | `(max-width: 1400px) 100vw, 1366px` |
| Two-column grid | `(max-width: 768px) 100vw, 50vw` |
| Three-column grid | `(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw` |
| Card in grid (with max) | `(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 450px` |
| Fixed sidebar image | `300px` |
| Avatar/icon | `48px` or actual pixel size |

#### Rule 3: Strategic Loading Priority

```typescript
// PRIORITY: Above-the-fold critical images (hero, logo)
<Image src={heroImage} priority alt="Hero" />

// LAZY (default): Below-fold content - cards, galleries, body images
<Image src={cardImage} alt="Card" /> // lazy is default, don't add loading="lazy"

// EAGER + SYNC: Critical UI chrome that must render immediately
<Image
  src={logo}
  loading="eager"
  decoding="sync"
  priority
  alt="Logo"
/>
```

**Loading strategy by component type:**

| Component | Loading | Priority | Decoding |
|-----------|---------|----------|----------|
| Hero image | - | `priority` | - |
| Logo/nav | `eager` | `priority` | `sync` |
| Blog cards | default (lazy) | - | - |
| Gallery images | default (lazy) | - | - |
| Below-fold content | default (lazy) | - | - |

#### Rule 4: Always Include Alt Text
```typescript
// Decorative images (backgrounds, purely visual)
<Image src={bg} alt="" role="presentation" />

// Content images - be descriptive
<Image src={product} alt="Red Nike Air Max 90 sneaker, side view" />

// Never skip alt - screen readers and SEO need it
```

#### Rule 5: Use Blur Placeholders for Large Hero Images
```typescript
// Static import (automatic blur placeholder)
import heroImage from './hero.jpg';
<Image src={heroImage} placeholder="blur" alt="..." />

// Remote images - generate tiny blur version
<Image
  src={remoteUrl}
  placeholder="blur"
  blurDataURL={`${remoteUrl}?w=24&h=24&blur=10`} // If CDN supports transforms
  alt="..."
/>

// Or use a base64 placeholder
<Image
  src={remoteUrl}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..." // 10-20px blurred version
  alt="..."
/>
```

### Phase 3: Implementation Checklist

Run through the codebase and check each item:

**Configuration:**
- [ ] `next.config` has `formats: ["image/avif", "image/webp"]` (AVIF FIRST)
- [ ] `next.config` has `minimumCacheTTL: 31536000` (1 year)
- [ ] `next.config` has `remotePatterns` for ALL external image domains
- [ ] `next.config` has `deviceSizes` array configured

**Components:**
- [ ] All `<img>` tags converted to Next.js `<Image>` (except OG images, emails)
- [ ] All images have `width`/`height` OR `fill` with sized parent
- [ ] All images (except tiny fixed-size) have `sizes` attribute
- [ ] Hero/above-fold images have `priority` prop
- [ ] Logo/nav images use `loading="eager"` and `priority`
- [ ] All images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] Large hero images use `placeholder="blur"`

**Anti-patterns to flag:**
- [ ] No inline base64 images larger than 10KB in source
- [ ] No `<img>` tags for content images (only for OG/email)
- [ ] No missing `sizes` on responsive images
- [ ] No `priority` on below-fold images (defeats lazy loading)

### Phase 4: Advanced Optimizations

#### Create Reusable Image Component (Optional)

```typescript
// components/optimized-image.tsx
import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  alt: string; // Make alt required, not optional
  aspectRatio?: "square" | "video" | "portrait" | "wide";
}

const aspectRatios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

export function OptimizedImage({
  aspectRatio,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  ...props
}: OptimizedImageProps) {
  if (aspectRatio) {
    return (
      <div className={`relative ${aspectRatios[aspectRatio]}`}>
        <Image
          fill
          className={`object-cover ${className ?? ""}`}
          sizes={sizes}
          {...props}
        />
      </div>
    );
  }

  return <Image className={className} sizes={sizes} {...props} />;
}
```

#### Image with Loading State (for better UX)

```typescript
// components/image-with-loading.tsx
"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ImageWithLoading({ className, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      {...props}
      className={cn(
        "transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      onLoad={() => setIsLoaded(true)}
    />
  );
}
```

### Phase 5: Performance Validation

After implementation, verify:

1. **Lighthouse audit**: Images score should be 90+
2. **Network tab**:
   - Check images are served as AVIF (or WebP fallback)
   - Verify correct sizes load per viewport (resize browser to test)
3. **CLS score**: Should be < 0.1
4. **WebPageTest**: Run a test to verify format negotiation

**How to verify AVIF is working:**
1. Open DevTools → Network → filter by "Img"
2. Click an image request
3. Check Response Headers for `content-type: image/avif`
4. If you see `image/webp` or `image/jpeg`, AVIF isn't configured correctly

### Common Mistakes to Avoid

| Mistake | Problem | Fix |
|---------|---------|-----|
| Missing `formats` in config | No AVIF/WebP, serves original format | Add `formats: ["image/avif", "image/webp"]` |
| WebP before AVIF | Larger files served to AVIF-capable browsers | Put AVIF first in array |
| Missing `sizes` | Loads largest image always | Add responsive sizes |
| `fill` without parent dimensions | Layout shift, broken images | Wrap in sized container |
| `priority` on all images | Defeats lazy loading, slow initial load | Only use on above-fold |
| Missing `remotePatterns` | Images fail in production | Whitelist all domains |
| Base64 inlining large images | Bloats HTML/JS bundles | Use external URLs |
| `loading="lazy"` explicit | Redundant, it's the default | Remove the prop |

---

## Quick Audit Commands

```bash
# Find all img tags (should be minimal in Next.js projects)
grep -r "<img " --include="*.tsx" --include="*.jsx" src/

# Find Image components missing sizes prop
grep -rn "from \"next/image\"" --include="*.tsx" -A 30 src/ | grep -B 30 "<Image" | grep -v "sizes="

# Check next.config for AVIF
grep -A 5 "formats" next.config.ts

# Find large inline base64 images (>1KB suggests too large)
grep -r "data:image" --include="*.tsx" src/ | awk 'length > 1000'

# Find all priority images (review if they're truly above-fold)
grep -rn "priority" --include="*.tsx" src/ | grep -i image
```

---

## Summary Checklist for Quick Audits

```
□ AVIF enabled and FIRST in formats array
□ WebP as fallback (second in formats)
□ 1-year cache TTL configured
□ All external domains in remotePatterns
□ All images use Next.js <Image> component
□ All images have width/height or fill+container
□ All responsive images have sizes attribute
□ Only above-fold images have priority
□ All images have alt text
□ No large base64 inlined images
```
