import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageTemplate } from "../components/page-templates";
import {
  getPageByPath,
  getAllPagePaths,
} from "../lib/content-service";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

/**
 * Generate static params for all pages
 */
export async function generateStaticParams() {
  const paths = getAllPagePaths();

  return paths.map((path) => ({
    slug: path.split("/"),
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slugParams = await params;
  const urlPath = slugParams.slug.join("/");
  const page = getPageByPath(urlPath);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  const { metadata } = page;

  return {
    title: metadata.title,
    description: metadata.description,
    authors: metadata.author
      ? [{ name: metadata.author }]
      : undefined,
    openGraph: {
      title: metadata.title || "Page",
      description: metadata.description,
      images: metadata.image ? [metadata.image] : undefined,
    },
  };
}

/**
 * Dynamic page component
 */
export default async function Page({ params }: PageProps) {
  const slugParams = await params;
  const urlPath = slugParams.slug.join("/");
  const page = getPageByPath(urlPath);

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} />;
}
