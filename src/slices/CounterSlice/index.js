import { Counter } from "@/components/Counter";

/**
 * @typedef {import("@prismicio/client").Content.CounterSliceSlice} CounterSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<CounterSliceSlice>} CounterSliceProps
 * @type {import("react").FC<CounterSliceProps>}
 */
const CounterSlice = ({ slice }) => <Counter slice={slice} />;

export default CounterSlice;
