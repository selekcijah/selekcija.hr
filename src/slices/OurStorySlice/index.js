import { OurStory } from "@/components/OurStory";

/**
 * @typedef {import("@prismicio/client").Content.OurStorySliceSlice} OurStorySliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<OurStorySliceSlice>} OurStorySliceProps
 * @type {import("react").FC<OurStorySliceProps>}
 */
const OurStorySlice = ({ slice }) => <OurStory slice={slice} />;

export default OurStorySlice;
