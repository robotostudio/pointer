import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PricingGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  title?: string;
}

const columnClasses = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function PricingGrid({
  children,
  columns = 4,
  title,
}: PricingGridProps) {
  return (
    <section className="container my-12">
      {title ? <h2 className="mb-6 font-normal text-base">{title}</h2> : null}
      <div
        className={cn(
          "grid grid-cols-1 gap-2 md:grid-cols-2",
          columnClasses[columns]
        )}
      >
        {children}
      </div>
    </section>
  );
}
