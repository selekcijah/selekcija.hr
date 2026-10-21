import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { Section, surfaceFor } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

/**
 * @param {import("@prismicio/client").Content.WhyChooseSliceSlice} slice
 */
export function WhyChoose({ slice }) {
  const { subheading, heading, image } = slice.primary;
  const items = slice.items || [];

  return (
    <Section variant={surfaceFor(slice.variation)} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          {prismic.isFilled.image(image) && (
            <div className="overflow-hidden rounded-3xl border border-line">
              <PrismicNextImage field={image} fallbackAlt="" className="h-full w-full object-cover" />
            </div>
          )}
        </Reveal>

        <div className="lg:col-span-7">
          <SectionHeader tagline={subheading} heading={heading} align="left" className="mb-8" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((item, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <GlassCard innerClassName="p-6">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <i className={`flaticon-${item.icon || "business-proposal"} text-[22px]`} />
                  </span>
                  <h3 className="font-heading text-[18px] font-semibold text-ink">
                    {item.title}
                    {item.title_highlight && (
                      <>
                        {" "}
                        <span className="text-primary">{item.title_highlight}</span>
                      </>
                    )}
                  </h3>
                  {item.description && <p className="mt-2 text-[14px] leading-relaxed text-body">{item.description}</p>}
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
