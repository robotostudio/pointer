import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { baseUrl } from "@/app/sitemap";
import { PageTemplate } from "@/components/page-templates";
import { getAllPagePaths, getPageByPath } from "@/lib/content-service";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const paths = getAllPagePaths();

  return paths.map((path) => ({
    slug: path.split("/"),
  }));
}

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
  const ogImage =
    metadata.image ||
    `${baseUrl}/og?title=${encodeURIComponent(metadata.title)}`;

  return {
    title: metadata.title,
    description: metadata.description,
    authors: metadata.author ? [{ name: metadata.author }] : undefined,
    alternates: {
      canonical: `${baseUrl}/${urlPath}`,
    },
    openGraph: {
      title: metadata.title || "Page",
      description: metadata.description,
      url: `${baseUrl}/${urlPath}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const slugParams = await params;
  const urlPath = slugParams.slug.join("/");
  const page = getPageByPath(urlPath);

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} />;
}
