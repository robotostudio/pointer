# CLAUDE.md

Next.js 16 portfolio/content platform with file-based MDX. No CMS, no database - content is code.

## Commands

```bash
pnpm install    # Install dependencies
pnpm dev        # Development server
pnpm build      # Production build
```

**Never run `dev`, `build`, `lint`, `format`, or `typecheck` unless explicitly asked.** Run lint/typecheck on modified files only, not the entire project.

## Content

- **Pages**: MDX files in `content/pages/` → routes to `/*`
- **Blog**: MDX files in `app/blog/posts/` → routes to `/blog/*`

## Conventions

- Code style: `docs/CODE_STYLE.md`
- MDX components: `docs/MDX_COMPONENTS.md`
- Git conventions: `docs/GIT_CONVENTIONS.md`

## Plan Mode

- Keep plans extremely concise; sacrifice grammar for brevity
- End each plan with unresolved questions, if any
