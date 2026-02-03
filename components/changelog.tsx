import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

import { FeatureButton } from "./feature";

interface ChangelogProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}

export function Changelog({
  children,
  title = "Changelog",
  action,
}: ChangelogProps) {
  return (
    <section className="my-6! flex flex-col items-start justify-between gap-4!">
      <h2 className="my-0! font-normal! text-2xl! text-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
      {action}
    </section>
  );
}

interface ChangelogCardProps {
  children: ReactNode;
}

export function ChangelogCard({ children }: ChangelogCardProps) {
  return (
    <div className="flex flex-col space-y-4 rounded-lg border border-muted/60 bg-muted/20 p-5 transition-colors hover:bg-muted/30">
      {children}
    </div>
  );
}

interface ChangelogHeaderProps {
  version?: string;
  date: string;
}

export function ChangelogHeader({ version, date }: ChangelogHeaderProps) {
  return (
    <div className="flex items-center gap-3 text-muted-foreground text-sm">
      {version && (
        <span className="flex h-6 items-center justify-center rounded-full border border-muted-foreground/30 px-2 font-medium text-xs">
          {version}
        </span>
      )}
      <span className="font-normal">{date}</span>
    </div>
  );
}

interface ChangelogContentProps {
  children: ReactNode;
}

export function ChangelogContent({ children }: ChangelogContentProps) {
  return (
    <div className="text-foreground text-sm! leading-relaxed! [&_p]:my-0!">
      {children}
    </div>
  );
}

interface ChangelogActionProps {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function ChangelogAction({
  href,
  children,
  variant = "primary",
  className,
}: ChangelogActionProps) {
  return (
    <FeatureButton
      className={cn("text-xs!", className)}
      href={href}
      variant={variant}
    >
      {children}
    </FeatureButton>
  );
}
