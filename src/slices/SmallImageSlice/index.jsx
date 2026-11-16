import * as prismic from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@/components/PrismicRichText";
import { Section } from "@/components/ui/Section";

const textComponents = {
  heading2: ({ children }) => (
    <h2 className="mb-2 font-heading text-[18px] font-semibold leading-snug text-muted last:mb-0 md:text-[20px]">
      {children}
    </h2>
  ),
  heading3: ({ children }) => (
    <h3 className="mb-2 font-heading text-[16px] font-semibold leading-snug text-muted last:mb-0">{children}</h3>
  ),
  paragraph: ({ children }) => <p className="mb-2 text-[14px] leading-6 text-muted last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-muted">{children}</strong>,
  hyperlink: ({ children, node }) => (
    <PrismicNextLink
      field={node.data}
      className="text-primary underline! decoration-primary! underline-offset-[3px] transition-colors hover:text-ink"
    >
      {children}
    </PrismicNextLink>
  ),
};

/**
 * @typedef {import("@prismicio/client").Content.SmallImageSliceSlice} SmallImageSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<SmallImageSliceSlice>} SmallImageSliceProps
 * @type {import("react").FC<SmallImageSliceProps>}
 */
const SmallImageSlice = ({ slice }) => {
  const { image, text } = slice.primary;
  const hasImage = prismic.isFilled.image(image);
  const hasText = prismic.isFilled.richText(text);

  if (!hasImage && !hasText) return null;

  return (
    <Section
      padding="tight"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-12">
        {hasImage && (
          <PrismicNextImage
            field={image}
            fallbackAlt=""
            className="h-auto w-full max-w-[280px] shrink-0 object-contain md:w-[300px]"
          />
        )}
        {hasText && (
          <div className="min-w-0 w-full flex-1">
            <PrismicRichText field={text} components={textComponents} />
          </div>
        )}
      </div>
    </Section>
  );
};

export default SmallImageSlice;
