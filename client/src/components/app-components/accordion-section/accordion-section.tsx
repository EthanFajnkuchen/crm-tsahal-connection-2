import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionSectionProps {
  title: string;
  children?: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  children,
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="section"
      className="bg-white m-3 py-4 rounded-2xl"
    >
      <AccordionItem value="section">
        <AccordionTrigger className="text-lg px-4 font-semibold">
          {title}
        </AccordionTrigger>
        <AccordionContent className="bg-white p-4 rounded-b-2xl shadow border-none">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionSection;
