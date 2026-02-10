"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { YearBadge } from "@/components/year-badge";

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="10"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="16"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { name: "Features", href: "/features" },
      { name: "Enterprise", href: "/enterprise" },
      { name: "Web Agents", href: "/web-agents" },
      { name: "Bugbot", href: "/bugbot" },
      { name: "CLI", href: "/cli" },
      { name: "Pricing", href: "/pricing" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Download", href: "/download" },
      { name: "Changelog", href: "/changelog" },
      { name: "Docs", href: "https://docs.example.com", external: true },
      { name: "Learn", href: "https://learn.example.com", external: true },
      { name: "Forum", href: "https://forum.example.com", external: true },
      { name: "Status", href: "https://status.example.com", external: true },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Community", href: "/community" },
      { name: "Workshops", href: "/workshops" },
      { name: "Students", href: "/students" },
      { name: "Brand", href: "/brand" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Data Use", href: "/data-use" },
      { name: "Security", href: "/security" },
    ],
  },
  connect: {
    title: "Connect",
    links: [
      { name: "X", href: "https://x.com", external: true },
      { name: "LinkedIn", href: "https://linkedin.com", external: true },
      { name: "YouTube", href: "https://youtube.com", external: true },
    ],
  },
};

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-muted-foreground text-xs">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              className="inline-flex items-center gap-1 text-foreground/80 text-sm transition-colors hover:text-foreground"
              href={link.href}
              {...(link.external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              {link.name}
              {link.external && (
                <ExternalLinkIcon className="text-muted-foreground" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-white/5 border-t bg-card py-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
          <FooterLinkGroup
            links={footerLinks.product.links}
            title={footerLinks.product.title}
          />
          <FooterLinkGroup
            links={footerLinks.resources.links}
            title={footerLinks.resources.title}
          />
          <FooterLinkGroup
            links={footerLinks.company.links}
            title={footerLinks.company.title}
          />
          <FooterLinkGroup
            links={footerLinks.legal.links}
            title={footerLinks.legal.title}
          />
          <FooterLinkGroup
            links={footerLinks.connect.links}
            title={footerLinks.connect.title}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-white/5 border-t pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <span>
              © <YearBadge /> Cursor
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-500" />
              SOC 2 Certified
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <GlobeIcon />
              <span>English</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
