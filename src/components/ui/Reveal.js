"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Fades and slides its children in once they scroll into view.
 */
export function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  amount = 0.15,
  duration = 0.8,
  style,
  ...rest
}) {
  const reduce = usePrefersReducedMotion();

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} style={style} {...rest}>
        {children}
      </Plain>
    );
  }

  const Tag = motion[as] ?? motion.div;
  const initial = { opacity: 0 };
  const visible = { opacity: 1 };
  if (y) {
    initial.y = y;
    visible.y = 0;
  }
  if (x) {
    initial.x = x;
    visible.x = 0;
  }
  if (scale !== 1) {
    initial.scale = scale;
    visible.scale = 1;
  }

  return (
    <Tag
      className={className}
      style={style}
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, amount, margin: "80px 0px" }}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
