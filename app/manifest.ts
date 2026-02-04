import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pointer - MDX CMS Platform",
    short_name: "Pointer",
    description:
      "Pointer: A clean, simple portfolio and content platform. Build beautiful portfolios without complex CMS or databases. Everything is code, in git.",
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
