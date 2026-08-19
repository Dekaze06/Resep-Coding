import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  value?: string | string[];
  onItemClick: (itemValue: string) => void;
  type: "single" | "multiple";
  collapsible?: boolean;
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: any) => void;
}

export function Accordion({
  type = "single",
  collapsible = true,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[]>(
    defaultValue || (type === "single" ? "" : [])
  );

  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : uncontrolledValue;

  const onItemClick = React.useCallback(
    (itemValue: string) => {
      if (type === "single") {
        const nextValue = activeValue === itemValue ? (collapsible ? "" : itemValue) : itemValue;
        if (!isControlled) setUncontrolledValue(nextValue);
        onValueChange?.(nextValue);
      } else {
        const currentArr = Array.isArray(activeValue) ? activeValue : [];
        const exists = currentArr.includes(itemValue);
        const nextValue = exists
          ? currentArr.filter((v) => v !== itemValue)
          : [...currentArr, itemValue];
        if (!isControlled) setUncontrolledValue(nextValue);
        onValueChange?.(nextValue);
      }
    },
    [activeValue, collapsible, isControlled, onValueChange, type]
  );

  return (
    <AccordionContext.Provider
      value={{
        value: activeValue,
        onItemClick,
        type,
        collapsible,
      }}
    >
      <div className={cn("divide-y divide-zinc-800/80 border-b border-zinc-800/80", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextType {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = React.createContext<AccordionItemContextType | null>(null);

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const context = React.useContext(AccordionContext);
  const isOpen = Array.isArray(context?.value)
    ? context?.value.includes(value)
    : context?.value === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen: !!isOpen }}>
      <div className={cn("border-b border-zinc-800/80", className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const accordionContext = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  if (!accordionContext || !itemContext) {
    throw new Error("AccordionTrigger must be used inside AccordionItem");
  }

  const { onItemClick } = accordionContext;
  const { value, isOpen } = itemContext;

  return (
    <div className="flex">
      <button
        type="button"
        onClick={() => onItemClick(value)}
        aria-expanded={isOpen}
        className={cn(
          "flex flex-1 items-center justify-between py-4 sm:py-5 font-semibold text-left text-sm sm:text-base text-zinc-100 transition-all hover:text-white group cursor-pointer",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-300 group-hover:text-zinc-300",
            isOpen && "rotate-180 text-zinc-300"
          )}
        />
      </button>
    </div>
  );
}

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const itemContext = React.useContext(AccordionItemContext);

  if (!itemContext) {
    throw new Error("AccordionContent must be used inside AccordionItem");
  }

  const { isOpen } = itemContext;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "overflow-hidden pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed transition-all duration-300 animate-in fade-in-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
