import * as prismic from "@prismicio/client";

/**
 * Open Graph and Twitter images for a page.
 * An empty image is omitted so the root layout logo is used instead.
 *
 * @param {import("@prismicio/client").ImageField | null | undefined} image
 */
export function socialMetadata(image) {
  if (!prismic.isFilled.image(image)) return {};

  return {
    openGraph: {
      images: [
        {
          url: image.url,
          alt: image.alt || undefined,
          width: image.dimensions?.width,
          height: image.dimensions?.height,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [image.url],
    },
  };
}
