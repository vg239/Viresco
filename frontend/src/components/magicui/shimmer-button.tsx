import { cn } from "@/lib/utils";
import React from "react";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact';
}

export function ShimmerButton({
  children,
  className,
  variant = 'default',
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "group relative overflow-hidden whitespace-nowrap rounded-md bg-black font-medium text-white",
        "before:absolute before:inset-0 before:-z-10 before:translate-x-[0%] before:bg-gradient-to-r before:from-black/0 before:via-white/25 before:to-black/0 before:transition-transform before:duration-500",
        "hover:before:translate-x-[100%]",
        variant === 'compact' ? "h-9 px-3 text-sm" : "px-4 py-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
} 