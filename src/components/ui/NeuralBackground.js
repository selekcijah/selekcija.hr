"use client";

import { useEffect, useRef } from "react";
import { cn } from "./cn";

const BLUE = [34, 124, 255];
const MINT = [69, 217, 150];

/**
 * Canvas of drifting nodes connected by links, echoing the neural-network
 * logo. Signals travel along links; nodes near the cursor light up.
 */
export function NeuralBackground({
  className,
  density = 0.00011,
  maxNodes = 150,
  linkDistance = 160,
  speed = 0.25,
  interactive = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let nodes = [];
    let signals = [];
    let frame = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999, active: false };

    const seed = () => {
      const count = Math.max(28, Math.min(maxNodes, Math.round(width * height * density)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: 1.2 + Math.random() * 2.2,
        mint: Math.random() < 0.14,
        phase: Math.random() * Math.PI * 2,
      }));
      signals = [];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      const maxD2 = linkDistance * linkDistance;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > maxD2) continue;
          const alpha = (1 - Math.sqrt(d2) / linkDistance) * 0.32;
          ctx.strokeStyle = rgba(BLUE, alpha);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          if (!reduce && signals.length < 14 && Math.random() < 0.00012) {
            signals.push({ a: i, b: j, t: 0, mint: Math.random() < 0.35 });
          }
        }

        if (mouse.active) {
          const dx = a.x - mouse.x;
          const dy = a.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 200) {
            ctx.strokeStyle = rgba(MINT, (1 - d / 200) * 0.5);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      signals = signals.filter((s) => {
        const a = nodes[s.a];
        const b = nodes[s.b];
        if (!a || !b) return false;
        s.t += 0.012;
        if (s.t >= 1) return false;
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;
        const c = s.mint ? MINT : BLUE;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 10);
        grad.addColorStop(0, rgba(c, 0.9));
        grad.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      for (const n of nodes) {
        const pulse = reduce ? 1 : 0.75 + Math.sin(time * 0.0015 + n.phase) * 0.25;
        const c = n.mint ? MINT : BLUE;
        ctx.fillStyle = rgba(c, 0.12 * pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(c, 0.85 * pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 40000 && d2 > 1) {
            n.vx += (dx / Math.sqrt(d2)) * 0.006;
            n.vy += (dy / Math.sqrt(d2)) * 0.006;
          }
        }
        const v = Math.hypot(n.vx, n.vy);
        const max = speed * 2.2;
        if (v > max) {
          n.vx = (n.vx / v) * max;
          n.vy = (n.vy / v) * max;
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }
    };

    const loop = (time) => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      step();
      draw(time);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouse.x = x;
      mouse.y = y;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    if (reduce) {
      draw(0);
    } else {
      frame = requestAnimationFrame(loop);
      if (interactive) {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerleave", onLeave);
      }
    }

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [density, maxNodes, linkDistance, speed, interactive]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
