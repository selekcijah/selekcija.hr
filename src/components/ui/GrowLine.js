"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { cn } from "./cn";

/**
 * Line that draws itself when scrolled into view.
 */
export function GrowLine({ className, axis = "x", delay = 0, duration = 1.4 }) {
  const reduce = usePrefersReducedMotion();
  const from = axis === "x" ? { scaleX: 0 } : { scaleY: 0 };
  const to = axis === "x" ? { scaleX: 1 } : { scaleY: 1 };

  return (
    <motion.div
      aria-hidden
      className={cn(axis === "x" ? "origin-left" : "origin-top", className)}
      initial={reduce ? to : from}
      whileInView={to}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
