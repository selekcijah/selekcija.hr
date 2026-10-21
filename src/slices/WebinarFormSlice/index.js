import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { NeuralBackground } from "@/components/ui/NeuralBackground";
import { Reveal } from "@/components/ui/Reveal";
import WebinarForm from "./WebinarForm";

/**
 * @typedef {import("@prismicio/client").Content.WebinarFormSliceSlice} WebinarFormSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<WebinarFormSliceSlice>} WebinarFormSliceProps
 * @type {import("react").FC<WebinarFormSliceProps>}
 */
const WebinarFormSlice = ({ slice, context }) => {
  const { primary } = slice;
  const lang = context?.lang === "en" ? "en" : "hr";

  const heading =
    primary.heading || (lang === "hr" ? "Prijavite se na sljedeći webinar" : "Register for the next webinar");
  const description =
    primary.description ||
    (lang === "hr"
      ? "Ispunite obrazac i obavijestit ćemo vas o nadolazećim webinarima."
      : "Fill out the form and we'll notify you about upcoming webinars.");
  const submitLabel = primary.submit_label || (lang === "hr" ? "Prijavi se" : "Register");

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="relative isolate px-5 py-16 md:px-8 md:py-24">
      <Reveal y={40} className="mx-auto max-w-[1240px]">
        <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(34,124,255,0.7),rgba(255,255,255,0.06)_60%)] p-px md:rounded-[36px]">
          <div className="relative isolate overflow-hidden rounded-[27px] bg-surface-2 px-6 py-14 md:rounded-[35px] md:px-16 md:py-20">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(34,124,255,0.35),transparent_65%)]" />
            <NeuralBackground
              className="-z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
              maxNodes={70}
              linkDistance={140}
              interactive={false}
            />

            <div className="relative mx-auto max-w-[720px] text-center">
              <MarkerHeading text={heading} size="xl" autoMarker={2} className="mx-auto" />
              {description && <p className="mx-auto mt-5 max-w-[600px] text-[16px] leading-relaxed text-body md:text-[18px]">{description}</p>}
              <div className="mt-10 text-left">
                <WebinarForm
                  submitLabel={submitLabel}
                  consentLabel={primary.consent_label}
                  brevoListId={primary.brevo_list_id}
                  lang={lang}
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default WebinarFormSlice;
