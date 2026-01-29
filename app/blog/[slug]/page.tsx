import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate, getBlogPosts } from "@/app/blog/utils";
import { CustomMDX } from "@/app/components/mdx";
import { baseUrl } from "@/app/sitemap";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  const ogImage = image || `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <Its safe, sinces its for SEO purposes JSON-LD>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "My Portfolio",
            },
          }),
        }}
        suppressHydrationWarning
        type="application/ld+json"
      />

      <header className="mb-12">
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          {post.metadata.title}
        </h1>
        <p className="text-neutral-600 text-sm dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CustomMDX source={post.content} />
      </div>
    </article>
  );
}
