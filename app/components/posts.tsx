import Link from "next/link";
import type { BlogPost } from "@/app/blog/utils";
import { formatDate } from "@/app/blog/utils";

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
          className="group relative block overflow-hidden rounded-lg border border-border/50 bg-card/30 transition-all duration-300 hover:border-amber-500/30 hover:bg-card/50"
          href={`/blog/${post.slug}`}
          key={post.slug}
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-amber-500/80 via-amber-600/60 to-amber-700/40 opacity-60 transition-opacity group-hover:opacity-100" />

          <div className="p-5 pl-6">
            <h2 className="font-medium text-foreground text-lg leading-snug tracking-tight transition-colors group-hover:text-amber-100">
              {post.metadata.title}
            </h2>

            <p className="mt-2 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
              {post.metadata.summary}
            </p>

            <div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
              {post.metadata.category && (
                <>
                  <span className="capitalize">{post.metadata.category}</span>
                  <span className="text-border">·</span>
                </>
              )}
              <time dateTime={post.metadata.publishedAt}>
                {formatDate(post.metadata.publishedAt)}
              </time>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
