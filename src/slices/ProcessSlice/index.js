import { Process } from "@/components/Process";

/**
 * @typedef {import("@prismicio/client").Content.ProcessSliceSlice} ProcessSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ProcessSliceSlice>} ProcessSliceProps
 * @type {import("react").FC<ProcessSliceProps>}
 */
const ProcessSlice = ({ slice }) => <Process slice={slice} />;

export default ProcessSlice;
