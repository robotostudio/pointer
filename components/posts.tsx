import Link from "next/link";
import type { BlogPost } from "@/app/blog/types";
import { formatDate } from "@/app/blog/types";

interface BlogPostsProps {
  posts: BlogPost[];
}

export function BlogPosts({ posts }: BlogPostsProps) {
  if (posts.length === 0) {
    return <p className="text-muted-foreground">No blog posts yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <Link
          className="group block cursor-pointer rounded-2xl bg-muted/30 p-4 transition-all duration-300 hover:bg-muted/60 dark:bg-muted/30 dark:hover:bg-muted/50"
          href={`/blog/${post.slug}`}
          key={post.slug}
        >
          <h2 className="type-base">{post.metadata.title}</h2>
          <p className="type-base mt-1 line-clamp-2 text-muted-foreground">
            {post.metadata.summary}
          </p>

          <div className="mt-5 flex items-center gap-2 text-muted-foreground text-sm">
            {post.metadata.category && (
              <>
                <span className="capitalize">{post.metadata.category}</span>
                <span>·</span>
              </>
            )}
            <time dateTime={post.metadata.publishedAt}>
              {formatDate(post.metadata.publishedAt)}
            </time>
          </div>
        </Link>
      ))}
    </div>
  );
}

interface HighlightsProps {
  children: React.ReactNode;
  title?: string;
}

export function Highlights({
  children,
  title = "Recent highlights",
}: HighlightsProps) {
  return (
    <section className="my-16! grid w-full grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <h2 className="font-medium text-muted-foreground text-xl!">{title}</h2>
      </div>
      <div className="flex max-w-2xl! flex-col gap-4 md:col-span-2">
        {children}
      </div>
    </section>
  );
}

interface HighlightItemProps {
  title: string;
  summary: string;
  category: string;
  date: string;
  href: string;
}

export function HighlightItem({
  title,
  summary,
  category,
  date,
  href,
}: HighlightItemProps) {
  return (
    <Link
      className="group no-underline! block rounded-lg border border-muted/40 bg-muted/30 p-6 transition-colors hover:bg-muted/20"
      href={href}
    >
      <h3 className="mb-1 font-medium text-lg!">{title}</h3>
      <p className="mb-4 line-clamp-2 text-muted-foreground text-sm!">
        {summary}
      </p>
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <span className="capitalize">{category}</span>
        <span>·</span>
        <time>{date}</time>
      </div>
    </Link>
  );
}

interface HighlightsActionProps {
  href: string;
  children: React.ReactNode;
}

export function HighlightsAction({ href, children }: HighlightsActionProps) {
  return (
    <div className="mt-4">
      <Link
        className="type-sm no-underline! font-medium text-orange-600 hover:text-orange-700 hover:underline dark:text-orange-500"
        href={href}
      >
        {children}
      </Link>
    </div>
  );
}
