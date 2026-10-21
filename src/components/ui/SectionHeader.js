import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@/components/PrismicRichText";
import { MarkerHeading } from "./MarkerHeading";
import { Reveal } from "./Reveal";
import { Tagline } from "./Tagline";
import { cn } from "./cn";

/**
 * Tagline pill + marker heading + description.
 *
 * `heading` and `description` accept either a string or a Prismic rich text field.
 */
export function SectionHeader({
  tagline,
  heading,
  description,
  align = "center",
  size = "lg",
  as = "h2",
  autoMarker = 0,
  markerTone = "blue",
  className,
  children,
}) {
  const centered = align === "center";
  const hasDescription =
    typeof description === "string" ? !!description.trim() : prismic.isFilled.richText(description);
  const hasHeading = typeof heading === "string" ? !!heading.trim() : prismic.isFilled.richText(heading);

  if (!tagline && !hasHeading && !hasDescription && !children) return null;

  return (
    <div className={cn("flex flex-col gap-5", centered ? "mx-auto items-center text-center max-w-[820px]" : "items-start", className)}>
      {tagline && (
        <Reveal y={12}>
          <Tagline>{tagline}</Tagline>
        </Reveal>
      )}
      {hasHeading && (
        <MarkerHeading
          as={as}
          size={size}
          autoMarker={autoMarker}
          markerTone={markerTone}
          {...(typeof heading === "string" ? { text: heading } : { field: heading })}
        />
      )}
      {hasDescription && (
        <Reveal delay={0.15} className={cn("text-[16px] leading-relaxed text-body md:text-[18px]", centered && "max-w-[640px]")}>
          {typeof description === "string" ? <p>{description}</p> : <PrismicRichText field={description} />}
        </Reveal>
      )}
      {children && <Reveal delay={0.25}>{children}</Reveal>}
    </div>
  );
}
