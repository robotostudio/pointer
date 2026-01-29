import { getBlogCategories, getBlogPosts } from "@/app/blog/utils";
import { BlogPosts } from "@/app/components/posts";

export const metadata = {
  title: "Blog",
  description: "Read my thoughts on software development, design, and more.",
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const categories = getBlogCategories();

  return (
    <div className="min-h-dvh bg-background">
      <header className="relative overflow-hidden border-border/50 border-b">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        <div className="container relative py-16 md:py-24">
          <h1 className="text-5xl text-foreground">Blog</h1>
        </div>
      </header>

      <div className="container py-12">
        <div className="grid gap-12 lg:grid-cols-[200px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <nav className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-1">
              <button
                className="rounded-md px-3 py-1.5 text-left text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground data-[active=true]:text-foreground"
                data-active={true}
                type="button"
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  className="rounded-md px-3 py-1.5 text-left text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground data-[active=true]:text-foreground"
                  key={category.id}
                  type="button"
                >
                  {category.label}
                </button>
              ))}
            </nav>
          </aside>

          <main>
            <BlogPosts posts={posts} />

            {posts.length > 10 && (
              <div className="mt-12 flex justify-end">
                <a
                  className="group flex flex-col items-end rounded-lg border border-border/50 bg-card/30 px-6 py-4 transition-all hover:border-amber-500/30 hover:bg-card/50"
                  href="/blog?page=2"
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
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
