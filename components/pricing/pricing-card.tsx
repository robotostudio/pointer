"use client";

import type { ReactNode } from "react";
import { usePricingPeriod } from "./pricing-context";

interface PricingCardProps {
  children: ReactNode;
  title: string;
  price: string;
  yearlyPrice?: string;
  period?: string;
  badge?: string;
}

export function PricingCard({
  children,
  title,
  price,
  yearlyPrice,
  period,
  badge,
}: PricingCardProps) {
  const { period: billingPeriod } = usePricingPeriod();
  const displayPrice =
    billingPeriod === "yearly" && yearlyPrice ? yearlyPrice : price;

  return (
    <div className="flex cursor-pointer flex-col rounded border border-neutral-200 bg-muted/30 p-5 hover:bg-muted/60 dark:border-neutral-800 dark:bg-muted/30 dark:hover:bg-muted/50">
      <div className="flex items-center gap-2">
        <h3 className="my-0 font-normal text-base text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
        {badge && <span className="text-orange-500 text-sm">{badge}</span>}
      </div>
      <div className="mb-4">
        <span className="font-normal text-[22px] text-zinc-500 dark:text-zinc-400">
          {displayPrice}
        </span>

        {period && (
          <span className="text-neutral-500 text-sm dark:text-neutral-400">
            {period}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
