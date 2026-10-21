"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import * as prismic from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { getHomeURL } from "@/i18n";
import { BrandLogo } from "./BrandLogo";
import { buttonClasses, ArrowIcon } from "./ui/Button";
import { cn } from "./ui/cn";

const EASE = [0.22, 1, 0.36, 1];

function Chevron({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={cn("size-4 transition-transform duration-300", className)}>
      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const normalize = (path) => (path || "").replace(/\/+$/, "") || "/";

export function NavbarClient({ locales = [], navigation, settings, lang }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [openNestedAccordion, setOpenNestedAccordion] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenAccordion(null);
    setOpenNestedAccordion(null);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const homeHref = getHomeURL(lang);
  const links = navigation?.data?.links ?? [];
  const rawSubLinks = navigation?.data?.sub_links ?? [];
  const rawNestedLinks = navigation?.data?.nested_links ?? [];

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

  const ctaLabel = navigation?.data?.cta_label || "Kontaktirajte nas";
  const ctaLink = navigation?.data?.cta_link;
  const current = normalize(pathname);
  const isActive = (link) => prismic.isFilled.link(link) && link.url && normalize(link.url) === current;
  const localeLabel = (l) => (l.lang === "hr" ? "HR" : l.lang === "en" ? "EN" : l.lang.toUpperCase());
  const nestedFor = (subLabel) => nestedLinksMap[subLabel] ?? [];
  const isBranchActive = (children) =>
    children.some((c) => {
      const label = prismic.asText(c.label);
      return isActive(c.link) || nestedFor(label).some((n) => isActive(n.link));
    });

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-line bg-surface/75 py-3 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-5",
        )}
      >
        <nav className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-6 px-5 md:px-8" aria-label="Main">
          <PrismicNextLink href={homeHref} className="shrink-0" onClick={() => setOpen(false)}>
            <span className="sr-only">selekcija</span>
            <BrandLogo field={settings?.data?.logo} className="h-11 w-auto md:h-12" priority />
          </PrismicNextLink>

          <ul className="hidden items-center gap-1 xl:flex">
            {links.map((item) => {
              const label = prismic.asText(item.label);
              const children = subLinksMap[label] ?? [];
              const active = isActive(item.link) || isBranchActive(children);

              return (
                <li key={label} className="group relative">
                  {children.length > 0 ? (
                    <button
                      type="button"
                      aria-haspopup="true"
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-300 hover:text-ink",
                        active ? "text-ink" : "text-ink/70",
                      )}
                    >
                      <PrismicText field={item.label} />
                      <Chevron className="group-hover:rotate-180" />
                    </button>
                  ) : (
                    <PrismicNextLink
                      field={item.link}
                      className={cn(
                        "relative block rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-300 hover:text-ink",
                        active ? "text-ink" : "text-ink/70",
                      )}
                    >
                      <PrismicText field={item.label} />
                    </PrismicNextLink>
                  )}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(34,124,255,0.8)] transition-opacity duration-300",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />

                  {children.length > 0 && (
                    <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul className="min-w-[260px] rounded-2xl border border-line-strong bg-surface-2/95 p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                        {children.map((sub) => {
                          const subLabel = prismic.asText(sub.label);
                          const nested = nestedFor(subLabel);
                          const hasNested = nested.length > 0;
                          const hasSubLink = prismic.isFilled.link(sub.link);
                          const subActive = isActive(sub.link) || nested.some((n) => isActive(n.link));

                          return (
                            <li key={subLabel} className={cn(hasNested && "group/nest relative")}>
                              {hasNested ? (
                                <div className="relative">
                                  {hasSubLink ? (
                                    <PrismicNextLink
                                      field={sub.link}
                                      className={cn(
                                        "group/sub flex items-center justify-between gap-4 rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors duration-200 hover:bg-white/[0.06] hover:text-ink",
                                        subActive ? "text-ink" : "text-ink/75",
                                      )}
                                    >
                                      <PrismicText field={sub.label} />
                                      <Chevron className="-rotate-90 text-muted group-hover/nest:text-ink" />
                                    </PrismicNextLink>
                                  ) : (
                                    <span
                                      className={cn(
                                        "flex items-center justify-between gap-4 rounded-xl px-4 py-2.5 text-[14px] font-medium",
                                        subActive ? "text-ink" : "text-ink/75",
                                      )}
                                    >
                                      <PrismicText field={sub.label} />
                                      <Chevron className="-rotate-90 text-muted" />
                                    </span>
                                  )}
                                  <div className="invisible absolute left-full top-0 z-50 -ml-1 pl-3 opacity-0 transition-all duration-300 group-hover/nest:visible group-hover/nest:opacity-100 group-focus-within/nest:visible group-focus-within/nest:opacity-100">
                                    <ul className="min-w-[220px] rounded-2xl border border-line-strong bg-surface-2/95 p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                                      {nested.map((item3) => {
                                        const nestedLabel = prismic.asText(item3.label);
                                        return (
                                          <li key={nestedLabel}>
                                            <PrismicNextLink
                                              field={item3.link}
                                              className={cn(
                                                "group/sub3 flex items-center justify-between gap-4 rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors duration-200 hover:bg-white/[0.06] hover:text-ink",
                                                isActive(item3.link) ? "text-ink" : "text-ink/75",
                                              )}
                                            >
                                              <PrismicText field={item3.label} />
                                              <ArrowIcon className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover/sub3:translate-x-0 group-hover/sub3:opacity-100" />
                                            </PrismicNextLink>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                </div>
                              ) : (
                                <PrismicNextLink
                                  field={sub.link}
                                  className={cn(
                                    "group/sub flex items-center justify-between gap-4 rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors duration-200 hover:bg-white/[0.06] hover:text-ink",
                                    isActive(sub.link) ? "text-ink" : "text-ink/75",
                                  )}
                                >
                                  <PrismicText field={sub.label} />
                                  <ArrowIcon className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover/sub:translate-x-0 group-hover/sub:opacity-100" />
                                </PrismicNextLink>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-4 xl:flex">
            {locales.length > 1 && (
              <div className="flex items-center rounded-full border border-line p-1">
                {locales.map((locale) => {
                  const activeLocale = locale.lang === lang;
                  return (
                    <PrismicNextLink
                      key={locale.lang}
                      href={locale.url}
                      aria-label={`Change language to ${locale.lang_name}`}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[12px] font-semibold tracking-wider transition-colors",
                        activeLocale ? "bg-white/10 text-ink" : "text-ink/50 hover:text-ink",
                      )}
                    >
                      {localeLabel(locale)}
                    </PrismicNextLink>
                  );
                })}
              </div>
            )}
            {prismic.isFilled.link(ctaLink) && (
              <PrismicNextLink field={ctaLink} className={buttonClasses({ size: "sm", className: "px-5" })}>
                <span>{ctaLabel}</span>
                <ArrowIcon />
              </PrismicNextLink>
            )}
          </div>

          <button
            type="button"
            className="relative flex size-11 items-center justify-center rounded-full border border-line-strong bg-white/[0.03] xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={cn("absolute h-[1.5px] w-5 rounded bg-ink transition-transform duration-300", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span className={cn("absolute h-[1.5px] w-5 rounded bg-ink transition-transform duration-300", open ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-surface/95 pt-24 backdrop-blur-xl xl:hidden"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_0%,rgba(34,124,255,0.25),transparent_60%)]" />
            <nav className="relative mx-auto flex min-h-full max-w-xl flex-col px-6 pb-10" aria-label="Mobile">
              <ul>
                {links.map((item, idx) => {
                  const label = prismic.asText(item.label);
                  const children = subLinksMap[label] ?? [];
                  const isOpen = openAccordion === label;

                  return (
                    <motion.li
                      key={label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.05 + idx * 0.05 }}
                      className="border-b border-line"
                    >
                      {children.length > 0 ? (
                        <>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between py-4 text-left text-[22px] font-medium text-ink"
                            aria-expanded={isOpen}
                            onClick={() => {
                              setOpenAccordion(isOpen ? null : label);
                              setOpenNestedAccordion(null);
                            }}
                          >
                            <PrismicText field={item.label} />
                            <Chevron className={cn("size-5 text-muted", isOpen && "rotate-180 text-primary")} />
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: EASE }}
                                className="overflow-hidden"
                              >
                                {children.map((sub) => {
                                  const subLabel = prismic.asText(sub.label);
                                  const nested = nestedFor(subLabel);
                                  const hasNested = nested.length > 0;
                                  const hasSubLink = prismic.isFilled.link(sub.link);
                                  const isNestedOpen = openNestedAccordion === subLabel;

                                  return (
                                    <li key={subLabel}>
                                      {hasNested ? (
                                        <div className="flex items-center gap-1 pl-1">
                                          {hasSubLink ? (
                                            <PrismicNextLink
                                              field={sub.link}
                                              onClick={() => setOpen(false)}
                                              className="flex min-w-0 flex-1 items-center gap-3 py-2.5 text-[16px] text-body transition-colors hover:text-ink"
                                            >
                                              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                                              <PrismicText field={sub.label} />
                                            </PrismicNextLink>
                                          ) : (
                                            <span className="flex min-w-0 flex-1 items-center gap-3 py-2.5 text-[16px] font-medium text-ink">
                                              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                                              <PrismicText field={sub.label} />
                                            </span>
                                          )}
                                          <button
                                            type="button"
                                            aria-label={isNestedOpen ? `Collapse ${subLabel}` : `Expand ${subLabel}`}
                                            aria-expanded={isNestedOpen}
                                            className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
                                            onClick={() => setOpenNestedAccordion(isNestedOpen ? null : subLabel)}
                                          >
                                            <Chevron className={cn("size-4", isNestedOpen && "rotate-180 text-primary")} />
                                          </button>
                                        </div>
                                      ) : hasSubLink ? (
                                        <PrismicNextLink
                                          field={sub.link}
                                          onClick={() => setOpen(false)}
                                          className="flex items-center gap-3 py-2.5 pl-1 text-[16px] text-body transition-colors hover:text-ink"
                                        >
                                          <span className="size-1.5 rounded-full bg-primary" />
                                          <PrismicText field={sub.label} />
                                        </PrismicNextLink>
                                      ) : (
                                        <span className="flex items-center gap-3 py-2.5 pl-1 text-[16px] font-medium text-ink">
                                          <span className="size-1.5 rounded-full bg-primary" />
                                          <PrismicText field={sub.label} />
                                        </span>
                                      )}

                                      <AnimatePresence initial={false}>
                                        {hasNested && isNestedOpen && (
                                          <motion.ul
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: EASE }}
                                            className="overflow-hidden"
                                          >
                                            <li className="ml-4 border-l border-line pl-3">
                                              <ul>
                                                {nested.map((item3) => (
                                                  <li key={prismic.asText(item3.label)}>
                                                    <PrismicNextLink
                                                      field={item3.link}
                                                      onClick={() => setOpen(false)}
                                                      className="flex items-center gap-3 py-2 text-[15px] text-muted transition-colors hover:text-ink"
                                                    >
                                                      <PrismicText field={item3.label} />
                                                    </PrismicNextLink>
                                                  </li>
                                                ))}
                                              </ul>
                                            </li>
                                          </motion.ul>
                                        )}
                                      </AnimatePresence>
                                    </li>
                                  );
                                })}
                                <li className="h-3" />
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <PrismicNextLink
                          field={item.link}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center justify-between py-4 text-[22px] font-medium transition-colors",
                            isActive(item.link) ? "text-primary" : "text-ink hover:text-primary",
                          )}
                        >
                          <PrismicText field={item.label} />
                          <ArrowIcon className="size-5 text-muted" />
                        </PrismicNextLink>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.1 + links.length * 0.05 }}
                className="mt-auto flex flex-col gap-6 pt-10"
              >
                {locales.length > 1 && (
                  <div className="flex gap-2">
                    {locales.map((locale) => (
                      <PrismicNextLink
                        key={locale.lang}
                        href={locale.url}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-[13px] font-semibold tracking-wider",
                          locale.lang === lang ? "border-primary bg-primary/15 text-ink" : "border-line-strong text-body",
                        )}
                      >
                        {localeLabel(locale)}
                      </PrismicNextLink>
                    ))}
                  </div>
                )}
                {prismic.isFilled.link(ctaLink) && (
                  <PrismicNextLink
                    field={ctaLink}
                    onClick={() => setOpen(false)}
                    className={buttonClasses({ size: "lg", className: "w-full" })}
                  >
                    <span>{ctaLabel}</span>
                    <ArrowIcon />
                  </PrismicNextLink>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
