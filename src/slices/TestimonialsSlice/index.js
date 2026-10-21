import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

/**
 * @typedef {import("@prismicio/client").Content.TestimonialsSliceSlice} TestimonialsSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TestimonialsSliceSlice>} TestimonialsSliceProps
 * @type {import("react").FC<TestimonialsSliceProps>}
 */
const TestimonialsSlice = ({ slice }) => {
  const { primary, items } = slice;

  return (
    <Section variant="glow" size="wide">
      <SectionHeader tagline={primary.tagline} heading={primary.heading} autoMarker={2} className="mb-14 md:mb-16" />
      {items?.length > 0 && (
        <Reveal delay={0.1}>
          <TestimonialsCarousel items={items} />
        </Reveal>
      )}
    </Section>
  );
};

export default TestimonialsSlice;
