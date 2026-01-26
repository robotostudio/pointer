import { formatDate, getBlogPosts } from "app/blog/utils";
import Link from "next/link";

export function BlogPosts() {
  const posts = getBlogPosts(); // Already sorted by date in utils

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link
          className="group -mx-4 block rounded-lg px-4 py-3 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
          href={`/blog/${post.slug}`}
          key={post.slug}
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline">
            <time
              className="shrink-0 text-neutral-600 text-sm tabular-nums md:w-32 dark:text-neutral-400"
              dateTime={post.metadata.publishedAt}
            >
              {formatDate(post.metadata.publishedAt)}
            </time>
            <div className="flex-1">
              <h2 className="font-medium text-lg text-neutral-900 transition group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
                {post.metadata.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-neutral-600 text-sm dark:text-neutral-400">
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
