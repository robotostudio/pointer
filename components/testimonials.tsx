import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TestimonialGridProps {
  children: ReactNode;
  title?: string;
  className?: string;
  actions?: ReactNode;
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
        "my-16! flex flex-col items-center gap-2 md:gap-10",
        className
      )}
    >
      {title && (
        <h2 className="mb-12 text-center font-normal! text-3xl! text-foreground md:text-4xl!">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
      {actions && <div className="mt-4">{actions}</div>}
    </section>
  );
}

interface TestimonialCardProps {
  logo?: ReactNode;
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  className?: string;
  href?: string;
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
      {logo && <div className="mb-8">{logo}</div>}
      <div className="mb-8 grow font-normal! text-md text-neutral-700! leading-relaxed! dark:text-neutral-400!">
        "{quote}"
      </div>
      <div className="flex items-center gap-3">
        {avatar && (
          <div className="relative size-10 overflow-hidden rounded-[4px] border border-white/10 bg-muted/50">
            <Image
              alt={author}
              className="object-cover"
              fill
              sizes="40px"
              src={avatar}
            />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-sm">{author}</span>
          <span className="text-muted-foreground text-xs">{role}</span>
        </div>
      </div>
    </>
  );

  const containerClasses = cn(
    "flex flex-col rounded-[4px] border border-muted/40 bg-muted/30 p-8 transition-colors",
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
