import { notFound } from "next/navigation";
import { baseUrl } from "@/app/sitemap";
import { PageTemplate } from "@/components/page-templates";
import { getPageByPath } from "@/lib/content-service";

export async function generateMetadata() {
  const page = getPageByPath("home");

  const title = page?.metadata.title ?? "Pointer MDX CMS Portfolio Platform";
  const description =
    page?.metadata.description ??
    "Pointer: A clean, simple portfolio and content platform. Build beautiful portfolios without complex CMS or databases. Everything is code, in git.";

  return {
    title,
    description,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      images: [{ url: "/og.png", type: "image/png" }],
    },
  };
}

export default function HomePage() {
  const page = getPageByPath("home");

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} />;
}
