import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#ffffff",
    categories: ["business", "productivity", "developer", "technology"],
    description:
      "Pointer: A clean, simple portfolio and content platform. Build beautiful portfolios without complex CMS or databases. Everything is code, in git.",
    dir: "ltr",
    display: "standalone",
    icons: [
      {
        purpose: "any",
        sizes: "192x192",
        src: "/icon-192.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "/icon-512.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/icon-512.png",
        type: "image/png",
      },
    ],
    lang: "en",
    name: "Pointer - MDX CMS Platform",
    orientation: "portrait-primary",
    scope: "/",
    short_name: "Pointer",
    shortcuts: [
      {
        description: "Read our latest posts",
        icons: [
          {
            sizes: "192x192",
            src: "/icon-192.png",
            type: "image/png",
          },
        ],
        name: "Blog",
        short_name: "Blog",
        url: "/blog",
      },
    ],
    start_url: "/",
    theme_color: "#171717",
  };
}
