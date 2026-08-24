import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, DownloadIcon } from "./icons/button-icons";

interface CTAProps {
  children: ReactNode;
  className?: string;
}

export function CTA({ children, className }: CTAProps) {
  return (
    <section
      className={cn("mx-auto bg-background py-22 md:px-12 md:py-42", className)}
    >
      <div className="container flex flex-col items-center gap-6 text-center">
        {children}
      </div>
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
        "text-balance font-normal text-5xl text-foreground tracking-tight",
        className
      )}
    >
      {children}
    </h2>
  );
}

interface CTAButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  icon?: "download" | "right";
}

export function CTAButton({ children, href, className, icon }: CTAButtonProps) {
  let IconComponent: ReactNode = null;
  if (icon === "download") {
    IconComponent = <DownloadIcon className="size-3.5" />;
  } else if (icon === "right") {
    IconComponent = <ArrowRightIcon className="size-4" />;
  }

  const buttonClasses = cn(
    "inline-flex items-center gap-2 rounded-full px-8 py-3 font-medium text-sm transition-all",
    "bg-foreground text-background hover:opacity-90 active:scale-95",
    "dark:bg-white dark:text-black dark:hover:bg-white",
    className
  );

  const content = (
    <>
      {children}
      {IconComponent}
    </>
  );

  if (href) {
    return (
      <a className={buttonClasses} href={href}>
        {content}
      </a>
    );
  }

  return <span className={buttonClasses}>{content}</span>;
}
