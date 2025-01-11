import { cn } from "@/lib/utils";
import React from "react";

interface DockProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "middle";
}

interface DockIconProps {
  children: React.ReactNode;
  className?: string;
}

export function Dock({ children, className, direction = "middle" }: DockProps) {
  return (
    <div
      className={cn(
        "fixed bottom-4 flex h-16 items-end gap-4 rounded-2xl bg-white/80 p-4 shadow-xl backdrop-blur-md dark:bg-slate-900/50",
        direction === "left" && "left-4",
        direction === "right" && "right-4",
        direction === "middle" && "left-1/2 -translate-x-1/2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DockIcon({ children, className }: DockIconProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center justify-center",
        className
      )}
    >
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/50 shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-125 dark:bg-slate-800/50">
        {children}
      </div>
    </div>
  );
} 