import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "centered" | "split";
}

export function Hero({ children, className, variant = "default" }: HeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-background text-foreground",
        variant === "centered" && "text-center",
        variant === "split" && "lg:grid lg:grid-cols-2 lg:items-center",
        className
      )}
    >
      <div
        className={cn(
          "container relative z-10 py-12 md:py-16",
          variant === "centered" && "mx-auto max-w-4xl"
        )}
      >
        {children}
      </div>
    </section>
  );
}

interface HeroLabelProps {
  children: ReactNode;
  className?: string;
}

export function HeroLabel({ children, className }: HeroLabelProps) {
  return (
    <span
      className={cn(
        "mb-3 inline-block font-medium text-neutral-500 text-xs uppercase tracking-wide",
        className
      )}
    >
      {children}
    </span>
  );
}

interface HeroTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function HeroTitle({
  children,
  className,
  as: Tag = "h1",
}: HeroTitleProps) {
  return (
    <Tag
      className={cn(
        "mt-0! mb-6! max-w-4xl text-balance font-medium text-3xl tracking-tight md:text-4xl",
        className
      )}
    >
      {children}
    </Tag>
  );
}

interface HeroDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function HeroDescription({ children, className }: HeroDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-6 max-w-xl text-lg text-neutral-400 leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
}

interface HeroActionsProps {
  children: ReactNode;
  className?: string;
}

export function HeroActions({ children, className }: HeroActionsProps) {
  return (
    <div className={cn("mt-6 flex flex-wrap items-center gap-3", className)}>
      {children}
    </div>
  );
}

interface HeroButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export function HeroButton({
  children,
  href,
  variant = "primary",
  className,
}: HeroButtonProps) {
  const baseStyles =
    "inline-flex items-center no-underline! justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";

  const variants = {
    primary:
      "bg-white text-neutral-950 hover:bg-neutral-100 active:scale-[0.98]",
    secondary:
      "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30",
    ghost: "text-neutral-400 hover:text-white",
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

interface HeroMediaProps {
  children: ReactNode;
  className?: string;
}

export function HeroMedia({ children, className }: HeroMediaProps) {
  return (
    <div
      className={cn(
        "relative mt-12 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-1/2",
        className
      )}
    >
      {children}
    </div>
  );
}

interface HeroBackdropProps {
  className?: string;
  variant?: "grid" | "dots" | "none";
}

export function HeroBackdrop({
  className,
  variant = "dots",
}: HeroBackdropProps) {
  if (variant === "none") {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      {variant === "grid" && (
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      )}
      {variant === "dots" && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}
    </div>
  );
}
