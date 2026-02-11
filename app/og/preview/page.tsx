import { getBlogPosts } from "@/app/blog/utils";
import { baseUrl } from "@/app/sitemap";
import { getAllPages } from "@/lib/content-service";

interface OgEntry {
  label: string;
  route: string;
  ogUrl: string;
}

function buildOgUrl(title: string, description?: string): string {
  const params = new URLSearchParams({ title });
  if (description) {
    params.set("description", description);
  }
  return `${baseUrl}/og?${params.toString()}`;
}

function getOgEntries(): OgEntry[] {
  const pages = getAllPages();
  const posts = getBlogPosts();

  const entries: OgEntry[] = [
    {
      label: "Home",
      route: "/",
      ogUrl: buildOgUrl(
        "The AI-Powered Code Editor for Productive Teams",
        "Build faster with intelligent code completion, real-time collaboration, and seamless AI integration."
      ),
    },
    {
      label: "Blog Index",
      route: "/blog",
      ogUrl: buildOgUrl(
        "Blog",
        "Insights on AI-powered development, productivity, and the future of coding."
      ),
    },
  ];

  for (const page of pages) {
    const title = page.metadata.title ?? "Untitled";
    entries.push({
      label: title,
      route: page.path,
      ogUrl:
        page.metadata.image || buildOgUrl(title, page.metadata.description),
    });
  }

  for (const post of posts) {
    const title = post.metadata.title;
    entries.push({
      label: title,
      route: `/blog/${post.slug}`,
      ogUrl: post.metadata.image || buildOgUrl(title, post.metadata.summary),
    });
  }

  return entries;
}

export default function OgPreviewPage() {
  const entries = getOgEntries();

  return (
    <div className="min-h-dvh bg-background font-gothic text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 border-border border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between py-5">
          <div className="flex flex-col gap-1">
            <h1 className="font-medium text-base tracking-tight">
              OG Image Preview
            </h1>
            <p className="text-muted-foreground text-sm">
              {entries.length} routes generating Open Graph images
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="container grid grid-cols-1 gap-10 pt-8 pb-20 md:grid-cols-2 md:gap-8">
        {entries.map((entry) => (
          <div key={entry.route}>
            {/* Route info */}
            <div className="mb-2 flex items-baseline gap-2">
              <span className="truncate font-medium text-foreground text-sm">
                {entry.label}
              </span>
              <span className="shrink-0 font-mono text-muted-foreground text-xs">
                {entry.route}
              </span>
            </div>

            {/* OG Image */}
            <div className="relative aspect-1200/630 overflow-hidden rounded-lg border border-border bg-muted">
              {/* biome-ignore lint/performance/noImgElement: OG preview renders external endpoint */}
              <img
                alt={`OG preview for ${entry.route}`}
                className="absolute inset-0 block size-full object-cover"
                height={630}
                loading="lazy"
                src={entry.ogUrl}
                width={1200}
              />
            </div>

            {/* URL bar */}
            <p className="mt-1.5 truncate font-mono text-muted-foreground/50 text-xs">
              {entry.ogUrl}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
