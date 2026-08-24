"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BlogPosts } from "@/components/posts";
import {
  type BlogPost,
  CATEGORY_LABELS,
  isValidCategory,
} from "@/lib/content-schema";

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
            {validCategory ? (
              <>
                <span className="text-muted-foreground"> / </span>
                <span className="text-foreground">
                  {CATEGORY_LABELS[validCategory]}
                </span>
              </>
            ) : null}
          </h1>
        </div>
      </header>

      <div className="container mb-5 md:mb-10">
        <div className="grid gap-12 lg:grid-cols-[200px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <nav className="flex flex-col gap-1">
              <Link
                aria-current={validCategory === null ? "page" : undefined}
                className="rounded-md px-3 py-1.5 text-left text-md text-muted-foreground transition-colors hover:text-foreground active:text-muted-foreground aria-[current=page]:pointer-events-none aria-[current=page]:text-foreground"
                href="/blog"
              >
                All Posts
              </Link>
              {categories.map((cat) => (
                <Link
                  aria-current={validCategory === cat.id ? "page" : undefined}
                  className="rounded-md px-3 py-1.5 text-left text-md text-muted-foreground transition-colors hover:text-foreground active:text-muted-foreground aria-[current=page]:pointer-events-none aria-[current=page]:text-foreground"
                  href={`/blog?category=${cat.id}`}
                  key={cat.id}
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="lg:max-w-2xl">
            <BlogPosts posts={posts} />
          </main>
        </div>
      </div>
    </>
  );
}
