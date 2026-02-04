"use client";

import { type ReactNode, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type BillingPeriod, PricingProvider } from "./pricing-context";

interface PricingHeroProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function PricingHero({
  children,
  title,
  description,
}: PricingHeroProps) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <div className="flex flex-col items-center py-12 md:py-16">
      {title && (
        <h1 className="mb-4 font-medium text-4xl text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
      )}
      {description && (
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}
      <Tabs
        className="mb-12"
        defaultValue="monthly"
        onValueChange={(value) => setPeriod(value as BillingPeriod)}
      >
        <TabsList className="rounded-full p-1 transition-colors">
          <TabsTrigger
            className="rounded-full px-4 py-2 delay-100 duration-200 ease-in-out will-change-transform"
            value="monthly"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger
            className="rounded-full px-4 py-2 delay-100 duration-200 ease-in-out will-change-transform"
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
