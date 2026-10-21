import * as prismic from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@/components/PrismicRichText";
import { Section, surfaceFor } from "@/components/ui/Section";
import { Tagline } from "@/components/ui/Tagline";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { bulletListComponents } from "@/components/ui/listComponents";

const detailComponents = {
  list: ({ children }) => <ul className="flex flex-col gap-2.5">{children}</ul>,
  listItem: bulletListComponents.listItem,
  paragraph: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
};

const AlternatingCardsGridSlice = ({ slice }) => {
  const studies = (slice.primary.case_studies ?? []).filter(
    (study) => prismic.isFilled.richText(study.title) || prismic.isFilled.richText(study.details),
  );
  const hasHeader = prismic.isFilled.richText(slice.primary.sub_label) || prismic.isFilled.richText(slice.primary.heading);
  const hasCta = slice.primary.cta_label && prismic.isFilled.link(slice.primary.cta_link);
  const anyImage = studies.some((s) => prismic.isFilled.image(s.image));

  return (
    <Section
      variant={surfaceFor(slice.variation)}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {hasHeader && (
        <div className="mb-12 flex flex-col gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col items-start gap-5">
            {prismic.isFilled.richText(slice.primary.sub_label) && (
              <Reveal y={12}>
                <Tagline>{prismic.asText(slice.primary.sub_label)}</Tagline>
              </Reveal>
            )}
            {prismic.isFilled.richText(slice.primary.heading) && (
              <MarkerHeading field={slice.primary.heading} size="lg" autoMarker={1} />
            )}
          </div>
          {hasCta && (
            <Reveal delay={0.2}>
              <Button field={slice.primary.cta_link} variant="ghost">
                {slice.primary.cta_label}
              </Button>
            </Reveal>
          )}
        </div>
      )}

      <div className={cn("grid gap-5", studies.length > 1 && "md:grid-cols-2", !anyImage && studies.length >= 3 && "xl:grid-cols-3")}>
        {studies.map((study, index) => {
          const title = prismic.asText(study.title).trim();
          const hasImage = prismic.isFilled.image(study.image);
          const hasLink = prismic.isFilled.link(study.link);
          const imageFirst = study.layout === "image-first";

          const imageEl = hasImage && (
            <div className={cn("relative shrink-0", imageFirst ? "lg:order-first" : "lg:order-last")}>
              <div aria-hidden className="animate-glow absolute inset-6 rounded-full bg-primary/30 blur-[60px]" />
              <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface-2 p-2">
                <PrismicNextImage
                  field={study.image}
                  fallbackAlt=""
                  className="mx-auto h-auto max-h-[300px] w-full max-w-[220px] rounded-xl object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          );

          return (
            <Reveal key={index} delay={(index % 2) * 0.08} className={cn("h-full", hasImage && "md:col-span-full")}>
              <GlassCard className="group h-full" innerClassName={cn("flex h-full flex-col gap-8 p-7 md:p-10", hasImage && "lg:flex-row lg:items-center lg:gap-14")}>
                {imageEl}
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="mb-5 font-heading text-[13px] font-medium tracking-[0.2em] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {title && (
                    <h3 className="mb-4 font-heading text-[22px] font-semibold leading-snug tracking-tight text-ink md:text-[26px]">
                      {hasLink ? (
                        <PrismicNextLink field={study.link} className="transition-colors hover:text-primary">
                          {title}
                        </PrismicNextLink>
                      ) : (
                        title
                      )}
                    </h3>
                  )}
                  {prismic.isFilled.richText(study.details) && (
                    <div className="text-[15px] leading-relaxed text-body md:text-[16px]">
                      <PrismicRichText field={study.details} components={detailComponents} />
                    </div>
                  )}
                  {hasLink && (
                    <PrismicNextLink
                      field={study.link}
                      aria-label={title || "View case study"}
                      className="group/btn mt-8 inline-flex size-12 items-center justify-center self-start rounded-full border border-line-strong text-ink transition-all duration-300 hover:border-primary hover:bg-primary"
                    >
                      <ArrowIcon />
                    </PrismicNextLink>
                  )}
                </div>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
};

export default AlternatingCardsGridSlice;
