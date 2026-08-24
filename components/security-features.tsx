import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SecuritySectionProps {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  description?: string;
  title?: string;
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
        "container my-24 flex flex-col items-center gap-4 md:gap-8",
        className
      )}
    >
      <div className="mb-4 text-center">
        {title ? (
          <h2 className="mb-4 font-normal text-3xl text-foreground md:text-4xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mx-auto max-w-2xl text-lg text-neutral-400">
            {description}
          </p>
        ) : null}
      </div>
      {children}
      {actions ? (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {actions}
        </div>
      ) : null}
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
  className?: string;
  description: string;
  title: string;
}

export function SecurityItem({
  title,
  description,
  className,
}: SecurityItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-muted/40 bg-card p-8 transition-colors dark:bg-muted/30",
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
