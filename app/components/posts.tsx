import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

export function BlogPosts() {
  const posts = getBlogPosts(); // Already sorted by date in utils

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link
          key={post.slug}
          className="block group hover:bg-neutral-50 dark:hover:bg-neutral-900 -mx-4 px-4 py-3 rounded-lg transition"
          href={`/blog/${post.slug}`}
        >
          <div className="flex flex-col md:flex-row md:items-baseline gap-2">
            <time
              className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums md:w-32 shrink-0"
              dateTime={post.metadata.publishedAt}
            >
              {formatDate(post.metadata.publishedAt)}
            </time>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {post.metadata.title}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                {post.metadata.summary}
              </p>
            </div>
          </div>
        </Link>
      ))}

      {posts.length === 0 && (
        <p className="text-neutral-600 dark:text-neutral-400">
          No blog posts yet.
        </p>
      )}
    </div>
  );
}
