import type { PageContent, PageMetadata } from "@/lib/content-schema";
import { CustomMDX } from "./mdx";

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
      {metadata.title ? (
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          {metadata.title}
        </h1>
      ) : null}
      {metadata.description ? (
        <p className="text-neutral-600 text-xl dark:text-neutral-400">
          {metadata.description}
        </p>
      ) : null}
    </header>
  );
}

/**
 * Default page template - single column, standard width
 */
export function DefaultPageTemplate({ page }: PageTemplateProps) {
  return (
    <article className="">
      <PageHeader metadata={page.metadata} />

      <CustomMDX source={page.content} />
    </article>
  );
}

/**
 * Template selector - chooses the appropriate template based on page metadata
 */
export function PageTemplate({ page }: PageTemplateProps) {
  return <DefaultPageTemplate page={page} />;
}
