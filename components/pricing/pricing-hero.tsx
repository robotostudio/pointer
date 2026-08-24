"use client";

import { type ReactNode, useCallback, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type BillingPeriod, PricingProvider } from "./pricing-context";

interface PricingHeroProps {
  children: ReactNode;
  description?: string;
  title?: string;
}

export function PricingHero({
  children,
  title,
  description,
}: PricingHeroProps) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const handleValueChange = useCallback((value: string) => {
    setPeriod(value as BillingPeriod);
  }, []);

  return (
    <div className="flex flex-col items-center py-12 md:py-16">
      {title ? (
        <h1 className="mb-4 font-medium text-4xl text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
      ) : null}
      {description ? (
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      ) : null}
      <Tabs
        className="mb-12"
        defaultValue="monthly"
        onValueChange={handleValueChange}
      >
        <TabsList className="rounded-full border border-white/3 bg-card p-0.5 transition-colors duration-300 dark:bg-muted">
          <TabsTrigger
            className="rounded-full px-6 py-2 text-base transition duration-200 ease-in-out"
            value="monthly"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger
            className="rounded-full px-6 py-2 text-base transition duration-200 ease-in-out"
            value="yearly"
          >
            Yearly
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <PricingProvider period={period}>
        <div className="w-full">{children}</div>
      </PricingProvider>
    </div>
  );
}
