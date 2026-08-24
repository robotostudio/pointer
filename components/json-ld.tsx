interface CollectionPageProps {
  description: string;
  items: { title: string; url: string }[];
  title: string;
  url: string;
}

interface ArticleProps {
  author?: string;
  dateModified?: string;
  datePublished: string;
  description: string;
  headline: string;
  image?: string;
  url: string;
}

interface CombinedJsonLdProps {
  article?: ArticleProps;
  baseUrl: string;
  collectionPage?: CollectionPageProps;
}

function buildCollectionPageSchema(props: CollectionPageProps) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    description: props.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: props.items.map((item, index) => ({
        "@type": "ListItem",
        name: item.title,
        position: index + 1,
        url: item.url,
      })),
      numberOfItems: props.items.length,
    },
    name: props.title,
    publisher: {
      "@type": "Organization",
      name: "Pointer",
    },
    url: props.url,
  };
}

function buildArticleSchema(props: ArticleProps, baseUrl: string) {
  const ogParams = new URLSearchParams({ title: props.headline });
  if (props.description) {
    ogParams.set("description", props.description);
  }
  const image = props.image ?? `${baseUrl}/og?${ogParams.toString()}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@type": "Person",
      name: props.author ?? "Pointer Team",
    },
    dateModified: props.dateModified ?? props.datePublished,
    datePublished: props.datePublished,
    description: props.description,
    headline: props.headline,
    image,
    url: props.url,
  };
}

export function CombinedJsonLd({
  baseUrl,
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
