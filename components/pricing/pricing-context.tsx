"use client";

import { createContext, type ReactNode, useContext } from "react";

type BillingPeriod = "monthly" | "yearly";

interface PricingContextValue {
  period: BillingPeriod;
}

const PricingContext = createContext<PricingContextValue>({
  period: "monthly",
});

export function usePricingPeriod() {
  return useContext(PricingContext);
}

interface PricingProviderProps {
  children: ReactNode;
  period: BillingPeriod;
}

export function PricingProvider({ children, period }: PricingProviderProps) {
  return (
    <PricingContext.Provider value={{ period }}>
      {children}
    </PricingContext.Provider>
  );
}

export type { BillingPeriod };
