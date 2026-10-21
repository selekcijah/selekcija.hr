import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@/components/PrismicRichText";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { NeuralBackground } from "@/components/ui/NeuralBackground";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";
import NewsletterForm from "./NewsletterForm";

/** Maps the CMS bg_color choice to a dark surface treatment. */
const BG_MAP = {
  primary: {
    glow: "bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(34,124,255,0.35),transparent_65%)]",
    border: "bg-[linear-gradient(180deg,rgba(34,124,255,0.7),rgba(255,255,255,0.06)_60%)]",
    accent: "primary",
  },
  secondary: {
    glow: "bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(69,217,150,0.25),transparent_65%)]",
    border: "bg-[linear-gradient(180deg,rgba(69,217,150,0.6),rgba(255,255,255,0.06)_60%)]",
    accent: "secondary",
  },
  dark: {
    glow: "bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(255,255,255,0.06),transparent_65%)]",
    border: "bg-line-strong",
    accent: "primary",
  },
};

/**
 * @typedef {import("@prismicio/client").Content.NewsletterSliceSlice} NewsletterSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<NewsletterSliceSlice>} NewsletterSliceProps
 * @type {import("react").FC<NewsletterSliceProps>}
 */
const NewsletterSlice = ({ slice }) => {
  const isBlueTheme = slice.variation === "blue";
  const { heading, description, button_label, bg_color, brevo_list_id } = slice.primary;
  const colorKey = isBlueTheme && (bg_color ?? "primary") === "primary" ? "secondary" : (bg_color ?? "primary");
  const theme = BG_MAP[colorKey] ?? BG_MAP.primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative isolate px-5 py-16 md:px-8 md:py-24"
    >
      <Reveal y={40} className="mx-auto max-w-[1240px]">
        <div className={cn("rounded-[28px] p-px md:rounded-[36px]", theme.border)}>
          <div className="relative isolate overflow-hidden rounded-[27px] bg-surface-2 px-6 py-16 text-center md:rounded-[35px] md:px-20 md:py-24">
            <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", theme.glow)} />
            <NeuralBackground
              className="-z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
              maxNodes={70}
              linkDistance={140}
              interactive={false}
            />

            {prismic.isFilled.richText(heading) && (
              <MarkerHeading
                field={heading}
                size="xl"
                autoMarker={2}
                markerTone={theme.accent === "secondary" ? "mint" : "blue"}
                className="mx-auto max-w-[900px]"
              />
            )}

            {prismic.isFilled.richText(description) && (
              <Reveal delay={0.15} className="mx-auto mb-10 mt-6 max-w-[680px] text-[16px] leading-relaxed text-body md:text-[19px]">
                <PrismicRichText field={description} />
              </Reveal>
            )}

            <Reveal delay={0.25}>
              <NewsletterForm buttonLabel={button_label || "Subscribe"} brevoListId={brevo_list_id} accentColor={theme.accent} />
            </Reveal>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default NewsletterSlice;
