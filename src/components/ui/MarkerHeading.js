import { toSegments, withAutoMarker } from "@/lib/segments";
import { cn } from "./cn";
import { WordReveal } from "./WordReveal";

export const HEADING_SIZES = {
  display: "text-[42px] leading-[1.28] sm:text-[56px] lg:text-[72px] xl:text-[84px]",
  xl: "text-[36px] leading-[1.28] md:text-[52px] xl:text-[64px]",
  lg: "text-[32px] leading-[1.3] md:text-[42px] xl:text-[52px]",
  md: "text-[26px] leading-[1.3] md:text-[32px] xl:text-[36px]",
  sm: "text-[20px] leading-[1.35] md:text-[24px]",
};

/**
 * Heading that renders Prismic `strong` as a blue marker and `em` as a mint
 * marker, with a word blur reveal.
 */
export function MarkerHeading({
  field,
  text,
  as = "h2",
  size = "lg",
  className,
  animate = true,
  autoMarker = 0,
  markerTone = "blue",
  delay = 0,
}) {
  const segments = withAutoMarker(toSegments(field ?? text), autoMarker, markerTone);
  if (!segments.length) return null;

  const classes = cn(
    "font-heading font-bold tracking-[-0.03em] text-ink text-balance",
    HEADING_SIZES[size] ?? size,
    className,
  );

  if (!animate) {
    const Tag = as;
    return (
      <Tag className={classes}>
        {segments.map((segment, i) =>
          segment.tone ? (
            <span key={i} className={segment.tone === "mint" ? "marker marker-mint" : "marker"}>
              {segment.text}
            </span>
          ) : (
            <span key={i}>{segment.text}</span>
          ),
        )}
      </Tag>
    );
  }

  return <WordReveal segments={segments} as={as} className={classes} delay={delay} />;
}
