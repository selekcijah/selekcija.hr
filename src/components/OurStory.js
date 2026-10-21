import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import Image from "next/image";
import CountUpNumber from "@/components/CountUpNumber";
import { Section, surfaceFor } from "./ui/Section";
import { Tagline } from "./ui/Tagline";
import { MarkerHeading } from "./ui/MarkerHeading";
import { GlassCard } from "./ui/GlassCard";
import { Reveal } from "./ui/Reveal";
import { Button } from "./ui/Button";
import { NeuralMark } from "./ui/NeuralMark";

function StoryImage({ field, className, sizes }) {
  if (prismic.isFilled.image(field)) {
    return <PrismicNextImage field={field} fallbackAlt="" sizes={sizes} className={className} />;
  }
  if (field?.url) {
    return (
      <Image
        src={field.url}
        alt={field.alt || ""}
        width={field.dimensions?.width || 1200}
        height={field.dimensions?.height || 800}
        sizes={sizes}
        className={className}
      />
    );
  }
  return null;
}

const ICONS = {
  mission: (
    <path d="M12 2a10 10 0 1 0 10 10M12 6a6 6 0 1 0 6 6m-6-2a2 2 0 1 0 2 2m0 0 7-7m0 0h-3m3 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  vision: (
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
};

/**
 * Mission and vision with an image collage and years-of-experience counter.
 *
 * @param {import("@prismicio/client").Content.OurStorySliceSlice} slice
 */
export function OurStory({ slice }) {
  const {
    subheading,
    heading,
    mission_title,
    mission_text,
    vision_title,
    vision_text,
    more_link,
    years,
    years_label,
    image_1,
    image_2,
  } = slice.primary;

  const yearsValue = typeof years === "number" ? years : parseInt(String(years ?? "15"), 10) || 15;
  const hasImage1 = prismic.isFilled.image(image_1) || image_1?.url;
  const hasImage2 = prismic.isFilled.image(image_2) || image_2?.url;
  const pillars = [
    { key: "mission", title: mission_title, text: mission_text },
    { key: "vision", title: vision_title, text: vision_text },
  ].filter((p) => p.title || p.text);

  return (
    <Section variant={surfaceFor(slice.variation)}>
      <div className="grid grid-cols-1 items-center gap-14 xl:grid-cols-2 xl:gap-20">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-start gap-5">
            {subheading && (
              <Reveal y={12}>
                <Tagline>{subheading}</Tagline>
              </Reveal>
            )}
            {prismic.isFilled.richText(heading) && <MarkerHeading field={heading} size="lg" autoMarker={2} />}
          </div>

          {pillars.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {pillars.map((pillar, i) => (
                <Reveal key={pillar.key} delay={0.1 + i * 0.1} className="h-full">
                  <GlassCard className="group h-full" innerClassName="flex flex-col gap-4 p-7">
                    <span className="flex size-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                        {ICONS[pillar.key]}
                      </svg>
                    </span>
                    {pillar.title && <h3 className="font-heading text-[21px] font-semibold text-ink">{pillar.title}</h3>}
                    {pillar.text && <p className="text-[15px] leading-relaxed text-body">{pillar.text}</p>}
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          )}

          {prismic.isFilled.link(more_link) && (
            <Reveal delay={0.3}>
              <Button field={more_link}>{more_link.text || "More About Us"}</Button>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.15} className="relative">
          <div aria-hidden className="animate-glow absolute inset-10 rounded-full bg-primary/25 blur-[90px]" />
          <div className="relative grid grid-cols-6 gap-4">
            {hasImage2 && (
              <div className={`relative overflow-hidden rounded-[28px] border border-line-strong ${hasImage1 ? "col-span-4 col-start-3" : "col-span-6 sm:col-span-5 sm:col-start-2"}`}>
                <StoryImage field={image_2} sizes="(min-width: 1280px) 40vw, 90vw" className="block h-auto w-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent" />
              </div>
            )}
            {hasImage1 && (
              <div className="relative col-span-3 -mt-40 self-end overflow-hidden rounded-[22px] border border-line-strong shadow-2xl sm:-mt-56">
                <StoryImage field={image_1} sizes="(min-width: 1280px) 20vw, 45vw" className="block h-auto w-full object-cover" />
              </div>
            )}
          </div>

          <div className="absolute -bottom-6 left-0 flex items-center gap-4 rounded-2xl border border-line-strong bg-surface-3/85 px-6 py-5 shadow-2xl backdrop-blur-xl sm:left-4">
            <NeuralMark className="w-8 text-primary" />
            <div>
              <p className="font-heading text-[40px] font-bold leading-none tracking-tight text-ink">
                <CountUpNumber value={yearsValue} suffix="+" />
              </p>
              {years_label && <span className="mt-1 block text-[12px] font-medium uppercase tracking-[0.16em] text-muted">{years_label}</span>}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
