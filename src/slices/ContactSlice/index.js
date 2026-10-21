import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { Reveal } from "@/components/ui/Reveal";
import { NeuralMark } from "@/components/ui/NeuralMark";
import { DarkMap } from "@/components/ui/DarkMap";
import { parseMapEmbedCoords } from "@/lib/mapCoords";
import { ContactForm } from "./ContactForm";

const INFO_HEADING = { hr: "Kontaktirajte nas", en: "Get In Touch" };
const OFFICES_HEADING = { hr: "Naši uredi", en: "Our Offices" };

const ICON_PATHS = {
  phone: "M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
};

function InfoRow({ icon, label, children }) {
  return (
    <li className="group flex items-start gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
          <path d={ICON_PATHS[icon]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="flex min-w-0 flex-col gap-1 pt-0.5">
        <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted">{label}</span>
        <span className="break-words text-[16px] font-medium text-ink">{children}</span>
      </div>
    </li>
  );
}

/**
 * @typedef {import("@prismicio/client").Content.ContactSliceSlice} ContactSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ContactSliceSlice>} ContactSliceProps
 * @type {import("react").FC<ContactSliceProps>}
 */
const ContactSlice = ({ slice, context }) => {
  const { primary, items } = slice;
  const settings = context?.settings?.data ?? {};
  const lang = context?.lang ?? "hr";

  const infoHeading = primary.info_heading || INFO_HEADING[lang] || INFO_HEADING.en;
  const officesHeading = OFFICES_HEADING[lang] || OFFICES_HEADING.en;
  const formHeading = primary.form_heading || (lang === "hr" ? "Pošaljite nam poruku" : "Send Us A Message");
  const formDesc = primary.form_description || (lang === "hr" ? "Ispunite obrazac i javit ćemo vam se u roku 24 sata." : "Fill out the form below and our team will get back to you within 24 hours.");
  const submitLabel = primary.submit_label || (lang === "hr" ? "Pošalji poruku" : "Send Message");
  const callLabel = lang === "hr" ? "Poziv" : "Call";
  const emailLabel = lang === "hr" ? "E-mail" : "Email";
  const addressLabel = lang === "hr" ? "Adresa" : "Address";
  const linkClass = "transition-colors hover:text-primary";
  const mapCoords = primary.show_map ? parseMapEmbedCoords(primary.map_embed_url) : null;

  return (
    <Section variant="glow">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface-2/70 p-7 md:p-10">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(34,124,255,0.22),transparent_60%)]" />
            <NeuralMark className="animate-float-slow pointer-events-none absolute -bottom-12 -right-10 w-56 text-primary opacity-[0.07]" />

            <div className="relative flex flex-col gap-10">
              <div>
                <MarkerHeading text={infoHeading} as="h2" size="md" autoMarker={1} className="mb-8" />
                <ul className="flex flex-col gap-6">
                  {settings.phone && (
                    <InfoRow icon="phone" label={callLabel}>
                      <a href={`tel:${settings.phone}`} className={linkClass}>
                        {settings.phone}
                      </a>
                    </InfoRow>
                  )}
                  {settings.contactEmail && (
                    <InfoRow icon="mail" label={emailLabel}>
                      <a href={`mailto:${settings.contactEmail}`} className={linkClass}>
                        {settings.contactEmail}
                      </a>
                    </InfoRow>
                  )}
                  {settings.address && (
                    <InfoRow icon="pin" label={addressLabel}>
                      {settings.address}
                    </InfoRow>
                  )}
                </ul>
              </div>

              {items && items.length > 0 && (
                <div className="border-t border-line pt-8">
                  <h3 className="mb-6 font-heading text-[20px] font-semibold text-ink">{officesHeading}</h3>
                  <div className="flex flex-col gap-5">
                    {items.map((item, i) => (
                      <div key={i} className="flex flex-col gap-1 rounded-2xl border border-line bg-white/[0.02] p-5">
                        {item.office_name && <h4 className="font-heading text-[16px] font-semibold text-ink">{item.office_name}</h4>}
                        {item.office_address && <span className="text-[14px] text-body">{item.office_address}</span>}
                        {item.office_hours && <span className="text-[14px] text-muted">{item.office_hours}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="lg:col-span-7">
          <GlassCard spotlight={false} className="h-full" innerClassName="p-7 md:p-10">
            <div className="mb-8">
              <h3 className="font-heading text-[26px] font-bold tracking-tight text-ink md:text-[32px]">{formHeading}</h3>
              <p className="mt-2 text-[15px] text-body">{formDesc}</p>
            </div>
            <ContactForm
              submitLabel={submitLabel}
              lang={lang}
              roleOptions={primary.role_options}
              roleLabel={primary.role_field_label}
            />
          </GlassCard>
        </Reveal>
      </div>

      {primary.show_map && primary.map_embed_url && (
        <Reveal delay={0.1} className="relative mt-6 overflow-hidden rounded-3xl border border-line bg-surface-2">
          <div className="h-[380px] w-full md:h-[460px]" role="img" aria-label={settings.address || addressLabel}>
            <DarkMap
              lat={mapCoords?.lat}
              lng={mapCoords?.lng}
              label={settings.address || "Selekcija.hr"}
            />
          </div>
        </Reveal>
      )}
    </Section>
  );
};

export default ContactSlice;
