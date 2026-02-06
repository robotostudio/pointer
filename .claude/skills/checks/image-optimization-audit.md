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
  minimumCacheTTL: 31_536_000,

  // RECOMMENDED: Responsive device sizes
  deviceSizes: [640, 828, 1080, 1440, 1920, 2560, 3840],

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

#### Rule 1: Prevent CLS with Background Colors + Aspect Ratios

**IMPORTANT:** Do NOT use `placeholder="blur"` with remote images - it requires fetching and processing images at runtime, which causes timeouts and slow page loads. Instead, use background colors:

```typescript
// GOOD - Background color shows immediately, no async fetching
<div className="relative aspect-video bg-muted/50">
  <Image src={src} fill alt="..." className="object-cover" />
</div>

// BAD - Causes timeouts, requires async components, slow
<Image
  src={remoteUrl}
  placeholder="blur"
  blurDataURL={await fetchBlurData(remoteUrl)} // DON'T DO THIS
  alt="..."
/>
```

**Aspect ratio container pattern:**
```typescript
const aspectClass = {
  video: "aspect-video",      // 16:9
  square: "aspect-square",    // 1:1
  portrait: "aspect-[3/4]",   // 3:4
  wide: "aspect-[21/9]",      // 21:9
}[aspectRatio];

<div className={cn("relative w-full bg-muted/50", aspectClass)}>
  <Image fill sizes="100vw" src={src} alt="..." className="object-cover" />
</div>
```

**Why this works:**
- Background color shows immediately (no fetch)
- Fixed aspect ratio reserves exact space
- Zero CLS when image loads
- No async components needed
- Works with Server Components

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
| Card in grid (with max) | `(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw` |
| Fixed sidebar image | `300px` |
| Avatar/icon | `48px` or actual pixel size |
| Feature media (2/3 width) | `(max-width: 1024px) 100vw, 66vw` |

#### Rule 3: Strategic Loading Priority

```typescript
// PRIORITY: Above-the-fold critical images (hero, main feature)
<Image src={heroImage} priority alt="Hero" />

// LAZY (default): Below-fold content - cards, galleries, body images
<Image src={cardImage} alt="Card" /> // lazy is default, don't add loading="lazy"

// LOGO/NAV: Critical UI chrome that must render immediately
<Image
  src="/logo.svg"
  width={20}
  height={20}
  loading="eager"
  decoding="sync"
  priority
  alt="Logo"
/>
```

**Loading strategy by component type:**

| Component | Loading | Priority | Decoding |
|-----------|---------|----------|----------|
| Hero background | - | `priority` | - |
| Hero window/feature | - | `priority` | - |
| Logo in navbar | `eager` | `priority` | `sync` |
| Feature cards | default (lazy) | - | - |
| Testimonial avatars | default (lazy) | - | - |
| Gallery images | default (lazy) | - | - |
| Below-fold content | default (lazy) | - | - |

#### Rule 4: Always Include Alt Text
```typescript
// Decorative images (backgrounds, purely visual)
<Image src={bg} alt="" role="presentation" />

// Content images - be descriptive
<Image src={product} alt="Red Nike Air Max 90 sneaker, side view" />

// Avatar with person's name
<Image src={avatar} alt={authorName} />

// Never skip alt - screen readers and SEO need it
```

#### Rule 5: Fixed-Size Images Need Explicit Sizes

For small, fixed-size images (logos, icons, avatars), use the actual pixel size:

```typescript
// Logo - fixed 120px width
<Image
  src={logo}
  width={120}
  height={40}
  sizes="120px"
  alt={companyName}
/>

// Avatar - fixed 40px
<div className="relative size-10 bg-muted/50">
  <Image fill sizes="40px" src={avatar} alt={name} />
</div>
```

### Phase 3: Implementation Checklist

**Configuration:**
- [ ] `next.config` has `formats: ["image/avif", "image/webp"]` (AVIF FIRST)
- [ ] `next.config` has `minimumCacheTTL: 31_536_000` (1 year)
- [ ] `next.config` has `remotePatterns` for ALL external image domains
- [ ] `next.config` has `deviceSizes` array configured

