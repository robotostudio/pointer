import { CustomMDX } from "./mdx";

interface ContentSectionProps {
  content: string;
  metadata?: {
    title?: string;
    section?: string;
    [key: string]: any;
  };
}

export function ContentSection({
  content,
  metadata,
}: ContentSectionProps) {
  return (
    <section className="mb-16">
      {metadata?.title && (
        <h2 className="text-2xl font-bold mb-6">{metadata.title}</h2>
      )}
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <CustomMDX source={content} />
      </article>
    </section>
  );
}

export function HeroSection({
  content,
  metadata,
}: ContentSectionProps) {
  return (
    <section className="mb-20">
      <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-center prose-p:text-center">
        <CustomMDX source={content} />
      </article>
      <div className="flex justify-center gap-4 mt-8">
        <button className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black rounded-lg font-semibold hover:opacity-90 transition">
          Download for macOS
        </button>
        <button className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
          Try mobile agent →
        </button>
      </div>
    </section>
  );
}

export function FeaturesSection({
  content,
  metadata,
}: ContentSectionProps) {
  return (
    <section className="mb-20">
      {metadata?.title && (
        <h2 className="text-3xl font-bold text-center mb-12">
          {metadata.title}
        </h2>
      )}
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <CustomMDX source={content} />
      </article>
    </section>
  );
}

export function TestimonialsSection({
  content,
  metadata,
}: ContentSectionProps) {
  return (
    <section className="mb-20 bg-neutral-50 dark:bg-neutral-900 -mx-8 px-8 py-16 rounded-lg">
      {metadata?.title && (
        <h2 className="text-3xl font-bold text-center mb-12">
          {metadata.title}
        </h2>
      )}
      <article className="prose prose-neutral dark:prose-invert max-w-none prose-blockquote:border-l-4 prose-blockquote:border-neutral-300 dark:prose-blockquote:border-neutral-700">
        <CustomMDX source={content} />
      </article>
    </section>
  );
}

export function ChangelogSection({
  content,
  metadata,
}: ContentSectionProps) {
  return (
    <section className="mb-20">
      {metadata?.title && (
        <h2 className="text-3xl font-bold mb-8">{metadata.title}</h2>
      )}
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <CustomMDX source={content} />
      </article>
    </section>
  );
}
