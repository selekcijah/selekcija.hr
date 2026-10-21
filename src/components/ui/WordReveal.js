"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Word-by-word blur reveal that keeps marker highlights intact.
 *
 * Avoids leaving transforms on words after the entrance — those create
 * stacking contexts that paint over marker highlights on the next line.
 *
 * @param {{ segments: { text: string, tone: "blue" | "mint" | null }[], as?: string, className?: string, delay?: number, stagger?: number }} props
 */
export function WordReveal({ segments, as = "h2", className, delay = 0, stagger = 0.04 }) {
  const reduce = usePrefersReducedMotion();
  const Tag = motion[as] ?? motion.h2;
  let index = 0;

  const renderWords = (text, keyPrefix) =>
    text.split(/(\s+)/).map((part, i) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) return " ";
      const order = index++;
      return (
        <motion.span
          key={`${keyPrefix}-${i}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)" },
            show: {
              opacity: 1,
              filter: "none",
              transition: { duration: 0.7, ease: EASE, delay: delay + order * stagger },
            },
          }}
        >
          {part}
        </motion.span>
      );
    });

  return (
    <Tag
      className={className}
      initial={reduce ? false : "hidden"}
      animate="show"
    >
      {segments.map((segment, si) => {
        const words = renderWords(segment.text, si);
        if (!segment.tone) return <span key={si}>{words}</span>;
        const markerDelay = delay + index * stagger;
        return (
          <motion.span
            key={si}
            className={segment.tone === "mint" ? "marker marker-mint" : "marker"}
            variants={{
              hidden: { backgroundSize: "0% 100%" },
              show: {
                backgroundSize: "100% 100%",
                transition: { duration: 0.8, ease: EASE, delay: markerDelay },
              },
            }}
          >
            {words}
          </motion.span>
        );
      })}
    </Tag>
  );
}
