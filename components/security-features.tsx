import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SecuritySectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
}

export function SecuritySection({
  children,
  title,
  description,
  className,
  actions,
}: SecuritySectionProps) {
  return (
    <section
      className={cn(
        "my-24 flex flex-col items-center gap-4 md:gap-8",
        className
      )}
    >
      <div className="mb-4 text-center">
        {title && (
          <h2 className="mb-4 font-normal text-3xl text-foreground md:text-4xl">
            {title}
          </h2>
        )}
        {description && (
          <p className="mx-auto max-w-2xl text-lg text-neutral-400">
            {description}
          </p>
        )}
      </div>
      {children}
      {actions && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {actions}
        </div>
      )}
    </section>
  );
}

interface SecurityGridProps {
  children: ReactNode;
  className?: string;
}

export function SecurityGrid({ children, className }: SecurityGridProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SecurityItemProps {
  title: string;
  description: string;
  className?: string;
}

export function SecurityItem({
  title,
  description,
  className,
}: SecurityItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-muted/40 bg-muted/30 p-8 transition-colors hover:bg-muted/40",
        className
      )}
    >
      <h3 className="m-0 font-medium text-base text-foreground">{title}</h3>
      <p className="m-0 text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

interface SecurityActionsProps {
  children: ReactNode;
  className?: string;
}

export function SecurityActions({ children, className }: SecurityActionsProps) {
  return (
    <div className={cn("mt-4 flex flex-wrap justify-center gap-4", className)}>
      {children}
    </div>
  );
}
