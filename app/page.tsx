import { notFound } from "next/navigation";
import { baseUrl } from "@/app/sitemap";
import { PageTemplate } from "@/components/page-templates";
import { getPageByPath } from "@/lib/content-service";

export async function generateMetadata() {
  const page = getPageByPath("home");

  const title = page?.metadata.title ?? "Pointer";
  const description =
    page?.metadata.description ??
    "A Next.js portfolio and content platform using file-based MDX content management.";

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
