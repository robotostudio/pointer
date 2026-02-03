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
    <div className="flex flex-col items-center">
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
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>
      <PricingProvider period={period}>
        <div className="w-full">{children}</div>
      </PricingProvider>
    </div>
  );
}
