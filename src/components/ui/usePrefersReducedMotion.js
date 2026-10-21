"use client";

import { useLayoutEffect, useState } from "react";

/**
 * Whether the user prefers reduced motion.
 * Stays false for the server render and the hydration render, then updates
 * before paint, so the first HTML matches on both sides.
 */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce;
}
