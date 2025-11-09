import * as React from "react";
import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/common/components/ui/accordion";

export type ProjectAccordionProps = {
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
};

export function ProjectAccordion({
  defaultValue,
  children,
  className,
}: ProjectAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn(
        "mt-6 w-full rounded-2xl border border-border/70 bg-background/80 shadow-sm backdrop-blur-sm",
        className
      )}
      defaultValue={defaultValue}
    >
      {children}
    </Accordion>
  );
}

export { AccordionItem, AccordionTrigger, AccordionContent };


