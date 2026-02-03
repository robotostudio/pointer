import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HighlightCardGridProps {
  children: ReactNode;
  columns?: 2 | 3;
  title?: string;
}

const columnClasses = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
};

export function HighlightCardGrid({
  children,
  columns = 3,
  title,
}: HighlightCardGridProps) {
  return (
    <section className="my-12">
      {title && (
        <h2 className="mb-6 font-normal! text-base! text-zinc-500 dark:text-zinc-400">
          {title}
        </h2>
      )}
      <div
        className={cn(
          "grid grid-cols-1 gap-4 md:grid-cols-2",
          columnClasses[columns]
        )}
      >
        {children}
      </div>
    </section>
  );
}

interface HighlightCardProps {
  children: ReactNode;
}

export function HighlightCard({ children }: HighlightCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
      {children}
    </div>
  );
}

interface HighlightCardTitleProps {
  children: ReactNode;
}

export function HighlightCardTitle({ children }: HighlightCardTitleProps) {
  return (
    <h3 className="my-0! px-5 pt-5 font-medium text-base text-foreground">
      {children}
    </h3>
  );
}

interface HighlightCardDescriptionProps {
  children: ReactNode;
}

export function HighlightCardDescription({
  children,
}: HighlightCardDescriptionProps) {
  return (
    <div className="px-5 pt-2 text-muted-foreground text-sm [&>p]:my-0!">
      {children}
    </div>
  );
}

interface HighlightCardActionProps {
  children: ReactNode;
  href: string;
}

export function HighlightCardAction({
  children,
  href,
}: HighlightCardActionProps) {
  return (
    <a
      className="no-underline! px-5 pt-3 text-muted-foreground text-sm transition-colors hover:text-foreground"
      href={href}
    >
      {children}
    </a>
  );
}

interface HighlightCardImageProps {
  src: string;
  alt?: string;
}

export function HighlightCardImage({ src, alt = "" }: HighlightCardImageProps) {
  return (
    <div className="mt-4 px-3 pb-3">
      <Image
        alt={alt}
        className="my-0! h-auto w-full rounded-md"
        height={240}
        src={src}
        width={400}
      />
    </div>
  );
}
