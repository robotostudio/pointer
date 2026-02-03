# Git Conventions

## Commit Messages

Semantic prefixes, short and concise. Wrap code/component names in backticks.

```
feat: add `Button` component
fix: resolve `ContentService` caching issue
style: fix mobile overflow for code-block
refactor: simplify `getPageByPath` logic
docs: add API documentation
chore: update dependencies
```

## Branch Names

Semantic prefixes with kebab-case:

```
feat/add-button-component
fix/content-service-cache
chore/update-dependencies
```

## PR Titles

Same as commit messages - semantic prefix, concise, backticks for code.

## PR Descriptions

Keep concise with a summary section only. Never include a "Test plan" section unless explicitly requested.

```markdown
## Summary
- Brief bullet points describing the changes
- Focus on what and why
```
