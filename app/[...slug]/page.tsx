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
  const ogParams = new URLSearchParams({ title: metadata.title });
  if (metadata.description) {
    ogParams.set("description", metadata.description);
  }
  const ogImage = metadata.image || `${baseUrl}/og?${ogParams.toString()}`;

  return {
    alternates: {
      canonical: `${baseUrl}/${urlPath}`,
    },
    authors: metadata.author ? [{ name: metadata.author }] : undefined,
    description: metadata.description,
    openGraph: {
      description: metadata.description,
      images: [{ url: ogImage }],
      title: metadata.title || "Page",
      url: `${baseUrl}/${urlPath}`,
    },
    title: metadata.title,
    twitter: {
      card: "summary_large_image",
      description: metadata.description,
      images: [ogImage],
      title: metadata.title,
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
