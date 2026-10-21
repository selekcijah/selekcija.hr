import * as prismic from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon, buttonClasses } from "@/components/ui/Button";
import { NeuralMark } from "@/components/ui/NeuralMark";
import { ParticlesLayer } from "@/components/ui/ParticlesLayer";
import { cn } from "@/components/ui/cn";

/**
 * @typedef {import("@prismicio/client").Content.CtaSliceSlice} CtaSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<CtaSliceSlice>} CtaSliceProps
 * @type {import("react").FC<CtaSliceProps>}
 */
const CtaSlice = ({ slice, context }) => {
  const { primary, variation } = slice;
  const lang = context?.lang ?? "hr";
  const isGreen = variation === "greenBg";

  const heading = primary.heading || (lang === "hr" ? "Spremni za transformaciju vašeg radnog mjesta?" : "Ready To Transform Your Workplace?");
  const description = primary.description || "";
  const buttonLabel = primary.button_label || (lang === "hr" ? "Počnite odmah" : "Start Now");

  const hasButtonLink = prismic.isFilled.link(primary.button_link);
  const contactHref = lang === "hr" ? "/kontakt" : "/en/kontakt";
  const btnClass = buttonClasses({ variant: isGreen ? "mint" : "primary", size: "lg" });

  return (
    <section className="relative isolate px-5 py-16 md:px-8 md:py-24">
      <Reveal y={40} className="mx-auto max-w-[1240px]">
        <div
          className={cn(
            "relative overflow-hidden rounded-[28px] p-px md:rounded-[36px]",
            isGreen
              ? "bg-[linear-gradient(135deg,rgba(69,217,150,0.7),rgba(255,255,255,0.08)_40%,rgba(34,124,255,0.6))]"
              : "bg-[linear-gradient(135deg,rgba(34,124,255,0.8),rgba(255,255,255,0.08)_45%,rgba(34,124,255,0.4))]",
          )}
        >
          <div className="relative isolate overflow-hidden rounded-[27px] bg-surface-2 px-6 py-14 md:rounded-[35px] md:px-14 md:py-20 lg:px-20">
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 -z-10",
                isGreen
                  ? "bg-[radial-gradient(ellipse_60%_80%_at_100%_100%,rgba(69,217,150,0.28),transparent_60%),radial-gradient(ellipse_50%_70%_at_0%_0%,rgba(34,124,255,0.3),transparent_60%)]"
                  : "bg-[radial-gradient(ellipse_70%_90%_at_100%_0%,rgba(34,124,255,0.4),transparent_60%),radial-gradient(ellipse_40%_60%_at_0%_100%,rgba(34,124,255,0.2),transparent_60%)]",
              )}
            />
            <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <ParticlesLayer className="-z-10 opacity-80" count={90} spread={9} />
            <NeuralMark
              className={cn(
                "animate-float-slow pointer-events-none absolute -bottom-24 -right-16 -z-10 w-[280px] opacity-[0.06] md:w-[440px]",
                isGreen ? "text-mint" : "text-primary",
              )}
            />

            <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
              <div>
                <MarkerHeading text={heading} size="xl" autoMarker={2} markerTone={isGreen ? "mint" : "blue"} />
                {description && (
                  <Reveal delay={0.2} className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-body md:text-[19px]">
                    <p>{description}</p>
                  </Reveal>
                )}
              </div>

              <Reveal delay={0.3} className="flex flex-col items-start lg:items-end">
                {hasButtonLink ? (
                  <PrismicNextLink field={primary.button_link} className={btnClass}>
                    <span>{buttonLabel}</span>
                    <ArrowIcon />
                  </PrismicNextLink>
                ) : (
                  <Link href={contactHref} className={btnClass}>
                    <span>{buttonLabel}</span>
                    <ArrowIcon />
                  </Link>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default CtaSlice;
