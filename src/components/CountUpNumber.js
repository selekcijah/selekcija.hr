"use client";

import CountUp from "@/components/reactbits/CountUp";

/**
 * Number that counts up when it scrolls into view.
 *
 * @param {{ value: number, suffix?: string, prefix?: string, className?: string, duration?: number }} props
 */
export default function CountUpNumber({ value, suffix = "", prefix = "", className = "", duration = 1800 }) {
  return (
    <span className={className}>
      {prefix}
      <CountUp to={value} duration={duration / 1000} />
      {suffix}
    </span>
  );
}

/**
 * Splits a stat like "150k+" or "90%" into its numeric part and suffix.
 */
export function parseStat(raw) {
  const text = String(raw ?? "").trim();
  const match = text.match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
  if (!match) return { number: null, prefix: "", suffix: "", raw: text };
  const number = parseFloat(match[2].replace(/,/g, ""));
  return { number: Number.isFinite(number) ? number : null, prefix: match[1], suffix: match[3], raw: text };
}

export function StatValue({ value, className = "", duration = 2000 }) {
  const { number, prefix, suffix, raw } = parseStat(value);
  if (number === null || number <= 0) return <span className={className}>{raw}</span>;
  return <CountUpNumber value={number} prefix={prefix} suffix={suffix} className={className} duration={duration} />;
}
