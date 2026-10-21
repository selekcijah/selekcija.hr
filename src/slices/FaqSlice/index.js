import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { Section } from "@/components/ui/Section";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { Reveal } from "@/components/ui/Reveal";
import { NeuralMark } from "@/components/ui/NeuralMark";
import FaqAccordion from "./FaqAccordion";

/**
 * @typedef {import("@prismicio/client").Content.FaqSliceSlice} FaqSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<FaqSliceSlice>} FaqSliceProps
 * @type {import("react").FC<FaqSliceProps>}
 */
const FaqSlice = ({ slice }) => {
  const { primary, items } = slice;
  const anchorId = (primary.anchor_id || "faq").trim().replace(/\s+/g, "-").toLowerCase();

  return (
    <Section id={anchorId} className="scroll-mt-[100px]">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-6 lg:sticky lg:top-[120px]">
            {primary.heading && <MarkerHeading text={primary.heading} size="lg" autoMarker={1} />}
            {primary.intro_text && (
              <Reveal delay={0.15}>
                <p className="text-[16px] leading-relaxed text-body md:text-[17px]">{primary.intro_text}</p>
              </Reveal>
            )}
            {prismic.isFilled.image(primary.side_image) ? (
              <Reveal delay={0.25} className="relative mt-4 overflow-hidden rounded-3xl border border-line">
                <PrismicNextImage field={primary.side_image} fallbackAlt="" className="h-auto w-full object-cover opacity-90" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-primary/10" />
              </Reveal>
            ) : (
              <Reveal delay={0.25} className="relative mt-6 hidden aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-line bg-surface-2/60 lg:flex">
                <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
                <div aria-hidden className="animate-glow absolute size-48 rounded-full bg-primary/30 blur-[80px]" />
                <NeuralMark className="animate-float-slow relative w-28 text-primary" />
              </Reveal>
            )}
          </div>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <FaqAccordion items={items ?? []} />
        </Reveal>
      </div>
    </Section>
  );
};

export default FaqSlice;
