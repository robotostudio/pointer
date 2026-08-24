import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TestimonialGridProps {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  title?: string;
}

export function TestimonialGrid({
  children,
  title,
  className,
  actions,
}: TestimonialGridProps) {
  return (
    <section
      className={cn(
        "container flex flex-col items-center gap-2 py-14 md:gap-10 md:py-18",
        className
      )}
    >
      {title ? (
        <h2 className="text-center font-normal text-3xl text-foreground md:text-4xl">
          {title}
        </h2>
      ) : null}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
      {actions ? <div className="mt-4">{actions}</div> : null}
    </section>
  );
}

interface TestimonialCardProps {
  author: string;
  avatar?: string;
  className?: string;
  href?: string;
  logo?: ReactNode;
  quote: string;
  role: string;
}

export function TestimonialCard({
  logo,
  quote,
  author,
  role,
  avatar,
  className,
  href,
}: TestimonialCardProps) {
  const CardContent = (
    <>
      {logo ? <div className="mb-8">{logo}</div> : null}
      <div className="mb-8 grow font-normal text-md leading-relaxed">
        "{quote}"
      </div>
      <div className="flex items-center gap-3">
        {avatar ? (
          <div className="relative size-10 overflow-hidden rounded-sm border border-white/10 bg-muted/50">
            <Image
              alt={author}
              className="object-cover"
              fill
              sizes="40px"
              src={avatar}
            />
          </div>
        ) : null}
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-sm">{author}</span>
          <span className="text-muted-foreground text-xs">{role}</span>
        </div>
      </div>
    </>
  );

  const containerClasses = cn(
    "flex flex-col rounded-sm border border-muted/40 bg-card p-4 transition-colors dark:bg-muted/30",
    href ? "cursor-pointer hover:bg-muted/40" : "cursor-default",
    className
  );

  if (href) {
    return (
      <Link
        className={containerClasses}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {CardContent}
      </Link>
    );
  }

  return <div className={containerClasses}>{CardContent}</div>;
}
