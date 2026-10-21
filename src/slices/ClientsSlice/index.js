import * as prismic from "@prismicio/client";
import LogoLoop from "@/components/reactbits/LogoLoop";
import { MonoLogo } from "@/components/ui/MonoLogo";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * @typedef {import("@prismicio/client").Content.ClientsSliceSlice} ClientsSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ClientsSliceSlice>} ClientsSliceProps
 * @type {import("react").FC<ClientsSliceProps>}
 */
const ClientsSlice = ({ slice }) => {
  const { primary, items } = slice;
  const logos = (items ?? [])
    .filter((item) => prismic.isFilled.image(item.logo) || item.logo_name)
    .map((item, i) => ({
      node: prismic.isFilled.image(item.logo) ? (
        <span key={i} className="block opacity-55 transition-opacity duration-300 hover:opacity-100">
          <MonoLogo
            src={`${item.logo.url.split("?")[0]}?auto=format&h=160`}
            alt={item.logo_name || item.logo.alt?.trim() || ""}
            className="h-[var(--logoloop-logoHeight)] w-auto"
          />
        </span>
      ) : (
        <span className="font-heading text-[22px] font-semibold text-ink/50">{item.logo_name}</span>
      ),
      title: item.logo_name || undefined,
    }));

  if (logos.length === 0) return null;

  const firstRow = logos.filter((_, i) => i % 2 === 0);
  const secondRow = logos.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative isolate overflow-x-clip border-y border-line py-14 md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_80%_at_50%_50%,rgba(34,124,255,0.08),transparent_70%)]" />
      {primary.heading && (
        <div className="mx-auto mb-12 max-w-[860px] px-5 text-center">
          <MarkerHeading text={primary.heading} size="md" autoMarker={1} />
        </div>
      )}

      <Reveal className="flex flex-col gap-8 md:gap-10">
        <LogoLoop logos={firstRow} speed={40} gap={56} logoHeight={64} pauseOnHover scaleOnHover fadeOut ariaLabel="Klijenti" />
        {secondRow.length > 0 && (
          <LogoLoop logos={secondRow} speed={40} direction="right" gap={56} logoHeight={64} pauseOnHover scaleOnHover fadeOut ariaLabel="Klijenti" />
        )}
      </Reveal>
    </section>
  );
};

export default ClientsSlice;
