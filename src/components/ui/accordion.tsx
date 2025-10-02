import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  type?: "single" | "multiple";
  defaultValue?: string | string[];
}

function Accordion({
  children,
  className,
  type = "single",
  defaultValue,
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (defaultValue) {
      return new Set(
        Array.isArray(defaultValue) ? defaultValue : [defaultValue]
      );
    }
    return new Set();
  });

  const toggleItem = React.useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          if (type === "single") {
            newSet.clear();
          }
          newSet.add(id);
        }
        return newSet;
      });
    },
    [type]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  children: React.ReactNode;
  className?: string;
  value: string;
}

function AccordionItem({ children, className, value }: AccordionItemProps) {
  return <div className={cn("border rounded-lg", className)}>{children}</div>;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  value: string;
}

function AccordionTrigger({
  children,
  className,
  value,
}: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionTrigger must be used within an Accordion");
  }

  const { openItems, toggleItem } = context;
  const isOpen = openItems.has(value);

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors",
        className
      )}
      onClick={() => toggleItem(value)}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
  value: string;
}

function AccordionContent({
  children,
  className,
  value,
}: AccordionContentProps) {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionContent must be used within an Accordion");
  }

  const { openItems } = context;
  const isOpen = openItems.has(value);

  if (!isOpen) return null;

  return <div className={cn("px-4 pb-4", className)}>{children}</div>;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
