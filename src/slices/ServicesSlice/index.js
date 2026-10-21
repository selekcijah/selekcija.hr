import { Services } from "@/components/Services";

/**
 * @typedef {import("@prismicio/client").Content.ServicesSliceSlice} ServicesSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ServicesSliceSlice>} ServicesSliceProps
 * @type {import("react").FC<ServicesSliceProps>}
 */
const ServicesSlice = ({ slice }) => <Services slice={slice} />;

export default ServicesSlice;
