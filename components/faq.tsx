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
    <section className={cn(className && "py-12", className)}>
      <div className="container grid grid-cols-1 justify-between gap-8 md:grid-cols-2 md:gap-16">
        {title && (
          <h2 className="font-normal text-2xl tracking-tight md:text-3xl">
            {title}
          </h2>
        )}
        <Accordion className="w-full max-w-2xl border-y">{children}</Accordion>
      </div>
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
