"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "./ui/usePrefersReducedMotion";

/**
 * Cycles through words in a fixed-width inline slot with a blur swap.
 *
 * @param {{ words: string[], className?: string, interval?: number }} props
 */
export default function RotatingWord({ words, className = "", interval = 2800 }) {
  const cleanWords = useMemo(() => (Array.isArray(words) ? words.filter(Boolean) : []), [words]);
  const [index, setIndex] = useState(0);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    setIndex(0);
  }, [cleanWords.length]);

  useEffect(() => {
    if (cleanWords.length < 2 || reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % cleanWords.length), interval);
    return () => window.clearInterval(id);
  }, [cleanWords.length, interval, reduce]);

  if (cleanWords.length === 0) return null;

  const sizingWord = cleanWords.reduce((widest, word) => (word.length > widest.length ? word : widest), cleanWords[0]);

  return (
    <span className={className} style={{ display: "inline-grid", verticalAlign: "baseline" }} aria-label={cleanWords[index]}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {sizingWord}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={cleanWords[index]}
          aria-hidden="true"
          className="col-start-1 row-start-1 whitespace-nowrap text-center"
          initial={{ y: "55%", opacity: 0, filter: "blur(10px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-55%", opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {cleanWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
