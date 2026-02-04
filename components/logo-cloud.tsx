"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LogoCloudProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function LogoCloud({ children, title, className }: LogoCloudProps) {
  return (
    <section className={cn("my-12", className)}>
      {title && (
        <p className="type-sm mb-8 text-center text-muted-foreground">
          {title}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {children}
      </div>
    </section>
  );
}

interface LogoCloudItemProps {
  name: string;
  children?: ReactNode;
  src?: string;
  srcDark?: string;
  invertOnDark?: boolean;
  href?: string;
  className?: string;
}

export function LogoCloudItem({
  name,
  children,
  src,
  srcDark,
  invertOnDark,
  href,
  className,
}: LogoCloudItemProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const content = (
    <div
      className={cn(
        "flex h-14 cursor-pointer items-center justify-center rounded-lg bg-muted/30 px-4 hover:bg-muted/60 dark:bg-muted/30 dark:hover:bg-muted/50",
        "[&_svg]:h-6 [&_svg]:w-auto [&_svg]:max-w-full [&_svg]:fill-current",
        className
      )}
    >
      {children ||
        (src && (
          <Image
            alt={name}
            className={cn(
              "h-6 w-auto max-w-full object-contain",
              invertOnDark && "dark:invert"
            )}
            height={40}
            src={srcDark && isDark ? srcDark : src}
            width={120}
          />
        ))}
    </div>
  );

  if (href) {
    return (
      <Link
        aria-label={name}
        className="transition-opacity hover:opacity-70"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {content}
      </Link>
    );
  }

  return content;
}
