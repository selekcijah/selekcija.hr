import * as prismic from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Section } from "@/components/ui/Section";
import { Tagline } from "@/components/ui/Tagline";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { Reveal } from "@/components/ui/Reveal";
import { NeuralMark } from "@/components/ui/NeuralMark";

const SOCIAL_ICONS = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
  ),
  twitter: (
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.36 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.7H5.58l11.09 14.5Z" />
  ),
  facebook: (
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.55V4.47A20.6 20.6 0 0 0 14.3 4.3c-2.25 0-3.8 1.37-3.8 3.9v2.3H8v3h2.5V21h3Z" />
  ),
};

/**
 * @typedef {import("@prismicio/client").Content.TeamSliceSlice} TeamSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TeamSliceSlice>} TeamSliceProps
 * @type {import("react").FC<TeamSliceProps>}
 */
const TeamSlice = ({ slice }) => {
  const { primary } = slice;
  const items = (slice.items ?? []).filter((item) => item.name || prismic.isFilled.image(item.photo));

  if (!items.length && !primary.heading && !primary.tagline) return null;

  return (
    <Section padding={items.length ? "default" : "tight"}>
      {(primary.tagline || primary.heading) && (
        <div className="mb-10 flex flex-col gap-5 border-b border-line pb-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start gap-4">
            {primary.tagline && (
              <Reveal y={12}>
                <Tagline>{primary.tagline}</Tagline>
              </Reveal>
            )}
            {primary.heading && <MarkerHeading text={primary.heading} size="lg" />}
          </div>
          {items.length > 0 && (
            <Reveal delay={0.2} className="font-heading text-[56px] font-bold leading-none tracking-tight text-ink/10 md:text-[80px]">
              {String(items.length).padStart(2, "0")}
            </Reveal>
          )}
        </div>
      )}

      {items.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => {
            const socials = [
              ["linkedin", item.linkedin_url],
              ["twitter", item.twitter_url],
              ["facebook", item.facebook_url],
            ].filter(([, link]) => prismic.isFilled.link(link));

            return (
              <Reveal as="li" key={i} delay={(i % 4) * 0.08}>
                <article className="group relative overflow-hidden rounded-3xl border border-line bg-surface-2 transition-[border-color,box-shadow] duration-500 hover:border-primary/50 hover:shadow-[0_20px_60px_-24px_rgba(34,124,255,0.6)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(34,124,255,0.35),transparent_70%)]" />
                    {prismic.isFilled.image(item.photo) ? (
                      <PrismicNextImage
                        field={item.photo}
                        fallbackAlt=""
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <NeuralMark className="w-16 text-primary/40" />
                      </div>
                    )}
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface via-surface/60 to-transparent" />

                    {socials.length > 0 && (
                      <ul className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-within:opacity-100 translate-x-2 group-hover:translate-x-0">
                        {socials.map(([key, link]) => (
                          <li key={key}>
                            <PrismicNextLink
                              field={link}
                              aria-label={key}
                              className="flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface/70 text-ink backdrop-blur transition-colors hover:border-primary hover:bg-primary"
                            >
                              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                                {SOCIAL_ICONS[key]}
                              </svg>
                            </PrismicNextLink>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      {item.name && <h3 className="font-heading text-[19px] font-semibold text-ink">{item.name}</h3>}
                      {item.role && (
                        <span className="mt-1.5 inline-flex items-center gap-2 text-[13px] text-body">
                          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,124,255,0.9)]" />
                          {item.role}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      )}
    </Section>
  );
};

export default TeamSlice;
