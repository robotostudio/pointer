import Image from "next/image";
import Link from "next/link";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import React from "react";
import { CodeBlockEnhancer } from "@/components/code-block";
import { CodeTabsEnhancer } from "@/components/code-tabs";
import {
  Changelog,
  ChangelogAction,
  ChangelogCard,
  ChangelogContent,
  ChangelogHeader,
} from "./changelog";
import { CTA, CTAButton, CTATitle } from "./cta";
import {
  Button,
  Callout,
  CardGrid,
  FeatureCard,
  Testimonial,
} from "./custom-mdx-components";
import {
  EnterpriseFeature,
  EnterpriseFeatureContent,
  EnterpriseFeatureDescription,
  EnterpriseFeatureMedia,
  EnterpriseFeatureTestimonial,
  EnterpriseFeatureTitle,
} from "./enterprise-feature";
import { FAQ, FAQItem } from "./faq";
import {
  Feature,
  FeatureActions,
  FeatureButton,
  FeatureContent,
  FeatureDescription,
  FeatureMedia,
  FeatureTitle,
} from "./feature";
import {
  Hero,
  HeroActions,
  HeroBackdrop,
  HeroButton,
  HeroDescription,
  HeroLabel,
  HeroMedia,
  HeroTitle,
} from "./hero";
import {
  HighlightCard,
  HighlightCardAction,
  HighlightCardDescription,
  HighlightCardGrid,
  HighlightCardImage,
  HighlightCardTitle,
} from "./highlight-card";
import { LogoCloud, LogoCloudItem } from "./logo-cloud";
import { HighlightItem, Highlights, HighlightsAction } from "./posts";
import {
  PricingAction,
  PricingCard,
  PricingDescription,
  PricingFeature,
  PricingFeatures,
  PricingGrid,
  PricingHero,
} from "./pricing";
import {
  SecurityActions,
  SecurityGrid,
  SecurityItem,
  SecuritySection,
} from "./security-features";
import { StatsGrid, StatsItem, StatsSection } from "./stats-section";
import { TestimonialCard, TestimonialGrid } from "./testimonials";

interface TableProps {
  data: {
    headers: string[];
    rows: string[][];
  };
}

function Table({ data }: TableProps) {
  return (
    <table>
      <thead>
        <tr>
          {data.headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row) => (
          <tr key={row.join("-")}>
            {row.map((cell) => (
              <td key={cell}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
}

function CustomLink({ href, children, ...props }: LinkProps) {
  if (!href) {
    return <a {...props}>{children}</a>;
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
      {children}
    </a>
  );
}

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

function RoundedImage({ alt, ...props }: ImageProps) {
  return <Image alt={alt} className="rounded-lg" {...props} />;
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, "-")
    .replaceAll("&", "-and-")
    .replaceAll(/[^\w-]+/g, "")
    .replaceAll(/--+/g, "-");
}

function createHeading(level: number) {
  function Heading({ children }: { children: string }) {
    const slug = slugify(children);
    return React.createElement(`h${level}`, { id: slug }, children);
  }

  Heading.displayName = `Heading${level}`;
  return Heading;
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  Table,
  FeatureCard,
  Button,
  CardGrid,
  Hero,
  HeroLabel,
  HeroTitle,
  HeroDescription,
  HeroActions,
  HeroButton,
  HeroMedia,
  HeroBackdrop,
  HighlightCard,
  HighlightCardAction,
  HighlightCardDescription,
  HighlightCardGrid,
  HighlightCardImage,
  HighlightCardTitle,
  Testimonial,
  Callout,
  CTA,
  CTAButton,
  CTATitle,
  FAQ,
  FAQItem,
  Feature,
  FeatureContent,
  FeatureTitle,
  FeatureDescription,
  FeatureActions,
  FeatureButton,
  FeatureMedia,
  LogoCloud,
  LogoCloudItem,
  PricingGrid,
  PricingCard,
  PricingFeatures,
  PricingFeature,
  PricingDescription,
  PricingAction,
  PricingHero,
  Changelog,
  ChangelogAction,
  ChangelogCard,
  ChangelogHeader,
  ChangelogContent,
  Highlights,
  HighlightItem,
  HighlightsAction,
  SecurityActions,
  SecurityGrid,
  SecurityItem,
  SecuritySection,
  StatsGrid,
  StatsItem,
  StatsSection,
  TestimonialGrid,
  TestimonialCard,
  EnterpriseFeature,
  EnterpriseFeatureContent,
  EnterpriseFeatureDescription,
  EnterpriseFeatureMedia,
  EnterpriseFeatureTestimonial,
  EnterpriseFeatureTitle,
};

export async function CustomMDX(props: MDXRemoteProps) {
  const { rehypeShiki } = await import("@/lib/rehype-shiki");

  return (
    <>
      <MDXRemote
        {...props}
        components={{ ...components, ...props.components }}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypeShiki],
          },
        }}
      />
      <CodeBlockEnhancer />
      <CodeTabsEnhancer />
    </>
  );
}
