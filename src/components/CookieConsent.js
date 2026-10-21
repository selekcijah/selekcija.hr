"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import * as prismic from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@/components/PrismicRichText";
import { buttonClasses, ArrowIcon } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { COOKIE_KEY, hasTrackingConsent } from "@/lib/cookies";

const FALLBACKS = {
  hr: {
    tabConsent: "Privola",
    tabDetails: "Pojedinosti",
    tabAbout: "O nama",
    title: "Ova web-stranica koristi kolačiće",
    consentBody:
      "Ova stranica voli kolačiće. Pomažu nam da stranica radi bolje, oglasi budu pametniji, a statistika preciznija. Izaberi što želiš: sve, ništa ili po svom ukusu.",
    detailsBody:
      "Ovdje možeš uključiti ili isključiti kategorije kolačića. Nužni kolačići su uvijek aktivni jer omogućuju osnovni rad stranice.",
    aboutBody:
      "Kolačići su male tekstualne datoteke koje web-stranice mogu koristiti kako bi učinile korisničko iskustvo učinkovitijim. Zakon kaže da možemo pohraniti kolačiće na vaš uređaj ako su nužni za rad ove stranice. Za sve ostale vrste kolačića trebamo vašu dozvolu. Možete promijeniti ili povući privolu u bilo kojem trenutku.",
    customize: "Prilagodi",
    allow: "Dopusti sve",
    deny: "Samo nužno",
    save: "Dopusti odabrano",
    categories: {
      necessary: { label: "Nužni", description: "Potrebni za osnovni rad stranice. Uvijek aktivni." },
      preferences: { label: "Preferencije", description: "Pamte vaše postavke i personaliziraju iskustvo." },
      statistics: { label: "Statistika", description: "Pomažu nam razumjeti kako se stranica koristi." },
      marketing: { label: "Marketing", description: "Koriste se za relevantnije oglase i kampanje." },
    },
  },
  en: {
    tabConsent: "Consent",
    tabDetails: "Details",
    tabAbout: "About",
    title: "This website uses cookies",
    consentBody:
      "This site uses cookies to run better, make ads smarter, and keep stats accurate. Choose what you want: all, none, or customize.",
    detailsBody:
      "Turn cookie categories on or off. Necessary cookies stay on because they keep the site working.",
    aboutBody:
      "Cookies are small text files that websites can use to make the user experience more efficient. The law says we can store cookies on your device if they are strictly necessary. For all other types we need your permission. You can change or withdraw consent at any time.",
    customize: "Customize",
    allow: "Allow all",
    deny: "Necessary only",
    save: "Allow selection",
    categories: {
      necessary: { label: "Necessary", description: "Required for basic site functionality. Always on." },
      preferences: { label: "Preferences", description: "Remember your settings and personalize the experience." },
      statistics: { label: "Statistics", description: "Help us understand how the site is used." },
      marketing: { label: "Marketing", description: "Used for more relevant ads and campaigns." },
    },
  },
};

const CATEGORY_KEYS = ["necessary", "preferences", "statistics", "marketing"];

const richTextComponents = {
  paragraph: ({ children }) => <p className="mb-3 text-[14px] leading-relaxed text-body last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  hyperlink: ({ children, node }) => (
    <PrismicNextLink
      field={node.data}
      className="font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-primary-hover hover:decoration-primary"
    >
      {children}
    </PrismicNextLink>
  ),
};

