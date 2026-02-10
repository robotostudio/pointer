import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FeatureButton } from "./feature";

interface HighlightCardGridProps {
  children: ReactNode;
  columns?: 3 | 4;
  title?: string;
  description?: string;
}

const columnClasses = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function HighlightCardGrid({
  children,
  columns = 4,
  title,
  description,
}: HighlightCardGridProps) {
  return (
    <section className="container my-12 p-0">
      <div className="mb-6 flex flex-col items-start justify-between gap-1">
        {title && (
          <h2 className="font-normal text-2xl text-foreground">{title}</h2>
        )}
        {description && (
          <p className="mb-2 text-balance font-normal text-xl text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>

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
    <div className="flex flex-col justify-between overflow-hidden rounded-lg border border-muted/60 bg-card dark:bg-muted/30">
      {children}
    </div>
  );
}

interface HighlightCardTitleProps {
  children: ReactNode;
}

export function HighlightCardTitle({ children }: HighlightCardTitleProps) {
  return (
    <h3 className="my-0 px-5 pt-5 font-medium text-base text-foreground">
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
    <div className="px-5 text-muted-foreground text-sm [&>p]:my-0 [&_p]:text-inherit">
      {children}
    </div>
  );
}

interface HighlightCardActionProps {
  children: ReactNode;
  href: string;
  icon?: "download" | "right";
}

export function HighlightCardAction({
  children,
  href,
  icon = "right",
}: HighlightCardActionProps) {
  return (
    <div className="px-5 pt-3">
      <FeatureButton
        className="text-xs"
        href={href}
        icon={icon}
        variant="primary"
      >
        {children}
      </FeatureButton>
    </div>
  );
}

interface HighlightCardImageProps {
  src: string;
  alt?: string;
}

export function HighlightCardImage({ src, alt = "" }: HighlightCardImageProps) {
  return (
    <div className="mt-4 flex flex-col justify-end bg-card px-3 pb-3 dark:bg-muted/30">
      <Image
        alt={alt}
        className="my-0 aspect-square h-auto w-full rounded-md object-cover hue-rotate-180 invert dark:hue-rotate-0 dark:invert-0"
        height={225}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        src={src}
        width={400}
      />
    </div>
  );
}
