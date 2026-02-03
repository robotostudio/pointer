import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}

export function Feature({ children, className, reverse }: FeatureProps) {
  return (
    <section
      className={cn(
        "grid items-center gap-8 bg-background py-12 text-foreground md:gap-12 md:py-16 lg:grid-cols-2",
        reverse && "lg:[&>*:first-child]:order-2",
        className
      )}
    >
      {children}
    </section>
  );
}

interface FeatureContentProps {
  children: ReactNode;
  className?: string;
}

export function FeatureContent({ children, className }: FeatureContentProps) {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
}

interface FeatureTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export function FeatureTitle({
  children,
  className,
  as: Tag = "h2",
}: FeatureTitleProps) {
  return (
    <Tag
      className={cn(
        "mt-0! mb-4! text-balance font-medium text-2xl tracking-tight md:text-3xl",
        className
      )}
    >
      {children}
    </Tag>
  );
}

interface FeatureDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function FeatureDescription({
  children,
  className,
}: FeatureDescriptionProps) {
  return (
    <p
      className={cn(
        "max-w-lg text-base text-muted-foreground leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
}

interface FeatureActionsProps {
  children: ReactNode;
  className?: string;
}

export function FeatureActions({ children, className }: FeatureActionsProps) {
  return (
    <div className={cn("mt-6 flex flex-wrap items-center gap-3", className)}>
      {children}
    </div>
  );
}

interface FeatureButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export function FeatureButton({
  children,
  href,
  variant = "primary",
  className,
}: FeatureButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium text-sm transition-colors no-underline!";

  const variants = {
    primary: "text-orange-600 hover:text-orange-700 dark:text-orange-500",
    secondary: "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400",
  };

  const classes = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    );
  }

  return <span className={classes}>{children}</span>;
}

interface FeatureMediaProps {
  children: ReactNode;
  className?: string;
}

export function FeatureMedia({ children, className }: FeatureMediaProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg shadow-xl [&_img]:size-full [&_img]:object-cover",
        className
      )}
    >
      {children}
    </div>
  );
}
