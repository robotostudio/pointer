import "./global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";

const cursorGothic = localFont({
  src: [
    {
      path: "../fonts/CursorGothic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/CursorGothic-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    
  ],
  variable: "--font-cursor-gothic",
  display: "swap",
});

import { cn } from "@/app/lib/util";
import Footer from "./components/footer";
import { Navbar } from "./components/nav";
import { baseUrl } from "./sitemap";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Next.js Portfolio Starter",
    template: "%s | Next.js Portfolio Starter",
  },
  description: "This is my portfolio.",
  openGraph: {
    title: "My Portfolio",
    description: "This is my portfolio.",
    url: baseUrl,
    siteName: "My Portfolio",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={cn(
        "bg-background text-foreground",
                cursorGothic.variable
      )}
      lang="en"
    >
      <body className="antialiased">
        <main className="flex min-h-dvh flex-col">
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
}
