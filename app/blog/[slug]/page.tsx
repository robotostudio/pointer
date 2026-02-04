import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS, formatDate } from "@/app/blog/types";
import { getBlogPosts } from "@/app/blog/utils";
import { baseUrl } from "@/app/sitemap";
import { CustomMDX } from "@/components/mdx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  const allPosts = getBlogPosts();
  const postIndex = allPosts.findIndex((p) => p.slug === slug);
  const post = allPosts[postIndex];

  if (!post) {
    notFound();
  }

  const previousPost =
    postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null;
  const nextPost = postIndex > 0 ? allPosts[postIndex - 1] : null;

  const category = post.metadata.category;
  const categoryLabel = category ? CATEGORY_LABELS[category] : null;

  return (
    <div className="container py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-16 lg:mt-10 lg:h-fit">
          <Breadcrumb>
            <BreadcrumbList className="flex-row items-center gap-1 text-md">
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              {categoryLabel && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{categoryLabel}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </aside>

        <article className="max-w-2xl">
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
            <h1 className="mt-6 mb-2 max-w-lg text-balance font-medium text-4xl tracking-tight">
              {post.metadata.title}
            </h1>
            <p className="text-neutral-600 text-sm dark:text-neutral-400">
              {formatDate(post.metadata.publishedAt)}
            </p>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <CustomMDX source={post.content} />
          </div>

          {(previousPost || nextPost) && (
            <nav className="mt-16 grid gap-4 border-border border-t pt-8 sm:grid-cols-2">
              {previousPost ? (
                <Link
                  className="group flex flex-col rounded-lg border border-border/50 bg-muted/30 px-6 py-4 transition-all hover:border-border hover:bg-muted/50"
                  href={`/blog/${previousPost.slug}`}
                >
                  <span className="flex items-center gap-2 text-muted-foreground text-sm">
                    <svg
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:-translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Previous
                  </span>
                  <span className="line-clamp-1 font-medium text-foreground">
                    {previousPost.metadata.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link
                  className="group flex flex-col items-end rounded-lg border border-border/50 bg-muted/30 px-6 py-4 transition-all hover:border-border hover:bg-muted/50"
                  href={`/blog/${nextPost.slug}`}
                >
                  <span className="flex items-center gap-2 text-muted-foreground text-sm">
                    Next
                    <svg
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="line-clamp-1 font-medium text-foreground">
                    {nextPost.metadata.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </article>
      </div>
    </div>
  );
}
