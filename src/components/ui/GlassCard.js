import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { cn } from "./cn";

export const GLASS =
  "rounded-2xl border border-line bg-surface-3/50 backdrop-blur-sm transition-[border-color,background-color,transform] duration-500 hover:border-line-strong";

/**
 * Dark glass card with a cursor-following spotlight.
 */
export function GlassCard({
  className,
  innerClassName,
  spotlight = true,
  spotlightColor = "rgba(34, 124, 255, 0.18)",
  children,
}) {
  if (!spotlight) {
    return (
      <div className={cn(GLASS, className)}>
        <div className={cn("relative h-full", innerClassName)}>{children}</div>
      </div>
    );
  }

  return (
    <SpotlightCard className={cn(GLASS, className)} spotlightColor={spotlightColor}>
      <div className={cn("relative z-[1] h-full", innerClassName)}>{children}</div>
    </SpotlightCard>
  );
}
