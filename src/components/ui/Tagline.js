import ShinyText from "@/components/reactbits/ShinyText";
import { cn } from "./cn";

/**
 * Small uppercase pill with a pulsing node dot, used above section headings.
 */
export function Tagline({ children, className, tone = "blue" }) {
  if (!children) return null;
  const dot = tone === "mint" ? "bg-mint" : "bg-primary";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/80 backdrop-blur-sm md:text-[12px]",
        className,
      )}
    >
      <span className="relative flex size-2 shrink-0">
        <span className={cn("absolute inset-0 animate-ping rounded-full opacity-60", dot)} />
        <span className={cn("relative size-2 rounded-full", dot)} />
      </span>
      {typeof children === "string" ? (
        <ShinyText text={children} color="#c5cad6" shineColor="#ffffff" speed={3} delay={2.5} />
      ) : (
        children
      )}
    </span>
  );
}
