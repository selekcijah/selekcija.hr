import { createClient } from "@/lib/prismicio";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Tagline } from "@/components/ui/Tagline";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Button";
import { NeuralMark } from "@/components/ui/NeuralMark";

/**
 * @typedef {import("@prismicio/client").Content.FeaturedBlogsSliceSlice} FeaturedBlogsSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<FeaturedBlogsSliceSlice>} FeaturedBlogsSliceProps
 * @type {import("react").FC<FeaturedBlogsSliceProps>}
 */
const FeaturedBlogsSlice = async ({ slice, context }) => {
  const lang = context?.lang ?? "hr";
  const limit = slice.primary?.post_count || 3;

  const client = createClient();
  const posts = await client
    .getAllByType("blog_post", {
      lang,
      orderings: [{ field: "my.blog_post.date", direction: "desc" }],
      limit,
    })
    .catch(() => [])
    .then((all) => all.slice(0, limit));

  const subLabel = slice.primary?.sub_label;
  const heading = slice.primary?.heading;

  return (
    <Section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="flex flex-col items-start gap-5 lg:sticky lg:top-[120px]">
            {subLabel && (
              <Reveal y={12}>
                <Tagline>{subLabel}</Tagline>
              </Reveal>
            )}
            {heading && <MarkerHeading text={heading} size="lg" autoMarker={2} />}
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="flex flex-col">
            {posts.map((post, index) => {
              const title = prismic.asText(post.data.title);
              const image = post.data.featured_image;
              const rawDate = post.data.date || post.first_publication_date;
              const date = rawDate
                ? new Date(rawDate).toLocaleDateString(lang === "en" ? "en-US" : "hr-HR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : null;
              const href = lang === "en" ? `/en/blog/${post.uid}` : `/blog/${post.uid}`;

              return (
                <Reveal as="li" key={post.id} delay={index * 0.06} className="border-b border-line first:border-t">
                  <Link href={href} className="group relative flex flex-col gap-5 py-6 sm:flex-row sm:items-center md:gap-7">
                    <span className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl border border-line bg-surface-2 sm:w-[220px] lg:w-[240px]">
                      {prismic.isFilled.image(image) ? (
                        <PrismicNextImage
                          field={image}
                          fallbackAlt=""
                          fill
                          sizes="(min-width: 640px) 240px, 100vw"
                          className="object-cover saturate-75 transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center">
                          <NeuralMark className="w-10 text-primary/60" />
                        </span>
                      )}
                      <span aria-hidden className="pointer-events-none absolute inset-0 bg-primary/45 mix-blend-color transition-[background-color] duration-500 group-hover:bg-primary/55" />
                      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[rgba(4,11,30,0.28)]" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-3">
                      {date && (
                        <span className="flex items-center gap-2 text-[13px] text-muted">
                          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,124,255,0.9)]" />
                          {date}
                        </span>
                      )}
                      <h3 className="font-heading text-[19px] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-primary md:text-[22px]">
                        {title}
                      </h3>
                    </span>
                    <span className="hidden size-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink transition-all duration-300 group-hover:border-primary group-hover:bg-primary sm:flex">
                      <ArrowIcon className="-rotate-45 group-hover:rotate-0" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>

          {posts.length === 0 && <p className="text-body">{lang === "en" ? "No blog posts found." : "Nema objava."}</p>}
        </div>
      </div>
    </Section>
  );
};

export default FeaturedBlogsSlice;
