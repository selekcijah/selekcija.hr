import * as prismic from "@prismicio/client";
import { MarkerHeading } from "./ui/MarkerHeading";
import { NeuralMark } from "./ui/NeuralMark";

export function SmallHero({ slice }) {
  const { heading } = slice.primary;
  if (!prismic.isFilled.richText(heading)) return null;

  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_15%_0%,rgba(34,124,255,0.22),transparent_65%)]" />
        <div className="bg-grid absolute inset-0" />
        <NeuralMark className="animate-float-slow absolute -right-10 top-1/2 w-[220px] -translate-y-1/2 text-primary/15 md:right-[6%] md:w-[300px]" />
        <div className="absolute -right-10 top-1/2 size-[360px] -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] md:right-[4%]" />
      </div>
      <div className="mx-auto w-full max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
        <MarkerHeading field={heading} as="h1" size="xl" autoMarker={1} className="max-w-[880px]" />
      </div>
    </section>
  );
}
