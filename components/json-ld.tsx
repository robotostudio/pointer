import { baseUrl } from "@/app/sitemap";

interface CollectionPageProps {
  title: string;
  description: string;
  url: string;
  items: { title: string; url: string }[];
}

interface ArticleProps {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author?: string;
}

interface CombinedJsonLdProps {
  baseUrl: string;
  collectionPage?: CollectionPageProps;
  article?: ArticleProps;
}

function buildCollectionPageSchema(props: CollectionPageProps) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: props.title,
    description: props.description,
    url: props.url,
    publisher: {
      "@type": "Organization",
      name: "Pointer",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: props.items.length,
      itemListElement: props.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: item.url,
      })),
    },
  };
}

function buildArticleSchema(props: ArticleProps, baseUrl: string) {
  const image =
    props.image ?? `${baseUrl}/og?title=${encodeURIComponent(props.headline)}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: props.headline,
    datePublished: props.datePublished,
    dateModified: props.dateModified ?? props.datePublished,
    description: props.description,
    image,
    url: props.url,
    author: {
      "@type": "Person",
      name: props.author ?? "Pointer Team",
    },
  };
}

export function CombinedJsonLd({
  collectionPage,
  article,
}: CombinedJsonLdProps) {
  const schemas: Record<string, unknown>[] = [];

  if (collectionPage) {
    schemas.push(buildCollectionPageSchema(collectionPage));
  }

  if (article) {
    schemas.push(buildArticleSchema(article, baseUrl));
  }

  if (schemas.length === 0) {
    return null;
  }

  const jsonLd = schemas.length === 1 ? schemas[0] : schemas;

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe — static JSON-LD for SEO structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
}
