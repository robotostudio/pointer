import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface PricingFeaturesProps {
  children: ReactNode;
}

interface PricingFeatureProps {
  children: ReactNode;
}

interface PricingDescriptionProps {
  children: ReactNode;
}

export function PricingFeatures({ children }: PricingFeaturesProps) {
  return <ul className="mb-6 flex-1 space-y-2 pl-0!">{children}</ul>;
}

export function PricingFeature({ children }: PricingFeatureProps) {
  return (
    <li className="flex items-start gap-2 text-neutral-700 text-sm dark:text-neutral-300">
      <Check className="mt-0.5 size-4 shrink-0 text-neutral-400" />
      {children}
    </li>
  );
}

export function PricingDescription({ children }: PricingDescriptionProps) {
  return (
    <p className="mb-3 text-neutral-600 text-sm dark:text-neutral-400! [&_p]:text-inherit!">
      {children}
    </p>
  );
}
