import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
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
        "my-6 grid items-center gap-8 border border-muted/60 bg-muted/30 p-4 text-foreground md:my-12 md:gap-12 md:py-4 lg:grid-cols-3",
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
        "mt-0! mb-2! text-balance font-medium text-2xl tracking-tight md:text-3xl",
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
    <div
      className={cn(
        "max-w-lg text-base text-muted-foreground leading-relaxed [&>p]:my-0! [&_p]:text-inherit!",
        className
      )}
    >
      {children}
    </div>
  );
}

interface FeatureActionsProps {
  children: ReactNode;
  className?: string;
}

export function FeatureActions({ children, className }: FeatureActionsProps) {
  return (
    <div className={cn("mt-2 flex flex-wrap items-center gap-3", className)}>
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

  return (
    <Button className={classes} type="button">
      {children}
    </Button>
  );
}

interface FeatureMediaProps {
  children?: ReactNode;
  backgroundSrc?: string;
  windowSrc?: string;
  alt?: string;
  className?: string;
}

export function FeatureMedia({
  children,
  className,
  backgroundSrc,
  windowSrc,
  alt = "Feature media",
}: FeatureMediaProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-lg shadow-xl lg:col-span-2",
        className
      )}
    >
      {backgroundSrc && (
        <Image
          alt={alt}
          className="object-cover"
          fill
          priority
          src={backgroundSrc}
        />
      )}
      {windowSrc && (
        <div className="relative z-15 mx-auto h-10/12 w-10/12 overflow-hidden rounded-lg border border-white/10 shadow-2xl">
          <Image
            alt={`${alt} - focus`}
            className="h-auto w-full"
            height={900}
            src={windowSrc}
            width={1600}
          />
        </div>
      )}
      {children}
    </div>
  );
}
