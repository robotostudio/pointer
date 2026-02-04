import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pointer - MDX CMS Portfolio Platform",
    short_name: "Pointer",
    description:
      "A Next.js portfolio and content platform using file-based MDX content management. Content is just code - no CMS, no database, everything in git.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#171717",
    scope: "/",
    lang: "en",
    dir: "ltr",
    categories: ["business", "productivity", "developer", "technology"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Blog",
        short_name: "Blog",
        description: "Read our latest posts",
        url: "/blog",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
  };
}
