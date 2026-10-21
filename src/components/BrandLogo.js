import Image from "next/image";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

function isSvg(url) {
  return typeof url === "string" && url.split("?")[0].endsWith(".svg");
}

/**
 * Brand lockup. Prefers the Settings logo from Prismic and falls back to the
 * local neural mark + wordmark.
 */
export function BrandLogo({
  field,
  className = "h-12 w-auto",
  priority = false,
  alt = "selekcija",
}) {
  if (prismic.isFilled.image(field)) {
    if (isSvg(field.url)) {
      return (
        // Remote SVGs are blocked by next/image. The logo is an SVG in Prismic.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={field.url}
          alt={field.alt || alt}
          width={field.dimensions?.width || 232}
          height={field.dimensions?.height || 48}
          className={className}
          fetchPriority={priority ? "high" : "auto"}
        />
      );
    }

    return (
      <PrismicNextImage
        field={field}
        fallbackAlt={alt}
        className={className}
        priority={priority}
        sizes="240px"
      />
    );
  }

  return (
    <Image
      src="/brand/logo-dark.svg"
      alt={alt}
      width={232}
      height={48}
      className={className}
      priority={priority}
    />
  );
}
