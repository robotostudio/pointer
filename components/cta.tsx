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
        "my-12 flex flex-col items-center gap-6 rounded-xl bg-background px-8 py-16 text-center",
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
        "font-medium text-3xl tracking-tight md:text-4xl",
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
    "inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-medium text-neutral-900 text-sm transition-colors hover:bg-neutral-100",
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
