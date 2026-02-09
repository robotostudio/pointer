import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogContent } from "@/app/blog/blog-content";
import { getBlogCategories, getBlogPosts } from "@/app/blog/utils";
import { baseUrl } from "@/app/sitemap";
import { CombinedJsonLd } from "@/components/json-ld";

const description =
  "Insights on AI-powered development, coding agents, and software engineering from the Pointer team.";

export const metadata: Metadata = {
  title: "Blog",
  description,
};

function BlogSkeleton() {
  return (
    <>
      <header className="relative overflow-hidden">
        <div className="container relative py-12 md:py-32 md:pb-24">
          <h1 className="text-5xl text-foreground">Blog</h1>
        </div>
      </header>

      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[200px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <nav className="flex flex-col gap-1">
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            </nav>
          </aside>

          <main>
            <div className="space-y-8">
              {["skeleton-1", "skeleton-2", "skeleton-3"].map((id) => (
                <div className="space-y-2" key={id}>
                  <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function BlogPage() {
  const allPosts = getBlogPosts();
  const categories = getBlogCategories();

  return (
    <div className="bg-background">
      <CombinedJsonLd
        baseUrl={baseUrl}
        collectionPage={{
          title: "Blog",
          description,
          url: `${baseUrl}/blog`,
          items: allPosts.map((post) => ({
            title: post.metadata.title,
            url: `${baseUrl}/blog/${post.slug}`,
          })),
        }}
      />
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent allPosts={allPosts} categories={categories} />
      </Suspense>
    </div>
  );
}
