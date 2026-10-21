import * as prismic from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { Section, surfaceFor } from "./ui/Section";
import { SectionHeader } from "./ui/SectionHeader";
import { GlassCard } from "./ui/GlassCard";
import { Reveal } from "./ui/Reveal";
import { ArrowIcon } from "./ui/Button";
import { NeuralMark } from "./ui/NeuralMark";
import { cn } from "./ui/cn";

/**
 * Services grid of spotlight glass cards.
 *
 * @param {import("@prismicio/client").Content.ServicesSliceSlice} slice
 */
export function Services({ slice }) {
  const isBlueTheme = slice.variation === "blue";
  const { tagline, heading, items } = slice.primary;
  const cards = (items ?? []).filter((item) => item.title || item.description);

  return (
    <Section variant={surfaceFor(slice.variation)}>
      <SectionHeader tagline={tagline} heading={heading} autoMarker={1} className="mb-14 md:mb-20" />

      {cards.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((item, i) => {
            const hasLink = prismic.isFilled.link(item.link);
            return (
              <Reveal key={i} delay={(i % 3) * 0.08} className="h-full">
                <GlassCard
                  className="group h-full"
                  innerClassName="flex flex-col p-7 md:p-8"
                  spotlightColor={isBlueTheme ? "rgba(34,124,255,0.24)" : "rgba(34,124,255,0.18)"}
                >
                  <NeuralMark className="pointer-events-none absolute -right-6 -top-6 w-32 text-primary opacity-0 transition-all duration-700 group-hover:-right-2 group-hover:-top-2 group-hover:opacity-[0.12]" />

                  <div className="mb-10 flex items-start justify-between">
                    <span className="relative flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/25 to-primary/5 text-ink shadow-[0_0_30px_-8px_rgba(34,124,255,0.6)] transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:shadow-[0_0_40px_-4px_rgba(34,124,255,0.9)]">
                      {item.icon ? (
                        <i className={cn(`flaticon-${item.icon}`, "flex text-[28px] leading-none")} aria-hidden />
                      ) : (
                        <NeuralMark className="w-6 text-ink" />
                      )}
                    </span>
                    <span className="font-heading text-[13px] font-medium tracking-[0.2em] text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {item.title && (
                    <h3 className="mb-3 font-heading text-[22px] font-semibold leading-snug tracking-tight text-ink md:text-[24px]">
                      {hasLink ? (
                        <PrismicNextLink field={item.link} className="after:absolute after:inset-0 after:content-['']">
                          {item.title}
                        </PrismicNextLink>
                      ) : (
                        item.title
                      )}
                    </h3>
                  )}

                  {item.description && <p className="text-[15px] leading-relaxed text-body">{item.description}</p>}

                  {hasLink && (
                    <span className="mt-auto flex items-center gap-2 pt-10 text-[14px] font-medium text-ink/80 transition-colors duration-300 group-hover:text-primary">
                      {item.link.text || "Learn More"}
                      <ArrowIcon />
                    </span>
                  )}
                  <span
                    aria-hidden
                    className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-mint to-transparent transition-transform duration-700 group-hover:scale-x-100"
                  />
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      )}
    </Section>
  );
}
