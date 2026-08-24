import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogPost } from "@/lib/content-schema";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, DownloadIcon } from "./icons/button-icons";

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
          className="group block cursor-pointer rounded-sm bg-card p-4 transition-all duration-300 hover:bg-card/80 dark:bg-muted/30 dark:hover:bg-muted/50"
          href={`/blog/${post.slug}`}
          key={post.slug}
        >
          <h2 className="type-base">{post.metadata.title}</h2>
          <p className="type-base mt-1 line-clamp-2 text-muted-foreground">
            {post.metadata.summary}
          </p>

          <div className="mt-5 flex items-center gap-2 text-muted-foreground text-sm">
            {post.metadata.category ? (
              <>
                <span className="capitalize">{post.metadata.category}</span>
                <span>·</span>
              </>
            ) : null}
            <time dateTime={post.metadata.publishedAt.toISOString()}>
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
  className?: string;
  title?: string;
}

export function Highlights({
  children,
  className,
  title = "Recent highlights",
}: HighlightsProps) {
  return (
    <section className={cn("py-12 md:py-18", className)}>
      <div className="container grid grid-cols-1 justify-between gap-8 md:grid-cols-3 md:gap-16">
        <div className="md:col-span-1">
          <h2 className="font-medium text-muted-foreground text-xl!">
            {title}
          </h2>
        </div>
        <div className="flex max-w-2xl flex-col gap-4 md:col-span-2">
          {children}
        </div>
      </div>
    </section>
  );
}

interface HighlightItemProps {
  category: string;
  date: string;
  href: string;
  summary: string;
  title: string;
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
  children: React.ReactNode;
  href: string;
  icon?: "download" | "right";
}

export function HighlightsAction({
  href,
  children,
  icon,
}: HighlightsActionProps) {
  let IconComponent: ReactNode = null;
  if (icon === "download") {
    IconComponent = <DownloadIcon className="size-3.5" />;
  } else if (icon === "right") {
    IconComponent = <ArrowRightIcon className="size-4" />;
  }

  return (
    <div className="mt-4">
      <Link
        className="type-sm no-underline! flex items-center gap-1 font-medium text-orange-600 hover:text-orange-700 hover:underline dark:text-orange-500"
        href={href}
      >
        {children}
        {IconComponent}
      </Link>
    </div>
  );
}
