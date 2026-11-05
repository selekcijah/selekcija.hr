"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import * as prismic from "@prismicio/client";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { Tagline } from "@/components/ui/Tagline";
import { Button } from "@/components/ui/Button";
import { NeuralMark } from "@/components/ui/NeuralMark";
import { Reveal } from "@/components/ui/Reveal";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";
import { cn } from "@/components/ui/cn";

const GAP = 36;

/**
 * Sticky filmstrip: cards sit in one column and travel upward together.
 * A spring gives the handoff a slight elastic settle. They never overlap.
 */
export function ScrollActionsClient({ tagline, heading, actions }) {
  const reduce = usePrefersReducedMotion();
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const count = Math.max(actions.length, 1);
  const [active, setActive] = useState(0);
  const [stageH, setStageH] = useState(380);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageH(el.clientHeight || 380);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 16,
    mass: 0.55,
    restDelta: 0.001,
  });

  const slot = stageH + GAP;
  const y = useTransform(progress, (v) => -v * Math.max(count - 1, 0) * slot);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (count < 2) return;
    const idx = Math.min(count - 1, Math.max(0, Math.round(v * (count - 1))));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  function scrollToIndex(i) {
    const el = trackRef.current;
    if (!el || count < 2) {
      setActive(i);
      return;
    }
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const travel = Math.max(el.offsetHeight - window.innerHeight, 1);
    window.scrollTo({
      top: top + (i / (count - 1)) * travel + 1,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  if (reduce || count < 2) {
    return (
      <div className="flex flex-col gap-10 py-20 md:gap-12 md:py-28">
        <Header tagline={tagline} heading={heading} />
        <ol className="mx-auto grid w-full max-w-[420px] grid-cols-1 gap-4 md:max-w-none md:grid-cols-3">
          {actions.map((action, i) => (
            <Reveal as="li" key={`${prismic.asText(action.heading)}-${i}`} delay={i * 0.08}>
              <ActionCard action={action} index={i} active />
            </Reveal>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative max-w-full" style={{ height: `${count * 88}vh` }}>
      <div className="sticky top-0 flex min-h-[100svh] max-w-full items-center overflow-x-clip py-12 md:py-24">
        <div className="grid w-full min-w-0 grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="flex min-w-0 flex-col gap-5 lg:col-span-5 lg:gap-8">
            <Header tagline={tagline} heading={heading} align="left" />
            <ProgressRail actions={actions} active={active} onSelect={scrollToIndex} />
          </div>

          <div className="relative min-w-0 lg:col-span-7">
            <div aria-hidden className="pointer-events-none absolute inset-y-6 left-1/2 -z-10 w-[70%] -translate-x-1/2 rounded-full bg-primary/16 blur-[90px]" />

            <div ref={stageRef} className="relative h-[400px] overflow-hidden md:h-[380px]">
              <motion.div className="flex flex-col" style={{ y, gap: GAP }}>
                {actions.map((action, i) => (
                  <div key={`${prismic.asText(action.heading)}-${i}`} className="h-[400px] shrink-0 md:h-[380px]">
                    <ActionCard action={action} index={i} active={active === i} large />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ tagline, heading, align = "center" }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-4 md:gap-5", align === "center" ? "items-center text-center" : "items-start text-left")}>
      {tagline && (
        <Reveal y={10}>
          <Tagline>{tagline}</Tagline>
        </Reveal>
      )}
      {prismic.isFilled.richText(heading) && (
        <MarkerHeading
          field={heading}
          as="h2"
          size="lg"
          autoMarker={1}
          className={align === "center" ? undefined : "text-left"}
        />
      )}
    </div>
  );
}

function ProgressRail({ actions, active, onSelect }) {
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const list = listRef.current;
    const item = itemRefs.current[active];
    if (!list || !item) return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const delta = itemRect.left - listRect.left - (listRect.width - itemRect.width) / 2;
    list.scrollTo({ left: list.scrollLeft + delta, behavior: "smooth" });
  }, [active]);

  return (
    <ol
      ref={listRef}
      className="flex w-full min-w-0 max-w-full snap-x gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:snap-none md:flex-col md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
      aria-label="Actions"
    >
      {actions.map((action, i) => {
        const label = prismic.asText(action.heading) || `Action ${i + 1}`;
        const isActive = i === active;
        return (
          <li
            key={`${label}-${i}`}
            ref={(node) => {
              itemRefs.current[i] = node;
            }}
            className="shrink-0 snap-start md:w-full md:min-w-0"
          >
            <button
              type="button"
              onClick={() => onSelect(i)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition duration-300 md:w-full md:min-w-0 md:gap-4 md:px-4 md:py-3",
                isActive
                  ? "border-primary/60 bg-primary/10 shadow-[0_0_30px_-12px_rgba(34,124,255,0.9)]"
                  : "border-line bg-surface-2 hover:border-line-strong hover:bg-surface-3",
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border font-heading text-[12px] font-semibold transition md:size-9",
                  isActive ? "border-primary bg-primary text-white" : "border-line-strong text-muted group-hover:text-ink",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={cn("min-w-0 truncate text-[13px] font-medium md:text-[14px]", isActive ? "text-ink" : "text-body")}>
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ActionCard({ action, index, active, large = false }) {
  const { heading, description, button } = action;

  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-2xl border bg-surface-2 transition-[border-color,box-shadow] duration-500",
        active
          ? "border-primary/50 shadow-[0_28px_70px_-24px_rgba(34,124,255,0.45)]"
          : "border-line-strong shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,124,255,0.12),transparent_55%)]"
      />
      <div className={cn("relative flex h-full flex-col", large ? "p-7 md:p-10" : "p-7")}>
        <div className="mb-5 flex items-center justify-between gap-4 md:mb-6">
          <span className="font-heading text-[13px] font-semibold tracking-[0.18em] text-primary/90">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent" />
          <NeuralMark className="w-8 text-primary/35" />
        </div>

        {prismic.isFilled.richText(heading) && (
          <MarkerHeading
            field={heading}
            as="h3"
            size={large ? "md" : "sm"}
            autoMarker={1}
            animate={false}
            className="mb-4"
          />
        )}

        {description && (
          <p className={cn("text-body leading-relaxed", large ? "mb-8 max-w-[40ch] text-[16px] md:text-[17px]" : "mb-6 text-[15px]")}>
            {description}
          </p>
        )}

        {prismic.isFilled.link(button) && (
          <div className="mt-auto pt-2">
            <Button field={button} size={large ? "lg" : "md"}>
              {button.text}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
