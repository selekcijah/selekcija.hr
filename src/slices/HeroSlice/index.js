import { Hero } from "@/components/Hero";

/**
 * @typedef {import("@prismicio/client").Content.HeroSliceSlice} HeroSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<HeroSliceSlice>} HeroSliceProps
 * @type {import("react").FC<HeroSliceProps>}
 */
const HeroSlice = ({ slice }) => <Hero slice={slice} />;

export default HeroSlice;
