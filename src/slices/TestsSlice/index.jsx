import * as prismic from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Button";
import { NeuralMark } from "@/components/ui/NeuralMark";
import { cn } from "@/components/ui/cn";

/**
 * @typedef {import("@prismicio/client").Content.TestsSliceSlice} TestsSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TestsSliceSlice>} TestsSliceProps
 * @type {import("react").FC<TestsSliceProps>}
 */
const TestsSlice = ({ slice }) => {
  const cards = (slice.primary.cards ?? []).filter(
    (card) => card.title || prismic.isFilled.image(card.image) || prismic.isFilled.link(card.link),
  );

  return (
    <Section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <SectionHeader
        tagline={slice.primary.tagline || undefined}
        heading={slice.primary.heading}
        autoMarker={2}
        className="mb-12 md:mb-16"
      />

      {cards.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => {
            const hasLink = prismic.isFilled.link(card.link);
            const Wrapper = hasLink ? PrismicNextLink : "div";
            const wrapperProps = hasLink
              ? { field: card.link, className: "group relative flex aspect-[3/2] flex-col overflow-hidden rounded-3xl border border-line md:aspect-[4/5]" }
              : { className: "group relative flex aspect-[3/2] flex-col overflow-hidden rounded-3xl border border-line md:aspect-[4/5]" };

            return (
              <Reveal as="li" key={`${card.title || "card"}-${index}`} delay={index * 0.08} className="h-full">
                <Wrapper {...wrapperProps}>
                  {prismic.isFilled.image(card.image) ? (
                    <PrismicNextImage
                      field={card.image}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      fallbackAlt=""
                      className="object-cover saturate-75 transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center bg-surface-2">
                      <span aria-hidden className="bg-grid absolute inset-0 opacity-50" />
                      <NeuralMark className="relative w-14 text-primary/50" />
                    </span>
                  )}

                  <span aria-hidden className="pointer-events-none absolute inset-0 bg-primary/45 mix-blend-color" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,11,30,0.35)_0%,rgba(4,11,30,0.55)_45%,rgba(4,11,30,0.88)_100%)]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_70%_60%_at_100%_100%,rgba(69,217,150,0.35),transparent_65%)]"
                  />

                  <span className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 md:p-7">
                    {card.title && (
                      <h3 className="font-heading text-[24px] font-semibold leading-tight tracking-tight text-ink sm:text-[26px] md:text-[28px]">
                        {card.title}
                      </h3>
                    )}

                    <span className="flex items-end justify-between gap-4">
                      {card.subtitle ? (
                        <span className="max-w-[72%] text-[17px] font-medium leading-snug text-white/90 md:text-[16px]">
                          {card.subtitle}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-ink backdrop-blur-sm transition-all duration-300 sm:size-12",
                          hasLink && "group-hover:border-mint group-hover:bg-mint group-hover:text-surface group-hover:shadow-[0_0_30px_-6px_rgba(69,217,150,0.9)]",
                        )}
                        aria-hidden={!hasLink}
                      >
                        <ArrowIcon className="size-4" />
                      </span>
                    </span>
                  </span>
                </Wrapper>
              </Reveal>
            );
          })}
        </ul>
      )}
    </Section>
  );
};

export default TestsSlice;