**Components:**
- [ ] All `<img>` tags converted to Next.js `<Image>` (except OG images, emails)
- [ ] All images have `width`/`height` OR `fill` with sized parent
- [ ] All `fill` images have parent with `relative` + aspect ratio + background color
- [ ] All images (except tiny fixed-size) have `sizes` attribute
- [ ] Hero/above-fold images have `priority` prop
- [ ] Logo/nav images use `loading="eager"`, `decoding="sync"`, and `priority`
- [ ] All images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] NO `placeholder="blur"` on remote images (causes timeouts)

**Anti-patterns to remove:**
- [ ] No `placeholder="blur"` with remote URLs (use bg color instead)
- [ ] No async components just for blur data fetching
- [ ] No inline base64 images larger than 10KB in source
- [ ] No `<img>` tags for content images (only for OG/email)
- [ ] No missing `sizes` on responsive images
- [ ] No `priority` on below-fold images (defeats lazy loading)
- [ ] No `loading="lazy"` explicit (it's the default)

### Phase 4: Component Patterns

#### Fill Image with CLS Prevention

```typescript
interface MediaContainerProps {
  src: string;
  alt: string;
  aspectRatio?: "video" | "square" | "portrait";
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function MediaContainer({
  src,
  alt,
  aspectRatio = "video",
  priority = false,
  sizes = "100vw",
  className,
}: MediaContainerProps) {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/50",
        aspectClasses[aspectRatio],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
```

#### Avatar Component

```typescript
interface AvatarImageProps {
  src: string;
  name: string;
  size?: number;
}

export function AvatarImage({ src, name, size = 40 }: AvatarImageProps) {
  return (
    <div
      className="relative overflow-hidden rounded-full border bg-muted/50"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={name}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  );
}
```

#### Logo Component (Critical Path)

```typescript
export function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="Company Logo"
      width={20}
      height={20}
      loading="eager"
      decoding="sync"
      priority
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
4. **No console errors**: No "blocking route" or timeout errors

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
| `placeholder="blur"` on remote images | Requires async fetching, causes timeouts | Use `bg-muted/50` background color |
| Missing `sizes` | Loads largest image always | Add responsive sizes |
| `fill` without parent dimensions | Layout shift, broken images | Wrap in sized container with bg color |
| `priority` on all images | Defeats lazy loading, slow initial load | Only use on above-fold |
| Missing `remotePatterns` | Images fail in production | Whitelist all domains |
| Async components for blur | Causes "blocking route" errors in Next.js | Remove async, use bg color |
| `loading="lazy"` explicit | Redundant, it's the default | Remove the prop |
| Missing logo optimization | Logo loads slowly, flickers | Add `priority`, `eager`, `decoding="sync"` |

---

## Quick Audit Commands

```bash
# Find all img tags (should be minimal in Next.js projects)
grep -r "<img " --include="*.tsx" --include="*.jsx" src/ components/

# Find Image components missing sizes prop
grep -rn "from \"next/image\"" --include="*.tsx" -A 30 | grep -B 30 "<Image" | grep -v "sizes="

# Check next.config for AVIF
grep -A 5 "formats" next.config.ts next.config.js

# Find placeholder="blur" usage (should avoid for remote images)
grep -rn "placeholder=" --include="*.tsx" | grep blur

# Find async image components (potential issues)
grep -rn "async function.*Image\|async function.*Media" --include="*.tsx"

# Find large inline base64 images (>1KB suggests too large)
grep -r "data:image" --include="*.tsx" | awk 'length > 1000'

# Find all priority images (review if they're truly above-fold)
grep -rn "priority" --include="*.tsx" | grep -i image
```

---

## Summary Checklist for Quick Audits

```
□ AVIF enabled and FIRST in formats array
□ WebP as fallback (second in formats)
□ 1-year cache TTL configured
□ All external domains in remotePatterns
□ All images use Next.js <Image> component
□ All fill images have: relative parent + aspect ratio + bg color
□ All responsive images have sizes attribute
□ Only above-fold images have priority
□ Logo has priority + eager + decoding="sync"
□ All images have alt text
□ NO placeholder="blur" on remote images
□ NO async components for image loading
```
