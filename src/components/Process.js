import * as prismic from "@prismicio/client";
import { Section, surfaceFor } from "./ui/Section";
import { SectionHeader } from "./ui/SectionHeader";
import { GlassCard } from "./ui/GlassCard";
import { GrowLine } from "./ui/GrowLine";
import { Reveal } from "./ui/Reveal";
import { cn } from "./ui/cn";

const COLS = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/**
 * Numbered process steps joined by a glowing timeline.
 *
 * @param {import("@prismicio/client").Content.ProcessSliceSlice} slice
 */
export function Process({ slice }) {
  const isBlueTheme = slice.variation === "blue";
  const { heading, show_step_numbers } = slice.primary;
  const showStepNumbers = show_step_numbers !== false;
  const items = (slice.items || []).filter((item) => item.title || item.description);
  const cols = COLS[Math.min(items.length, 4)] ?? COLS[4];

  return (
    <Section variant={surfaceFor(slice.variation)}>
      {prismic.isFilled.richText(heading) && (
        <SectionHeader heading={heading} autoMarker={1} className="mb-14 md:mb-20" />
      )}

      <div className="relative">
        {showStepNumbers && (
          <>
            <div aria-hidden className="absolute left-0 right-0 top-[27px] hidden h-px bg-line lg:block" />
            <GrowLine
              className={cn(
                "absolute left-0 right-0 top-[27px] hidden h-px lg:block",
                isBlueTheme ? "bg-gradient-to-r from-primary via-mint to-primary" : "bg-gradient-to-r from-transparent via-primary to-transparent",
              )}
            />
          </>
        )}

        <ol className={cn("relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8", cols)}>
          {items.map((item, index) => (
            <Reveal as="li" key={index} delay={0.15 + index * 0.15} className="relative flex flex-col">
              {showStepNumbers && (
                <div className="mb-6 flex items-center gap-4 lg:mb-8">
                  <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-surface font-heading text-[15px] font-semibold text-ink shadow-[0_0_0_6px_rgba(4,11,30,1),0_0_30px_-4px_rgba(34,124,255,0.8)]">
                    <span aria-hidden className="absolute inset-1 rounded-full bg-gradient-to-b from-primary/40 to-primary/5" />
                    <span className="relative">{String(index + 1).padStart(2, "0")}</span>
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent lg:hidden" />
                </div>
              )}

              <GlassCard className="group h-full" innerClassName="flex flex-col p-7 md:p-8">
                <span className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                  <i className={`flaticon-${item.icon || "idea"} flex text-[24px] leading-none`} aria-hidden />
                </span>
                {item.title && (
                  <h3 className="mb-3 font-heading text-[22px] font-semibold tracking-tight text-ink md:text-[24px]">{item.title}</h3>
                )}
                {item.description && <p className="text-[15px] leading-relaxed text-body">{item.description}</p>}
              </GlassCard>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
