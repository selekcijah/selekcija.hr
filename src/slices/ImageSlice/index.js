import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { Section } from "@/components/ui/Section";
import { cn } from "@/components/ui/cn";

const WIDTH_CLASSES = {
  narrow: "max-w-[680px]",
  default: "max-w-[900px]",
  wide: "max-w-[1100px]",
  full: "max-w-full",
};

const ALIGNMENT_CLASSES = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

/**
 * @typedef {import("@prismicio/client").Content.ImageSliceSlice} ImageSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ImageSliceSlice>} ImageSliceProps
 * @type {import("react").FC<ImageSliceProps>}
 */
const ImageSlice = ({ slice }) => {
  const { image, caption, width, alignment, rounded } = slice.primary;

  if (!prismic.isFilled.image(image)) return null;

  return (
    <Section padding="tight" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <figure className={cn("w-full", WIDTH_CLASSES[width] ?? WIDTH_CLASSES.default, ALIGNMENT_CLASSES[alignment] ?? ALIGNMENT_CLASSES.center)}>
        <PrismicNextImage
          field={image}
          fallbackAlt=""
          className={cn("h-auto w-full border border-line object-cover", rounded ? "rounded-[20px]" : "rounded-none")}
        />
        {caption && <figcaption className="mt-4 text-[14px] leading-6 text-muted">{caption}</figcaption>}
      </figure>
    </Section>
  );
};

export default ImageSlice;
