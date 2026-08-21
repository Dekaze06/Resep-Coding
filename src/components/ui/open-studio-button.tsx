import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpenStudioButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export function OpenStudioButton({
  href = "/studio",
  className,
  size = "default",
  children = "Open Studio",
  ...props
}: OpenStudioButtonProps) {
  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200/80 text-zinc-950 text-xs font-semibold shadow-md shadow-white/5 transition-all duration-300 cursor-pointer select-none px-4 py-2",
          className
        )}
      >
        <span className="mr-6 transition-opacity duration-500 group-hover:opacity-0">
          {children}
        </span>
        <span className="absolute right-1 top-1 bottom-1 rounded-lg z-10 grid w-6 place-items-center transition-all duration-500 bg-zinc-950/10 group-hover:bg-zinc-950/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-zinc-800 group-hover:text-zinc-950">
          <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
        </span>
      </a>
    );
  }

  return (
    <Button
      className={cn("group relative overflow-hidden bg-white hover:bg-zinc-100 border border-zinc-200/80 text-zinc-950 shadow-md", className)}
      size={size}
      {...props}
    >
      <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
        {children}
      </span>
      <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-zinc-950/10 group-hover:bg-zinc-950/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-zinc-800 group-hover:text-zinc-950">
        <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
      </i>
    </Button>
  );
}

export default OpenStudioButton;
