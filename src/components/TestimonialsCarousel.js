"use client";

import { useEffect, useRef, useState } from "react";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { cn } from "./ui/cn";

function NavButton({ direction, buttonRef, label }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      className="group flex size-12 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-white/[0.03] text-ink backdrop-blur transition-all duration-300 hover:border-primary hover:bg-primary hover:shadow-[0_0_30px_-6px_rgba(34,124,255,0.9)] disabled:opacity-40"
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className={cn("size-4 transition-transform duration-300", direction === "prev" ? "rotate-180 group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5")}>
        <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function TestimonialsCarousel({ items = [] }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const testimonials = (items || []).filter(
    (item) => item?.quote || item?.author_name || prismic.isFilled.image(item?.author_image),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!testimonials.length) return null;

  const showNav = testimonials.length > 1;

  if (!mounted) {
    return (
      <div className="relative">
        <article className="relative mx-auto flex max-w-2xl flex-col overflow-hidden rounded-3xl border border-line bg-surface-3/50 p-7 backdrop-blur-sm md:p-9">
          {testimonials[0].quote && (
            <p className="relative mb-10 text-[17px] leading-[1.65] text-ink/85 md:text-[19px]">
              &ldquo;{testimonials[0].quote}&rdquo;
            </p>
          )}
          {testimonials[0].author_name && (
            <h3 className="font-heading text-[17px] font-semibold text-ink">{testimonials[0].author_name}</h3>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-24 bg-gradient-to-r from-surface to-transparent md:block" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-24 bg-gradient-to-l from-surface to-transparent md:block" />

      <Swiper
        modules={[Autoplay, Navigation]}
        className="!overflow-visible md:!overflow-hidden [&_.swiper-slide]:h-auto"
        loop={mounted && testimonials.length > 3}
        speed={700}
        grabCursor
        watchOverflow
        slideToClickedSlide
        centerInsufficientSlides
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        spaceBetween={20}
        autoplay={mounted && showNav ? { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
        breakpoints={{
          0: { slidesPerView: 1, centeredSlides: false, spaceBetween: 16 },
          768: { slidesPerView: 1.45, centeredSlides: true, spaceBetween: 24 },
          992: { slidesPerView: 1.85, centeredSlides: true, spaceBetween: 28 },
          1200: { slidesPerView: 2.4, centeredSlides: true, spaceBetween: 28 },
        }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={`${item.author_name || item.category || "testimonial"}-${index}`} className="group/slide">
            <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface-3/50 p-7 backdrop-blur-sm transition-all duration-700 md:p-9 md:[.swiper-slide:not(.swiper-slide-active)_&]:scale-[0.94] md:[.swiper-slide:not(.swiper-slide-active)_&]:opacity-45 [.swiper-slide-active_&]:border-line-strong">
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 [.swiper-slide-active_&]:opacity-100 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(34,124,255,0.18),transparent_60%)]" />
              <svg viewBox="0 0 48 36" aria-hidden className="pointer-events-none absolute right-7 top-7 w-14 text-primary/25">
                <path fill="currentColor" d="M0 36V21.6C0 9.8 6.4 2.6 19.2 0l2.2 5.1C14.6 7.1 11.3 11 11.1 16.8H20V36H0Zm28 0V21.6C28 9.8 34.4 2.6 47.2 0l2.2 5.1c-6.8 2-10.1 5.9-10.3 11.7H48V36H28Z" />
              </svg>

              <div className="relative mb-6 flex flex-wrap items-center gap-3">
                <ul className="flex gap-1 text-mint" aria-label="Five star review">
                  {[...Array(5)].map((_, starIndex) => (
                    <li key={starIndex}>
                      <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
                        <path fill="currentColor" d="m10 1.5 2.6 5.5 6 .7-4.4 4.1 1.2 5.9L10 14.8l-5.4 2.9 1.2-5.9L1.4 7.7l6-.7L10 1.5Z" />
                      </svg>
                    </li>
                  ))}
                </ul>
                {item.category && (
                  <span className="rounded-full border border-line px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                    {item.category}
                  </span>
                )}
              </div>

              {item.quote && (
                <p className="relative mb-10 text-[17px] leading-[1.65] text-ink/85 md:text-[19px]">&ldquo;{item.quote}&rdquo;</p>
              )}

              <div className="relative mt-auto flex items-center gap-4 border-t border-line pt-6">
                {prismic.isFilled.image(item.author_image) ? (
                  <PrismicNextImage
                    field={item.author_image}
                    fallbackAlt=""
                    width={52}
                    height={52}
                    className="size-[52px] rounded-full object-cover ring-2 ring-primary/40 ring-offset-2 ring-offset-surface-2"
                  />
                ) : (
                  <span className="flex size-[52px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/40 font-heading text-[16px] font-semibold text-white ring-2 ring-primary/30 ring-offset-2 ring-offset-surface-2">
                    {initials(item.author_name)}
                  </span>
                )}
                <div>
                  {item.author_name && <h3 className="font-heading text-[17px] font-semibold text-ink">{item.author_name}</h3>}
                  {item.author_role && <span className="text-[14px] text-muted">{item.author_role}</span>}
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      {showNav && (
        <div className="mt-10 flex items-center justify-center gap-6">
          <NavButton direction="prev" buttonRef={prevRef} label="Previous testimonial" />
          <div className="flex items-center gap-2" aria-hidden>
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={cn("h-1.5 rounded-full transition-all duration-500", i === active ? "w-8 bg-primary" : "w-1.5 bg-white/20")}
              />
            ))}
          </div>
          <NavButton direction="next" buttonRef={nextRef} label="Next testimonial" />
        </div>
      )}
    </div>
  );
}
