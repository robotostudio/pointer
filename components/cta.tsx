import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CTAProps {
  children: ReactNode;
  className?: string;
}

export function CTA({ children, className }: CTAProps) {
  return (
    <section
      className={cn(
        "my-16! flex flex-col items-center gap-6 px-6 py-12 text-center md:my-24! md:px-12 md:py-20",
        className
      )}
    >
      {children}
    </section>
  );
}

interface CTATitleProps {
  children: ReactNode;
  className?: string;
}

export function CTATitle({ children, className }: CTATitleProps) {
  return (
    <h2
      className={cn(
        "max-w-2xl text-balance font-medium text-3xl! text-foreground tracking-tight md:text-5xl!",
        className
      )}
    >
      {children}
    </h2>
  );
}

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

export function CTAButton({ children, href, className }: CTAButtonProps) {
  const buttonClasses = cn(
    "no-underline! hover:underline! inline-flex items-center gap-2 rounded-full px-8 py-3 font-medium text-sm transition-all",
    "bg-foreground text-background hover:opacity-90 active:scale-95",
    "dark:bg-white dark:text-black dark:hover:bg-white",
    className
  );

  if (href) {
    return (
      <a className={buttonClasses} href={href}>
        {children}
      </a>
    );
  }

  return <span className={buttonClasses}>{children}</span>;
}
