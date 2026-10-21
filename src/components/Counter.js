"use client";

import { Section, surfaceFor } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import CountUpNumber from "@/components/CountUpNumber";

/**
 * @param {import("@prismicio/client").Content.CounterSliceSlice} slice
 */
export function Counter({ slice }) {
  const items = slice.items || [];

  return (
    <Section variant={surfaceFor(slice.variation)} padding="tight" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {items.map((item, index) => (
          <Reveal key={index} delay={index * 0.08} className="rounded-2xl border border-line bg-surface-3/40 px-5 py-8 text-center md:px-6">
            <p className="font-heading text-[40px] font-bold leading-none tracking-[-0.04em] text-ink md:text-[56px]">
              <CountUpNumber value={item.value ?? 0} suffix={item.suffix || "+"} />
            </p>
            {item.label && <p className="mt-3 text-[14px] text-body">{item.label}</p>}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
