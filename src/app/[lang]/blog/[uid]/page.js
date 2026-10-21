import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";

import { createClient } from "@/lib/prismicio";
import { reverseLocaleLookup } from "@/i18n";
import { getLocales } from "@/lib/getLocales";
import { Layout } from "@/components/Layout";
import { BlogSidebar } from "@/components/BlogSidebar";
import { components } from "@/slices";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { NeuralMark } from "@/components/ui/NeuralMark";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

function readingTime(post, isEn) {
  const text = [
    prismic.asText(post.data.content),
    prismic.asText(post.data.title),
    post.data.excerpt || "",
  ].join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return isEn ? `${minutes} min read` : `${minutes} min čitanja`;
}

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params }) {
  const { uid, lang } = await params;
  const prismicLang = reverseLocaleLookup(lang);
  const client = createClient();

  const post = await client.getByUID("blog_post", uid, { lang: prismicLang }).catch(() => null);

  if (!post) return { title: "" };

  const metaTitle = post.data.meta_title || prismic.asText(post.data.title) || "";
  const metaDescription = post.data.meta_description || undefined;
  const metaImage = post.data.meta_image || post.data.featured_image || null;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: metaImage
      ? {
          images: [
            {
              url: metaImage.url,
              alt: metaImage.alt || undefined,
              width: metaImage.dimensions?.width,
              height: metaImage.dimensions?.height,
            },
          ],
        }
      : undefined,
    twitter: metaImage ? { card: "summary_large_image", images: [metaImage.url] } : undefined,
  };
}

export default async function BlogPostPage({ params }) {
  const { uid, lang } = await params;
  const prismicLang = reverseLocaleLookup(lang);
  const client = createClient();

  const [post, navigation, settings] = await Promise.all([
    client.getByUID("blog_post", uid, { lang: prismicLang }).catch(() => null),
    client.getSingle("navigation", { lang: prismicLang }).catch(() => null),
    client.getSingle("settings", { lang: prismicLang }).catch(() => null),
  ]);

  if (!post) notFound();

  const allPosts = await client
    .getAllByType("blog_post", {
      lang: prismicLang,
      orderings: [{ field: "my.blog_post.date", direction: "desc" }],
    })
    .catch(() => []);

  const latestPosts = allPosts.filter((p) => p.uid !== uid).slice(0, 5);
  const locales = await getLocales(post, client).catch(() => []);

  const isEn = lang === "en";
  const blogBase = isEn ? "/en/blog" : "/blog";
  const title = prismic.asText(post.data.title);
  const rawDate = post.data.date || post.first_publication_date;
  const date = rawDate
    ? new Date(rawDate).toLocaleDateString(isEn ? "en-GB" : "hr-HR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const author = post.data.author;
  const featuredImage = post.data.featured_image;

  return (
    <Layout locales={locales} navigation={navigation} settings={settings} lang={prismicLang}>
      <section className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_15%_0%,rgba(34,124,255,0.22),transparent_65%)]" />
          <div className="bg-grid absolute inset-0" />
          <NeuralMark className="animate-float-slow absolute -right-10 top-1/2 w-[220px] -translate-y-1/2 text-primary/15 md:right-[6%] md:w-[300px]" />
        </div>
        <div className="mx-auto w-full max-w-[1240px] px-5 py-16 md:px-8 md:py-24">
          <p className="mb-6 text-[13px] text-muted">
            <Link href={isEn ? "/en" : "/"} className="hover:text-ink">
              {isEn ? "Home" : "Početna"}
            </Link>
            <span className="mx-2 text-line-strong">/</span>
            <Link href={blogBase} className="hover:text-ink">
              Blog
            </Link>
            <span className="mx-2 text-line-strong">/</span>
            <span className="text-ink">{isEn ? "Article" : "Članak"}</span>
          </p>
          <MarkerHeading text={title} as="h1" size="xl" autoMarker={1} className="max-w-[920px]" />
          <div className="mt-6 flex flex-wrap items-center gap-4 text-[14px] text-body">
            {author && <span>{author}</span>}
            {date && (
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,124,255,0.9)]" />
                {date}
              </span>
            )}
            <span>{readingTime(post, isEn)}</span>
          </div>
        </div>
      </section>

      <div className="py-16 md:py-24">
        <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-12 px-5 md:px-8 lg:grid-cols-12">
          <article className="lg:col-span-8">
            {prismic.isFilled.image(featuredImage) && (
              <Reveal className="mb-10 overflow-hidden rounded-3xl border border-line">
                <PrismicNextImage
                  field={featuredImage}
                  width={1200}
                  height={720}
                  fallbackAlt=""
                  priority
                  className="h-auto w-full object-cover"
                />
              </Reveal>
            )}

            {prismic.isFilled.richText(post.data.content) && (
              <div className="mb-8">
                <components.blog_body_slice slice={{ primary: { content: post.data.content } }} />
              </div>
            )}

            <SliceZone slices={post.data.slices} components={components} context={{ lang: prismicLang }} />

            <div className="mt-12 border-t border-line pt-8">
              <Button href={blogBase} variant="ghost">
                {isEn ? "Back to blog" : "Povratak na blog"}
              </Button>
            </div>
          </article>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[120px]">
              <BlogSidebar latestPosts={latestPosts} lang={prismicLang} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  const posts = await client.getAllByType("blog_post", { lang: "*" }).catch(() => []);

  return posts
    .filter((post) => typeof post.uid === "string" && post.uid.length > 0)
    .map((post) => ({
      uid: post.uid,
      lang: post.lang?.startsWith("en") ? "en" : "hr",
    }));
}
