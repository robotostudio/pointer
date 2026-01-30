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
          className="group block max-w-162.5 rounded-2xl bg-zinc-900/80 p-4 transition-all duration-300 hover:bg-zinc-900"
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
