import { SmallHero } from "@/components/SmallHero";

/**
 * @typedef {import("@prismicio/client").Content.SmallHeroSliceSlice} SmallHeroSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<SmallHeroSliceSlice>} SmallHeroSliceProps
 * @type {import("react").FC<SmallHeroSliceProps>}
 */
const SmallHeroSlice = ({ slice }) => <SmallHero slice={slice} />;

export default SmallHeroSlice;
