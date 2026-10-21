"use client";

import dynamic from "next/dynamic";
import { NeuralBackground } from "./ui/NeuralBackground";
import { usePrefersReducedMotion } from "./ui/usePrefersReducedMotion";

const Particles = dynamic(() => import("./reactbits/Particles"), { ssr: false });

/**
 * Layered hero atmosphere: WebGL particle dust, neural node network and glows.
 */
export function HeroBackdrop({ accent = "blue" }) {
  const reduce = usePrefersReducedMotion();
  const glow = accent === "mint" ? "bg-mint/25" : "bg-primary/30";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(34,124,255,0.28),transparent_60%)]" />
      <div className={`animate-glow absolute left-1/2 top-[38%] size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] md:size-[760px] ${glow}`} />
      <div className="bg-grid absolute inset-0 opacity-70" />
      {!reduce && (
        <div className="absolute inset-0 opacity-70">
          <Particles
            particleCount={160}
            particleSpread={12}
            speed={0.06}
            particleColors={["#227cff", "#45d996", "#ffffff"]}
            particleBaseSize={70}
            sizeRandomness={1}
            alphaParticles
            disableRotation={false}
          />
        </div>
      )}
      <NeuralBackground className="opacity-90" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-surface" />
    </div>
  );
}
