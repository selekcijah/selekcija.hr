import * as prismic from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { ArrowIcon } from "./ui/Button";
import { MarkerHeading } from "./ui/MarkerHeading";
import { NeuralMark } from "./ui/NeuralMark";
import { Reveal } from "./ui/Reveal";

const SOCIAL_ICONS = {
  Facebook: (
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" fill="currentColor" />
  ),
  X: (
    <path d="M17.5 3.5h3l-6.6 7.5 7.8 9.5h-6.1l-4.8-5.9-5.5 5.9h-3l7-7.9L1.8 3.5h6.2l4.3 5.4 5.2-5.4zm-1 15.2h1.7L7.1 5.2H5.3l11.2 13.5z" fill="currentColor" />
  ),
  LinkedIn: (
    <path d="M6.9 8.8H3.8V20h3.1V8.8zM5.4 4a1.8 1.8 0 100 3.6 1.8 1.8 0 000-3.6zM20.2 13.6c0-3-1.6-4.9-4.3-4.9-1.4 0-2.4.8-2.8 1.5V8.8h-3V20h3.1v-5.6c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.1v-6.4z" fill="currentColor" />
  ),
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </>
  ),
};

export function Footer({ navigation, settings, lang }) {
  const links = navigation?.data?.links ?? [];
  const rawSubLinks = navigation?.data?.sub_links ?? [];
  const rawNestedLinks = navigation?.data?.nested_links ?? [];
  const d = settings?.data ?? {};

  const subLinksMap = rawSubLinks.reduce((acc, sub) => {
    const key = (sub.parent_label ?? "").trim();
    if (!key) return acc;
    (acc[key] ??= []).push(sub);
    return acc;
  }, {});

  const nestedLinksMap = rawNestedLinks.reduce((acc, nested) => {
    const key = (nested.parent_label ?? "").trim();
    if (!key) return acc;
    (acc[key] ??= []).push(nested);
    return acc;
  }, {});

  const menuItems = links.flatMap((item) => {
    const label = prismic.asText(item.label);
    const children = (subLinksMap[label] ?? []).filter(
      (child) => prismic.isFilled.link(child.link) || (nestedLinksMap[prismic.asText(child.label)] ?? []).some((n) => prismic.isFilled.link(n.link)),
    );
    if (children.length > 0) {
      return [
        {
          type: "group",
          label,
          children: children.map((child) => ({
            ...child,
            nested: (nestedLinksMap[prismic.asText(child.label)] ?? []).filter((n) => prismic.isFilled.link(n.link)),
          })),
        },
      ];
    }
    if (prismic.isFilled.link(item.link)) return [{ type: "link", label, link: item.link, richLabel: item.label }];
    return [];
  });
  const menuLinks = menuItems.filter((item) => item.type === "link");
  const menuGroups = menuItems.filter((item) => item.type === "group");
  const socialLinks = [
    { url: d.facebookUrl, label: "Facebook" },
    { url: d.twitterUrl, label: "X" },
    { url: d.linkedinUrl, label: "LinkedIn" },
    { url: d.instagramUrl, label: "Instagram" },
  ].filter((s) => s.url);

  const t = {
    hr: { quickLinks: "Menu", contactInfo: "Kontakt informacije" },
    en: { quickLinks: "Quick Links", contactInfo: "Contact Info" },
  }[lang] ?? { quickLinks: "Quick Links", contactInfo: "Contact Info" };

  const email = d.contactEmail || "hello@example.com";

  return (
    <footer className="relative isolate overflow-hidden border-t border-line">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(34,124,255,0.18),transparent_70%)]" />
        <div className="bg-grid absolute inset-0 opacity-50" />
        <NeuralMark className="absolute -bottom-40 -right-24 w-[520px] text-primary/[0.07] md:w-[720px]" />
      </div>

      <div className="mx-auto w-full max-w-[1240px] px-5 md:px-8">
        <div className="flex flex-col items-center border-b border-line py-20 text-center md:py-28">
          <MarkerHeading as="h2" size="display" text={d.footerHeading || "Let's Talk With Us"} autoMarker={1} />
          <Reveal delay={0.2}>
            <a
              href={`mailto:${email}`}
              className="group mt-8 inline-flex items-center gap-3 border-b border-line-strong pb-2 text-[22px] font-medium text-ink transition-colors hover:border-primary hover:text-primary md:text-[34px]"
            >
              {email}
              <ArrowIcon className="size-6 -rotate-45 transition-transform group-hover:rotate-0" />
            </a>
          </Reveal>
          {socialLinks.length > 0 && (
            <Reveal delay={0.3} as="ul" className="mt-10 flex flex-wrap justify-center gap-3">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-4 py-2 text-[14px] text-body transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-ink"
                  >
                    <svg viewBox="0 0 24 24" className="size-4 text-ink" aria-hidden="true">
                      {SOCIAL_ICONS[s.label]}
                    </svg>
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </Reveal>
          )}
        </div>

        <div className="grid gap-12 py-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Link href="/" className="inline-block" aria-label="selekcija">
              <BrandLogo field={prismic.isFilled.image(d.footerLogo) ? d.footerLogo : d.logo} className="h-12 w-auto" />
            </Link>
            <p className="mt-6 max-w-[380px] text-[15px] leading-relaxed text-body">
              {prismic.isFilled.richText(d.footerDescription)
                ? prismic.asText(d.footerDescription)
                : "Your trusted partner in finding and nurturing top talent—creating lasting success for businesses and careers."}
            </p>
          </div>

          {menuItems.length > 0 && (
            <div className="md:col-span-5">
              <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-muted">{t.quickLinks}</h3>
              {menuLinks.length > 0 && (
                <ul className={`grid gap-3${menuGroups.length > 0 ? " mb-6" : ""}`}>
                  {menuLinks.map((item) => (
                    <li key={item.label}>
                      <PrismicNextLink
                        field={item.link}
                        className="group inline-flex items-center gap-2 text-[15px] text-body transition-colors hover:text-ink"
                      >
                        <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-3" />
                        <PrismicText field={item.richLabel} />
                      </PrismicNextLink>
                    </li>
                  ))}
                </ul>
              )}
              {menuGroups.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {menuGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-[15px] font-medium text-ink">{group.label}</p>
                      <ul className="mt-2 grid gap-2 border-l border-line pl-3">
                        {group.children.map((child) => {
                          const childLabel = prismic.asText(child.label);
                          const nested = child.nested ?? [];
                          return (
                            <li key={childLabel}>
                              {prismic.isFilled.link(child.link) ? (
                                <PrismicNextLink
                                  field={child.link}
                                  className="text-[14px] text-body transition-colors hover:text-ink"
                                >
                                  <PrismicText field={child.label} />
                                </PrismicNextLink>
                              ) : (
                                <span className="text-[14px] font-medium text-ink">
                                  <PrismicText field={child.label} />
                                </span>
                              )}
                              {nested.length > 0 && (
                                <ul className="mt-1.5 grid gap-1.5 border-l border-line pl-3">
                                  {nested.map((item3) => (
                                    <li key={prismic.asText(item3.label)}>
                                      <PrismicNextLink
                                        field={item3.link}
                                        className="text-[13px] text-muted transition-colors hover:text-ink"
                                      >
                                        <PrismicText field={item3.label} />
                                      </PrismicNextLink>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="md:col-span-3">
            <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-muted">{t.contactInfo}</h3>
            <ul className="grid gap-4 text-[15px]">
              {d.phone && (
                <li className="flex flex-col gap-0.5">
                  <b className="text-[12px] font-medium uppercase tracking-wider text-muted">Call:</b>
                  <a href={`tel:${d.phone}`} className="text-ink transition-colors hover:text-primary">{d.phone}</a>
                </li>
              )}
              {d.contactEmail && (
                <li className="flex flex-col gap-0.5">
                  <b className="text-[12px] font-medium uppercase tracking-wider text-muted">Email:</b>
                  <a href={`mailto:${d.contactEmail}`} className="text-ink transition-colors hover:text-primary">{d.contactEmail}</a>
                </li>
              )}
              {d.address && (
                <li className="flex flex-col gap-0.5">
                  <b className="text-[12px] font-medium uppercase tracking-wider text-muted">Address:</b>
                  <span className="text-ink">{d.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-7 text-[13px] text-muted md:flex-row">
          <p>
            © <span className="text-ink">selekcija</span>. All rights reserved.
          </p>
          <a
            href="https://killerclick.com"
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-muted/70 transition-colors hover:text-ink"
          >
            Web by Killer Click.
          </a>
          {(prismic.isFilled.link(d.privacy_link) ||
            prismic.isFilled.link(d.terms_link) ||
            prismic.isFilled.link(d.cookie_page_link)) && (
            <ul className="flex flex-wrap justify-center gap-6">
              {prismic.isFilled.link(d.privacy_link) && (
                <li>
                  <PrismicNextLink field={d.privacy_link} className="transition-colors hover:text-ink">
                    {d.privacy_link.text || (lang?.startsWith("en") ? "Privacy Policy" : "Politika privatnosti")}
                  </PrismicNextLink>
                </li>
              )}
              {prismic.isFilled.link(d.terms_link) && (
                <li>
                  <PrismicNextLink field={d.terms_link} className="transition-colors hover:text-ink">
                    {d.terms_link.text || (lang?.startsWith("en") ? "Terms of Service" : "Uvjeti korištenja")}
                  </PrismicNextLink>
                </li>
              )}
              {prismic.isFilled.link(d.cookie_page_link) && (
                <li>
                  <PrismicNextLink field={d.cookie_page_link} className="transition-colors hover:text-ink">
                    {d.cookie_page_link.text || (lang?.startsWith("en") ? "Cookie Consent" : "Privola za kolačiće")}
                  </PrismicNextLink>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
