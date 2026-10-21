import { createClient } from "@/lib/prismicio";

/**
 * Next.js 15 App Router sitemap.
 * Returns metadata-style sitemap entries that Next converts to sitemap.xml.
 *
 * Locales:
 *   hr → canonical URL (no prefix, e.g. "/o-nama")
 *   en → prefixed URL (e.g. "/en/about")
 *
 * Each page entry includes alternates.languages for hreflang tags.
 *
 * @returns {Promise<import("next").MetadataRoute.Sitemap>}
 */
export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://selekcija.hr";
  const client = createClient();

  const entries = [];

  // ── Static / known routes ──────────────────────────────────────────────────
  entries.push({
    url: `${siteUrl}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
    alternates: {
      languages: {
        hr: `${siteUrl}/`,
        en: `${siteUrl}/en`,
      },
    },
  });

  // ── Dynamic pages from Prismic ─────────────────────────────────────────────
  const pages = await client
    .getAllByType("page", { lang: "*" })
    .catch(() => []);

  // Group pages by uid so we can build alternates
  const byUid = {};
  for (const page of pages) {
    if (!byUid[page.uid]) byUid[page.uid] = {};
    byUid[page.uid][page.lang] = page;
  }

  for (const [uid, variants] of Object.entries(byUid)) {
    if (uid === "home") continue; // already added above

    const hrPage = variants["hr"];
    const enPage = variants["en"];

    const canonicalUrl = hrPage
      ? `${siteUrl}/${uid}`
      : `${siteUrl}/en/${enPage?.uid || uid}`;

    const alternateLanguages = {};
    if (hrPage) alternateLanguages.hr = `${siteUrl}/${uid}`;
    if (enPage) alternateLanguages.en = `${siteUrl}/en/${enPage.uid}`;

    entries.push({
      url: canonicalUrl,
      lastModified: new Date(
        hrPage?.last_publication_date ||
        enPage?.last_publication_date ||
        new Date()
      ),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: alternateLanguages },
    });
  }

  // ── Blog posts ─────────────────────────────────────────────────────────────
  const posts = await client
    .getAllByType("blog_post", { lang: "*" })
    .catch(() => []);

  const byPostUid = {};
  for (const post of posts) {
    if (!byPostUid[post.uid]) byPostUid[post.uid] = {};
    byPostUid[post.uid][post.lang] = post;
  }

  for (const [uid, variants] of Object.entries(byPostUid)) {
    const hrPost = variants["hr"];
    const enPost = variants["en"];

    const canonicalUrl = hrPost
      ? `${siteUrl}/blog/${uid}`
      : `${siteUrl}/en/blog/${enPost?.uid || uid}`;

    const alternateLanguages = {};
    if (hrPost) alternateLanguages.hr = `${siteUrl}/blog/${uid}`;
    if (enPost) alternateLanguages.en = `${siteUrl}/en/blog/${enPost.uid}`;

    entries.push({
      url: canonicalUrl,
      lastModified: new Date(
        hrPost?.last_publication_date ||
        enPost?.last_publication_date ||
        new Date()
      ),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: alternateLanguages },
    });
  }

  return entries;
}
