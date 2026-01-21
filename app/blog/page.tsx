import { BlogPosts } from "app/components/posts";

export const metadata = {
  title: "Blog",
  description: "Read my thoughts on software development, design, and more.",
};

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-4 font-bold text-4xl tracking-tight">Blog</h1>
      <p className="mb-12 text-neutral-600 text-xl dark:text-neutral-400">
        Thoughts on software development, design, and more.
      </p>
      <BlogPosts />
    </section>
  );
}
