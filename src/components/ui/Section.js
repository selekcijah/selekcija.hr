import { cn } from "./cn";

const CONTAINERS = {
  narrow: "max-w-[860px]",
  default: "max-w-[1240px]",
  wide: "max-w-[1440px]",
};

const PADDING = {
  none: "",
  tight: "py-14 md:py-20",
  default: "py-20 md:py-28",
  loose: "py-24 md:py-36",
};

/**
 * Maps a Prismic slice variation to a dark surface treatment.
 */
export function surfaceFor(variation) {
  switch (variation) {
    case "blue":
      return "blue";
    case "greenBg":
      return "mint";
    case "whiteBackground":
    case "altBackground":
      return "elevated";
    default:
      return "base";
  }
}

function Atmosphere({ variant }) {
  if (variant === "base") return null;

  if (variant === "elevated") {
    return <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 border-y border-line bg-surface-2/70" />;
  }

  const glow =
    variant === "mint"
      ? "bg-[radial-gradient(ellipse_70%_60%_at_80%_0%,rgba(69,217,150,0.16),transparent_60%),radial-gradient(ellipse_60%_50%_at_10%_100%,rgba(34,124,255,0.14),transparent_60%)]"
      : variant === "blue"
        ? "bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(34,124,255,0.22),transparent_65%),radial-gradient(ellipse_40%_40%_at_100%_100%,rgba(69,217,150,0.07),transparent_60%)]"
        : "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,124,255,0.14),transparent_65%)]";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className={cn("absolute inset-0", glow)} />
      {variant === "blue" && <div className="bg-grid absolute inset-0 opacity-60" />}
    </div>
  );
}

/**
 * Page section with brand surface, atmosphere and container.
 *
 * Variants: base, elevated, glow, blue, mint.
 */
export function Section({
  as: Tag = "section",
  variant = "base",
  size = "default",
  padding = "default",
  className,
  containerClassName,
  children,
  ...rest
}) {
  return (
    <Tag className={cn("relative isolate overflow-x-clip", PADDING[padding], className)} {...rest}>
      <Atmosphere variant={variant} />
      <div className={cn("mx-auto w-full px-5 md:px-8", CONTAINERS[size], containerClassName)}>{children}</div>
    </Tag>
  );
}
