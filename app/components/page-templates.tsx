import { CustomMDX } from "./mdx";
import type { PageContent, PageMetadata } from "../lib/content-types";

interface PageTemplateProps {
  page: PageContent;
}

interface PageHeaderProps {
  metadata: Partial<PageMetadata>;
}

function PageHeader({ metadata }: PageHeaderProps) {
  if (metadata.showTitle === false) {
    return null;
  }

  return (
    <header className="mb-12">
      {metadata.title && (
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {metadata.title}
        </h1>
      )}
      {metadata.description && (
        <p className="text-xl text-neutral-600 dark:text-neutral-400">
          {metadata.description}
        </p>
      )}
    </header>
  );
}

/**
 * Default page template - single column, standard width
 */
export function DefaultPageTemplate({ page }: PageTemplateProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <PageHeader metadata={page.metadata} />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CustomMDX source={page.content} />
      </div>
    </article>
  );
}

/**
 * Full-width page template - spans entire viewport
 */
export function FullWidthPageTemplate({ page }: PageTemplateProps) {
  return (
    <article className="w-full px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <PageHeader metadata={page.metadata} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CustomMDX source={page.content} />
      </div>
    </article>
  );
}

/**
 * Centered page template - narrow, centered content (good for forms, etc.)
 */
export function CenteredPageTemplate({ page }: PageTemplateProps) {
  return (
    <article className="max-w-2xl mx-auto px-4 py-12">
      <PageHeader metadata={page.metadata} />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CustomMDX source={page.content} />
      </div>
    </article>
  );
}

/**
 * Template selector - chooses the appropriate template based on page metadata
 */
export function PageTemplate({ page }: PageTemplateProps) {
  const layout = page.metadata.layout || "default";

  switch (layout) {
    case "full-width":
      return <FullWidthPageTemplate page={page} />;
    case "centered":
      return <CenteredPageTemplate page={page} />;
    case "default":
    default:
      return <DefaultPageTemplate page={page} />;
  }
}
