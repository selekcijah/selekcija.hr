"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "./cn";

const cache = new Map();

function toMono(src, height) {
  if (cache.has(src)) return cache.get(src);
  const job = new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const scale = Math.min(1, height / img.naturalHeight);
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, w, h);
        const frame = ctx.getImageData(0, 0, w, h);
        const d = frame.data;
        // Logos exported on a solid light background: treat luminance as ink.
        const opaqueBg = d[3] > 250 && d[(w - 1) * 4 + 3] > 250 && d[0] > 200 && d[1] > 200 && d[2] > 200;
        for (let i = 0; i < d.length; i += 4) {
          const lum = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
          const alpha = opaqueBg ? Math.min(1, (1 - lum) * 1.6) * d[i + 3] : d[i + 3];
          d[i] = d[i + 1] = d[i + 2] = 255;
          d[i + 3] = alpha;
        }
        ctx.putImageData(frame, 0, 0);
        resolve({ url: canvas.toDataURL("image/png"), width: w, height: h });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
  cache.set(src, job);
  return job;
}

/**
 * Renders any client logo as a white silhouette so it sits on dark surfaces,
 * including logos exported with a white background.
 */
export function MonoLogo({ src, alt = "", className, height = 160 }) {
  const [mono, setMono] = useState(null);

  useEffect(() => {
    let active = true;
    toMono(src, height).then((result) => active && setMono(result));
    return () => {
      active = false;
    };
  }, [src, height]);

  const imageSrc = mono?.url ?? src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={mono?.width || height * 2}
      height={mono?.height || height}
      unoptimized
      draggable={false}
      className={cn(
        "object-contain transition-opacity duration-500",
        mono ? "" : "opacity-0",
        className,
      )}
    />
  );
}
