import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsSectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function StatsSection({
  children,
  title,
  className,
}: StatsSectionProps) {
  return (
    <section
      className={cn("container my-24 flex flex-col items-center", className)}
    >
      <div className="mb-4 text-center md:mb-8">
        {title && (
          <h2 className="font-normal text-3xl text-foreground md:text-4xl">
            {title}
          </h2>
        )}
      </div>
      {children}
    </section>
  );
}

interface StatsGridProps {
  children: ReactNode;
  className?: string;
}

export function StatsGrid({ children, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatsItemProps {
  value: string;
  description: string;
  className?: string;
}

export function StatsItem({ value, description, className }: StatsItemProps) {
  return (
    <div
      className={cn(
        "flex min-h-50 flex-col justify-between rounded-lg border border-muted/40 bg-card px-2 py-4 transition-colors dark:bg-muted/30",
        className
      )}
    >
      <div className="font-normal text-5xl text-foreground tracking-tight">
        {value}
      </div>
      <div className="text-sm leading-relaxed md:text-md">{description}</div>
    </div>
  );
}
