import "@/app/global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import Footer from "../components/footer";
import { Navbar } from "../components/nav";
import { baseUrl } from "./sitemap";

const cursorGothic = localFont({
  display: "swap",
  src: [
    {
      path: "../fonts/CursorGothic-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../fonts/CursorGothic-Bold.woff2",
      style: "normal",
      weight: "700",
    },
  ],
  variable: "--font-cursor-gothic",
});

const jetBrainsMono = localFont({
  display: "swap",
  src: "../fonts/JetBrainsMono-Regular.woff2",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  description:
    "Pointer: A clean, simple portfolio and content platform. Build beautiful portfolios without complex CMS or databases. Everything is code, in git.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    description:
      "Pointer: A clean, simple portfolio and content platform. Build beautiful portfolios without complex CMS or databases. Everything is code, in git.",
    locale: "en_US",
    siteName: "Pointer",
    title: "Pointer",
    type: "website",
    url: baseUrl,
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: "Pointer",
    template: "%s | Pointer MDX CMS Portfolio Platform",
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
        cursorGothic.variable,
        jetBrainsMono.variable
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <main className="flex min-h-dvh flex-col">
            <Navbar />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
