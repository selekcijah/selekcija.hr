import Link from "next/link";
import * as prismic from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { cn } from "./cn";

const BASE =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ease-out cursor-pointer disabled:pointer-events-none disabled:opacity-50";

const VARIANTS = {
  primary:
    "bg-primary text-white shadow-[0_0_0_1px_rgba(34,124,255,0.6),0_10px_30px_-10px_rgba(34,124,255,0.8)] hover:bg-primary-hover hover:shadow-[0_0_0_1px_rgba(34,124,255,0.9),0_14px_44px_-8px_rgba(34,124,255,0.9)]",
  ghost:
    "border border-line-strong bg-white/[0.03] text-ink backdrop-blur-sm hover:border-white/40 hover:bg-white/[0.08]",
  mint:
    "bg-mint text-dark shadow-[0_10px_30px_-10px_rgba(69,217,150,0.7)] hover:bg-[#62e3ab] hover:shadow-[0_14px_40px_-8px_rgba(69,217,150,0.8)]",
  light: "bg-white text-dark hover:bg-white/90",
  link: "text-ink hover:text-primary px-0 h-auto",
};

const SIZES = {
  sm: "h-10 px-4 text-[14px]",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-[16px]",
};

export function buttonClasses({ variant = "primary", size = "md", className } = {}) {
  return cn(BASE, VARIANTS[variant], variant !== "link" && SIZES[size], className);
}

export function ArrowIcon({ className }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover:translate-x-1",
        className,
      )}
    >
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Brand button. Renders a Prismic link (`field`), a Next link (`href`) or a
 * native button.
 */
export function Button({
  field,
  href,
  variant = "primary",
  size = "md",
  arrow = true,
  className,
  children,
  type,
  ...rest
}) {
  const classes = buttonClasses({ variant, size, className });

  if (field !== undefined) {
    if (!prismic.isFilled.link(field)) return null;
    return (
      <PrismicNextLink field={field} className={classes} {...rest}>
        <span>{children ?? field.text}</span>
        {arrow && <ArrowIcon />}
      </PrismicNextLink>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        <span>{children}</span>
        {arrow && <ArrowIcon />}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      <span>{children}</span>
      {arrow && <ArrowIcon />}
    </button>
  );
}
