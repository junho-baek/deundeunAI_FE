import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/common/components/ui/accordion";

export type ProjectAccordionProps = {
  defaultValue?: string;
  children: React.ReactNode;
};

export function ProjectAccordion({ defaultValue, children }: ProjectAccordionProps) {
  return (
    <Accordion type="single" collapsible className="mt-6 w-full" defaultValue={defaultValue}>
      {children}
    </Accordion>
  );
}

export { AccordionItem, AccordionTrigger, AccordionContent };


