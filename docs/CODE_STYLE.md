# Code Style

Uses **Ultracite** (Biome-based) for linting/formatting. Run `pnpm dlx ultracite fix` before committing.

## Project Rules

- **Tailwind**: Use `size-*` when height and width are equal. Use `cn()` from `@/lib/utils` for conditional classes.
- **Imports**: Always use `@/` path alias (absolute imports).
- **Comments**: Avoid unnecessary comments. Code should be self-documenting.
- **Images**: Use Next.js `<Image>` component.
- **React 19**: Use ref as a prop, not `forwardRef`.
