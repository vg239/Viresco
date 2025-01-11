import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
}

export function Marquee({
  children,
  className,
  reverse,
  pauseOnHover,
  fade,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn("flex w-full overflow-hidden [--gap:1rem]", className)}
      {...props}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[--gap] py-4",
          pauseOnHover && "hover:[animation-play-state:paused]",
          !reverse ? "animate-marquee" : "animate-marquee-reverse"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[--gap] py-4",
          pauseOnHover && "hover:[animation-play-state:paused]",
          !reverse ? "animate-marquee" : "animate-marquee-reverse"
        )}
        aria-hidden
      >
        {children}
      </div>
      {fade && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      )}
      {fade && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      )}
    </div>
  );
}
