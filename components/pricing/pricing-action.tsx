import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PricingActionProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}

export function PricingAction({
  children,
  href,
  variant = "secondary",
}: PricingActionProps) {
  return (
    <a
      className={cn(
        "mt-auto inline-flex w-fit items-center justify-center rounded-full px-6 py-2 text-sm no-underline transition-colors",
        variant === "primary"
          ? "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          : "border border-neutral-200 bg-transparent text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100 dark:hover:bg-neutral-800"
      )}
      href={href}
    >
      {children}
    </a>
  );
}
