"use client";

import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { cn } from "@/libs/utils";

interface AccordionProps {
  className: string;
  accordionHeader: React.ReactElement;
  accordionActions: React.ReactElement;
  accordionContent: React.ReactElement;
}

export default function Accordion({
  className,
  accordionHeader,
  accordionActions,
  accordionContent,
}: AccordionProps) {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);

  useEffect(() => {
    setAccordionOpen(false);
  }, []);

  return (
    <div className={cn("p-4", className)}>
      <div className="grid grid-cols-12 box-border">
        <div className="col-span-6 flex box-border">{accordionHeader}</div>
        <div className="col-span-6 flex justify-end w-full box-border">
          {accordionActions}
          <Button
            onClick={(e) => {
              e.preventDefault();
              setAccordionOpen(!accordionOpen);
            }}
            aria-expanded={accordionOpen}
            variant="ghost"
            title={accordionOpen ? "Cacher le détail" : "Afficher le détail"}
          >
            <ChevronDown
              className={`transform origin-center transition duration-200 ease-out ${accordionOpen && "!rotate-180"}`}
            />
          </Button>
        </div>
      </div>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${accordionOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">{accordionContent}</div>
      </div>
    </div>
  );
}
