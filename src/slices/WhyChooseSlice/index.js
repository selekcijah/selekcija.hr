import { WhyChoose } from "@/components/WhyChoose";

/**
 * @typedef {import("@prismicio/client").Content.WhyChooseSliceSlice} WhyChooseSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<WhyChooseSliceSlice>} WhyChooseSliceProps
 * @type {import("react").FC<WhyChooseSliceProps>}
 */
const WhyChooseSlice = ({ slice }) => <WhyChoose slice={slice} />;

export default WhyChooseSlice;
