import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@/components/PrismicRichText";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { bulletListComponents } from "@/components/ui/listComponents";

const descriptionComponents = {
  paragraph: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  list: ({ children }) => <ul className="mt-2 flex flex-col gap-3">{children}</ul>,
  listItem: bulletListComponents.listItem,
};

/**
 * @typedef {import("@prismicio/client").Content.FeatureRowsSliceSlice} FeatureRowsSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<FeatureRowsSliceSlice>} FeatureRowsSliceProps
 * @type {import("react").FC<FeatureRowsSliceProps>}
 */
const FeatureRowsSlice = ({ slice }) => {
  const rows = (slice.primary.rows ?? []).filter(
    (row) => prismic.isFilled.richText(row.heading) || prismic.isFilled.richText(row.description) || prismic.isFilled.image(row.image),
  );

  return (
    <Section variant="glow" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <SectionHeader
        tagline={prismic.isFilled.richText(slice.primary.sub_label) ? prismic.asText(slice.primary.sub_label) : undefined}
        heading={slice.primary.section_heading}
        autoMarker={1}
        className="mb-16 md:mb-24"
      />

      <div className="flex flex-col gap-20 md:gap-32">
        {rows.map((row, index) => {
          const imageOnLeft = index % 2 === 0;
          const hasImage = prismic.isFilled.image(row.image);

          return (
            <div key={index} className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
              {hasImage && (
                <Reveal
                  x={imageOnLeft ? -40 : 40}
                  y={0}
                  className={cn("relative lg:sticky lg:top-28 lg:col-span-5", !imageOnLeft && "lg:col-start-8 lg:row-start-1")}
                >
                  <div aria-hidden className="animate-glow absolute -inset-6 rounded-[40px] bg-primary/20 blur-[70px]" />
                  <div className="group relative overflow-hidden rounded-[28px] border border-line-strong bg-surface-2">
                    <PrismicNextImage
                      field={row.image}
                      fallbackAlt=""
                      className="h-auto w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-primary/10" />
                    <div aria-hidden className="bg-grid absolute inset-0 opacity-40 mix-blend-overlay" />
                  </div>
                </Reveal>
              )}

              <Reveal
                delay={0.15}
                className={cn(hasImage ? "lg:col-span-6" : "lg:col-span-10 lg:col-start-2", hasImage && imageOnLeft && "lg:col-start-7", hasImage && !imageOnLeft && "lg:col-start-1 lg:row-start-1")}
              >
                {prismic.isFilled.richText(row.heading) && (
                  <h3 className="mb-6 font-heading text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[36px]">
                    {prismic.asText(row.heading)}
                  </h3>
                )}
                {prismic.isFilled.richText(row.description) && (
                  <div className="text-[16px] leading-relaxed text-body md:text-[17px]">
                    <PrismicRichText field={row.description} components={descriptionComponents} />
                  </div>
                )}
                {row.button_label && prismic.isFilled.link(row.button_link) && (
                  <Button field={row.button_link} className="mt-8">
                    {row.button_label}
                  </Button>
                )}
              </Reveal>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default FeatureRowsSlice;
