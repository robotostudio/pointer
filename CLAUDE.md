# CLAUDE.md

Next.js 16 portfolio/content platform using file-based MDX. Philosophy: "Content is just code" - no CMS, no database, everything in git.

## Commands

```bash
pnpm install    # Install dependencies
pnpm dev        # Development server
pnpm build      # Production build
```

Never run `pnpm dev` or `pnpm build` unless explicitly asked. Never run linting/type-checking on the entire project - only on modified files.

## Content System

- **Pages**: `content/pages/*.mdx` → Routes to `/*`
- **Blog Posts**: `app/blog/posts/*.mdx` → Routes to `/blog/*`

## Conventions

- For code style conventions, see `.claude/CLAUDE.md`
- For available MDX components, see `docs/MDX_COMPONENTS.md`
- For git conventions, see `docs/GIT_CONVENTIONS.md`


## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.