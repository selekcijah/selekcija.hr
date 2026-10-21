import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * @typedef {import("@prismicio/client").Content.WebinarListSliceSlice} WebinarListSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<WebinarListSliceSlice>} WebinarListSliceProps
 * @type {import("react").FC<WebinarListSliceProps>}
 */
const WebinarListSlice = ({ slice }) => {
  const { primary, items } = slice;
  const webinars = (items ?? []).filter((item) => item.title && extractYouTubeId(item.youtube_url));

  if (!webinars.length && !primary.heading) {
    return null;
  }

  return (
    <Section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <SectionHeader
        tagline={primary.tagline}
        heading={primary.heading}
        description={primary.description}
        className="mb-12 md:mb-16"
      />

      {webinars.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {webinars.map((item, index) => {
            const videoId = extractYouTubeId(item.youtube_url);
            const href = `https://www.youtube.com/watch?v=${videoId}`;
            const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            return (
              <Reveal key={`${videoId}-${index}`} delay={index * 0.06}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <GlassCard innerClassName="flex h-full flex-col overflow-hidden">
                    <span className="relative block aspect-video overflow-hidden bg-surface-2">
                      <Image src={thumb} alt={item.title || "Webinar"} fill sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw" className="object-cover" unoptimized />
                      <span className="absolute inset-0 bg-surface/20" />
                      <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-primary text-white shadow-[0_0_0_10px_rgba(34,124,255,0.25),0_0_40px_rgba(34,124,255,0.55)]">
                        <i className="ri-play-fill text-[22px]" aria-hidden />
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col gap-3 p-6">
                      {item.title && <h3 className="font-heading text-[20px] font-semibold text-ink">{item.title}</h3>}
                      {item.short_description && <p className="text-[14px] leading-relaxed text-body">{item.short_description}</p>}
                    </span>
                  </GlassCard>
                </a>
              </Reveal>
            );
          })}
        </div>
      )}
    </Section>
  );
};

export default WebinarListSlice;
