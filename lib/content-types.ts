// Content type definitions for type-safe MDX content management

export interface BaseMetadata {
  title: string;
  description?: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  image?: string;
}

export interface PageMetadata extends BaseMetadata {
  showTitle?: boolean;
}

export interface BlogPostMetadata extends BaseMetadata {
  summary: string;
}

export interface ContentItem<T = BaseMetadata> {
  metadata: T;
  slug: string;
  content: string;
  path?: string;
}

export interface PageContent extends ContentItem<PageMetadata> {
  type: "page";
}

export interface PageRoute {
  params: { slug: string[] };
}
