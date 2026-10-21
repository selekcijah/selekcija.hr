"use client";

import dynamic from "next/dynamic";
import { cn } from "./cn";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const Particles = dynamic(() => import("@/components/reactbits/Particles"), { ssr: false });

/**
 * Decorative WebGL particle field; skipped entirely under reduced motion.
 */
export function ParticlesLayer({
  className,
  colors = ["#227cff", "#45d996", "#ffffff"],
  count = 120,
  spread = 10,
  speed = 0.08,
  size = 80,
}) {
  const reduce = usePrefersReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <Particles
        particleCount={count}
        particleSpread={spread}
        speed={speed}
        particleColors={colors}
        particleBaseSize={size}
        sizeRandomness={1}
        alphaParticles
      />
    </div>
  );
}
