import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

const ALIGN = {
  left: "left",
  center: "center",
  right: "left",
};

const SIZE = {
  h1: "display",
  h2: "lg",
  h3: "md",
};

const COLOR = {
  dark: "text-ink",
  white: "text-ink",
  primary: "text-primary",
  secondary: "text-mint",
};

/**
 * @typedef {import("@prismicio/client").Content.HeadingSliceSlice} HeadingSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<HeadingSliceSlice>} HeadingSliceProps
 * @type {import("react").FC<HeadingSliceProps>}
 */
const HeadingSlice = ({ slice }) => {
  const { subtitle, heading, heading_level, alignment, color } = slice.primary;

  if (!subtitle && !heading) return null;

  const level = heading_level === "h1" || heading_level === "h3" ? heading_level : "h2";

  return (
    <Section padding="tight" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <SectionHeader
        tagline={subtitle}
        heading={heading}
        as={level}
        size={SIZE[level]}
        align={ALIGN[alignment] ?? "left"}
        className={COLOR[color] ?? COLOR.dark}
      />
    </Section>
  );
};

export default HeadingSlice;
