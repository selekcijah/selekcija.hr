import * as prismic from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@/components/PrismicRichText";
import { Section, surfaceFor } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { NeuralMark } from "@/components/ui/NeuralMark";
import { bulletListComponents } from "@/components/ui/listComponents";

const bulletComponents = {
  list: ({ children }) => <ul className="flex flex-col gap-3 text-[15px] text-body">{children}</ul>,
  listItem: bulletListComponents.listItem,
};

const CardsGridSlice = ({ slice }) => {
  const cards = (slice.primary.cards ?? []).filter(
    (card) =>
      prismic.isFilled.richText(card.title) ||
      prismic.isFilled.richText(card.description) ||
      prismic.isFilled.image(card.image),
  );

  const hasBottomLink = prismic.isFilled.link(slice.primary.bottom_link);
  const hasBottom = slice.primary.bottom_text || hasBottomLink;

  return (
    <Section variant={surfaceFor(slice.variation)} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <SectionHeader
        tagline={prismic.isFilled.richText(slice.primary.sub_label) ? prismic.asText(slice.primary.sub_label) : undefined}
        heading={slice.primary.heading}
        autoMarker={1}
        className="mb-12 md:mb-16"
      />

      {cards.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {cards.map((card, i) => {
            const title = prismic.asText(card.title);
            const description = prismic.asText(card.description);
            const hasLink = prismic.isFilled.link(card.button_link);

            return (
              <Reveal key={i} delay={(i % 2) * 0.1} className="h-full">
                <GlassCard className="group h-full" innerClassName="flex h-full flex-col sm:flex-row">
                  <div className="relative min-h-[220px] overflow-hidden sm:w-[42%] sm:shrink-0">
                    {prismic.isFilled.image(card.image) ? (
                      <PrismicNextImage
                        field={card.image}
                        fallbackAlt=""
                        fill
                        sizes="(min-width: 768px) 25vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
                        <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
                        <NeuralMark className="relative w-14 text-primary/70" />
                      </div>
                    )}
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent sm:bg-gradient-to-l" />
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    {title && (
                      <h3 className="mb-3 font-heading text-[22px] font-semibold leading-snug text-ink">
                        {hasLink ? (
                          <PrismicNextLink field={card.button_link} className="transition-colors hover:text-primary">
                            {title}
                          </PrismicNextLink>
                        ) : (
                          title
                        )}
                      </h3>
                    )}
                    {description && <p className="mb-5 text-[15px] leading-relaxed text-body">{description}</p>}
                    {prismic.isFilled.richText(card.bullet_list) && (
                      <PrismicRichText field={card.bullet_list} components={bulletComponents} />
                    )}
                    {hasLink && (
                      <PrismicNextLink
                        field={card.button_link}
                        className="group/btn mt-auto inline-flex items-center gap-2 pt-7 text-[14px] font-medium text-ink transition-colors hover:text-primary"
                      >
                        {card.button_label || "Learn More"}
                        <ArrowIcon />
                      </PrismicNextLink>
                    )}
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      )}

      {hasBottom && (
        <Reveal delay={0.2} className="mt-12 flex flex-col items-center gap-4 text-center">
          {slice.primary.bottom_text && <p className="text-[16px] text-body">{slice.primary.bottom_text}</p>}
          {hasBottomLink && (
            <Button field={slice.primary.bottom_link} size="lg" variant={slice.variation === "blue" ? "mint" : "primary"}>
              {slice.primary.bottom_link_label || "View All"}
            </Button>
          )}
        </Reveal>
      )}
    </Section>
  );
};

export default CardsGridSlice;
