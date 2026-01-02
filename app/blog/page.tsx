import { BlogPosts } from "app/components/posts";

export const metadata = {
  title: "Blog",
  description:
    "Read my thoughts on software development, design, and more.",
};

export default function BlogPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
      <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-12">
        Thoughts on software development, design, and more.
      </p>
      <BlogPosts />
    </section>
  );
}
