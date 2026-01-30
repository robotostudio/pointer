"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  type BlogPost,
  CATEGORY_LABELS,
  isValidCategory,
} from "@/app/blog/types";
import { BlogPosts } from "@/components/posts";

interface BlogContentProps {
  allPosts: BlogPost[];
  categories: { id: string; label: string; count: number }[];
}

export function BlogContent({ allPosts, categories }: BlogContentProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const validCategory = isValidCategory(category ?? undefined)
    ? (category as keyof typeof CATEGORY_LABELS)
    : null;

  const posts = validCategory
    ? allPosts.filter((post) => post.metadata.category === validCategory)
    : allPosts;

  return (
    <>
      <header className="relative overflow-hidden">
        <div className="container relative py-12 md:py-32 md:pb-24">
          <h1 className="text-5xl">
            {validCategory ? (
              <Link
                className="text-muted-foreground transition-opacity hover:opacity-70"
                href="/blog"
              >
                Blog
              </Link>
            ) : (
              <span className="text-foreground">Blog</span>
            )}
            {validCategory && (
              <>
                <span className="text-muted-foreground"> / </span>
                <span className="text-foreground">
                  {CATEGORY_LABELS[validCategory]}
                </span>
              </>
            )}
          </h1>
        </div>
      </header>

      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[200px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <nav className="flex flex-col gap-1">
              <Link
                aria-current={validCategory === null ? "page" : undefined}
                className="rounded-md px-3 py-1.5 text-left text-muted-foreground text-sm transition-colors hover:text-foreground active:text-muted-foreground aria-[current=page]:pointer-events-none aria-[current=page]:text-foreground"
                href="/blog"
              >
                All Posts
              </Link>
              {categories.map((cat) => (
                <Link
                  aria-current={validCategory === cat.id ? "page" : undefined}
                  className="rounded-md px-3 py-1.5 text-left text-muted-foreground text-sm transition-colors hover:text-foreground active:text-muted-foreground aria-[current=page]:pointer-events-none aria-[current=page]:text-foreground"
                  href={`/blog?category=${cat.id}`}
                  key={cat.id}
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main>
            <BlogPosts posts={posts} />

            {posts.length > 10 && (
              <div className="mt-12 flex justify-end">
                <Link
                  className="group flex flex-col items-end rounded-lg border border-border/50 bg-card/30 px-6 py-4 transition-all hover:border-amber-500/30 hover:bg-card/50"
                  href={
                    validCategory
                      ? `/blog?category=${validCategory}&page=2`
                      : "/blog?page=2"
                  }
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
                  <span className="font-medium text-foreground">
                    Older posts
                  </span>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
