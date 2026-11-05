import * as prismic from "@prismicio/client";
import { Section } from "@/components/ui/Section";
import { ScrollActionsClient } from "./ScrollActionsClient";

/**
 * @typedef {import("@prismicio/client").Content.ScrollActionsSliceSlice} ScrollActionsSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ScrollActionsSliceSlice>} ScrollActionsSliceProps
 * @type {import("react").FC<ScrollActionsSliceProps>}
 */
const ScrollActionsSlice = ({ slice }) => {
  const actions = (slice.primary.actions ?? []).filter(
    (item) => prismic.isFilled.richText(item.heading) || prismic.isFilled.link(item.button),
  );

  if (!actions.length && !prismic.isFilled.richText(slice.primary.heading) && !slice.primary.tagline) {
    return null;
  }

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      padding="none"
      className="overflow-x-clip"
    >
      <ScrollActionsClient
        tagline={slice.primary.tagline}
        heading={slice.primary.heading}
        actions={actions}
      />
    </Section>
  );
};

export default ScrollActionsSlice;