function textOrFallback(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

const titleRichTextComponents = {
  paragraph: ({ children }) => <>{children}</>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  hyperlink: ({ children, node }) => (
    <PrismicNextLink
      field={node.data}
      className="text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-primary-hover"
    >
      {children}
    </PrismicNextLink>
  ),
};

function BodyBlock({ field, fallback }) {
  if (prismic.isFilled.richText(field)) {
    return <PrismicRichText field={field} components={richTextComponents} />;
  }
  return <p className="text-[14px] leading-relaxed text-body">{fallback}</p>;
}

function Toggle({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        checked ? "bg-primary shadow-[0_0_16px_-2px_rgba(34,124,255,0.8)]" : "bg-white/15",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-ink shadow transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

/**
 * @param {{ settings?: import("@prismicio/client").Content.SettingsDocument | null, lang?: string }} props
 */
export default function CookieConsent({ settings, lang: langProp }) {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState("consent");
  const [categories, setCategories] = useState({
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false,
  });

  const lang = (langProp || "hr").startsWith("en") ? "en" : "hr";
  const fb = FALLBACKS[lang];
  const d = settings?.data ?? {};

  const copy = useMemo(
    () => ({
      tabConsent: textOrFallback(d.cookie_tab_consent, fb.tabConsent),
      tabDetails: textOrFallback(d.cookie_tab_details, fb.tabDetails),
      tabAbout: textOrFallback(d.cookie_tab_about, fb.tabAbout),
      customize: textOrFallback(d.cookie_customize_label, fb.customize),
      allow: textOrFallback(d.cookie_allow_label, fb.allow),
      deny: textOrFallback(d.cookie_deny_label, fb.deny),
      save: textOrFallback(d.cookie_save_label, fb.save),
    }),
    [d, fb],
  );

  const titleFilled = prismic.isFilled.richText(d.cookie_title);
  const titleText = titleFilled ? prismic.asText(d.cookie_title) : fb.title;

  const tabs = [
    { id: "consent", label: copy.tabConsent },
    { id: "details", label: copy.tabDetails },
    { id: "about", label: copy.tabAbout },
  ];

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function persist(value) {
    localStorage.setItem(COOKIE_KEY, value);
    if (hasTrackingConsent(value)) {
      window.dispatchEvent(new Event("cookieConsentAccepted"));
    }
    setVisible(false);
  }

  function handleAllowAll() {
    persist("accepted");
  }

  function handleDeny() {
    persist("declined");
  }

  function handleSaveSelection() {
    const payload = {
      necessary: true,
      preferences: categories.preferences,
      statistics: categories.statistics,
      marketing: categories.marketing,
    };
    const anyOptional = payload.preferences || payload.statistics || payload.marketing;
    persist(anyOptional ? JSON.stringify(payload) : "declined");
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={titleText}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[9999] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:left-5 md:left-1/2 md:right-auto md:w-[min(920px,calc(100vw-2.5rem))] md:-translate-x-1/2"
        >
          <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-surface-2/95 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_0%,rgba(34,124,255,0.18),transparent_55%)]"
            />

            <div className="relative flex items-center border-b border-line px-3 pt-2 sm:px-5">
              <div className="flex min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {tabs.map((item) => {
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      className={cn(
                        "relative shrink-0 px-3 py-3 text-[13px] font-semibold transition-colors focus-visible:!outline-none sm:px-4 sm:text-[14px]",
                        active ? "text-primary" : "text-muted hover:text-ink",
                      )}
                    >
                      {item.label}
                      {active && (
                        <span
                          aria-hidden
                          className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-primary shadow-[0_0_10px_rgba(34,124,255,0.9)]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative max-h-[min(52vh,420px)] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              {tab === "consent" && (
                <div className="space-y-3">
                  <h2 className="font-heading text-[20px] font-bold leading-snug tracking-[-0.02em] text-ink sm:text-[24px]">
                    {titleFilled ? (
                      <PrismicRichText field={d.cookie_title} components={titleRichTextComponents} />
                    ) : (
                      fb.title
                    )}
                  </h2>
                  <BodyBlock field={d.cookie_consent_body} fallback={fb.consentBody} />
                </div>
              )}

              {tab === "details" && (
                <div className="space-y-5">
                  <BodyBlock field={d.cookie_details_body} fallback={fb.detailsBody} />
                  <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/50">
                    {CATEGORY_KEYS.map((key) => {
                      const meta = fb.categories[key];
                      const locked = key === "necessary";
                      return (
                        <li key={key} className="flex items-start justify-between gap-4 px-4 py-3.5 sm:px-5">
                          <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-ink">{meta.label}</p>
                            <p className="mt-0.5 text-[13px] leading-snug text-muted">{meta.description}</p>
                          </div>
                          <Toggle
                            label={meta.label}
                            checked={categories[key]}
                            disabled={locked}
                            onChange={(next) => setCategories((prev) => ({ ...prev, [key]: next }))}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {tab === "about" && <BodyBlock field={d.cookie_about_body} fallback={fb.aboutBody} />}
            </div>

            <div className="relative flex flex-col-reverse gap-2 border-t border-line bg-surface/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
              {tab === "details" ? (
                <>
                  <button type="button" onClick={handleDeny} className={buttonClasses({ variant: "ghost", size: "sm" })}>
                    {copy.deny}
                  </button>
                  <button type="button" onClick={handleSaveSelection} className={buttonClasses({ size: "sm", className: "px-6" })}>
                    {copy.save}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setTab("details")}
                    className={buttonClasses({ variant: "ghost", size: "sm", className: "gap-1.5" })}
                  >
                    {copy.customize}
                    <ArrowIcon className="size-3.5" />
                  </button>
                  <button type="button" onClick={handleAllowAll} className={buttonClasses({ size: "sm", className: "px-6" })}>
                    {copy.allow}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
