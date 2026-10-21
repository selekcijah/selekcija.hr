"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/components/ui/cn";

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div
            key={i}
            className={cn(
              "rounded-2xl border transition-[border-color,background-color] duration-500",
              isOpen ? "border-primary/40 bg-surface-3/70 shadow-[0_0_40px_-16px_rgba(34,124,255,0.6)]" : "border-line bg-white/[0.02] hover:border-line-strong",
            )}
          >
            <button
              id={buttonId}
              type="button"
              className="flex w-full cursor-pointer items-center gap-5 px-5 py-5 text-left md:px-7 md:py-6"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span className={cn("font-heading text-[13px] font-medium tabular-nums tracking-[0.15em] transition-colors", isOpen ? "text-primary" : "text-muted")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-heading text-[16px] font-semibold leading-snug text-ink md:text-[18px]">{item.question}</span>
              <span
                aria-hidden
                className={cn(
                  "relative flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                  isOpen ? "rotate-45 border-primary bg-primary text-white" : "border-line-strong text-ink",
                )}
              >
                <span className="absolute h-px w-3.5 bg-current" />
                <span className="absolute h-3.5 w-px bg-current" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-6 text-[15px] leading-relaxed text-body md:pl-[76px] md:pr-16 md:text-[16px]">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
