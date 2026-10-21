import { PrismicRichText } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import ChartClient from "./ChartClient";
import { Section } from "@/components/ui/Section";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

/**
 * @typedef {import("@prismicio/client").Content.ChartSliceSlice} ChartSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ChartSliceSlice>} ChartSliceProps
 * @type {import("react").FC<ChartSliceProps>}
 */
const ChartSlice = ({ slice }) => {
  const { heading, description, chart_type, chart_color } = slice.primary;

  const data = (slice.items ?? [])
    .filter((item) => item.label && item.value != null)
    .map((item) => ({
      label: item.label,
      value: Number(item.value),
    }));

  return (
    <Section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      {prismic.isFilled.richText(heading) && (
        <MarkerHeading field={heading} size="lg" className="mx-auto mb-10 max-w-[760px] text-center" />
      )}

      <Reveal>
        <GlassCard spotlight={false} innerClassName="p-4 md:p-8">
          <ChartClient type={chart_type ?? "bar"} data={data} color={chart_color ?? "#227cff"} />
        </GlassCard>
      </Reveal>

      {prismic.isFilled.richText(description) && (
        <div className="mx-auto mt-8 max-w-[760px] text-center text-body">
          <PrismicRichText field={description} />
        </div>
      )}
    </Section>
  );
};

export default ChartSlice;
