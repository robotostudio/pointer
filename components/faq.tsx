import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FAQProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function FAQ({ children, title, className }: FAQProps) {
  return (
    <section
      className={cn(
        "my-12 grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr] md:gap-16",
        className
      )}
    >
      {title && (
        <h2 className="font-semibold text-2xl tracking-tight md:text-3xl">
          {title}
        </h2>
      )}
      <Accordion className="w-full">{children}</Accordion>
    </section>
  );
}

interface FAQItemProps {
  children: ReactNode;
  question: string;
  value?: string;
}

export function FAQItem({ children, question, value }: FAQItemProps) {
  const itemValue = value ?? question.toLowerCase().replaceAll(/\s+/g, "-");

  return (
    <AccordionItem value={itemValue}>
      <AccordionTrigger>{question}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}
