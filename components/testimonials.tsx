import Image from "next/image";
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
}

export function TestimonialCard({
  logo,
  quote,
  author,
  role,
  avatar,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col rounded-[4px] border border-muted/40 bg-muted/30 p-8 transition-colors hover:bg-muted/40",
        className
      )}
    >
      {logo && <div className="mb-8">{logo}</div>}
      <div className="mb-8 grow font-normal! text-md text-neutral-700! leading-relaxed! dark:text-neutral-400!">
        "{quote}"
      </div>
      <div className="flex items-center gap-3">
        {avatar && (
          <div className="relative size-10 overflow-hidden rounded-[4px] border border-white/10">
            <Image alt={author} className="object-cover" fill src={avatar} />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-sm">{author}</span>
          <span className="text-muted-foreground text-xs">{role}</span>
        </div>
      </div>
    </div>
  );
}
