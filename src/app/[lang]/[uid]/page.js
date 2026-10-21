import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { getLocales } from "@/lib/getLocales";
import { reverseLocaleLookup } from "@/i18n";
import { createClient } from "@/lib/prismicio";
import { notFound } from "next/navigation";

import { Layout } from "@/components/Layout";
import { components } from "@/slices";

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params }) {
  const { uid, lang } = await params;
  const client = createClient();
  const page = await client.getByUID("page", uid, { lang }).catch(() => null);

  if (!page) {
    return {
      title: "",
    };
  }
  const metaTitle = page.data.meta_title || prismic.asText(page.data.title);
  const metaDescription = page.data.meta_description || undefined;
  const metaImage = page.data.meta_image || null;

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
    twitter: metaImage
      ? {
          card: "summary_large_image",
          images: [metaImage.url],
        }
      : undefined,
  };
}

export default async function Page({ params }) {
  const { uid, lang } = await params;
  const client = createClient();

  const page = await client.getByUID("page", uid, {
    lang: reverseLocaleLookup(lang),
  }).catch(() => notFound());
  
  const navigation = await client.getSingle("navigation", {
    lang: reverseLocaleLookup(lang),
  }).catch(() => null);
  
  const settings = await client.getSingle("settings", {
    lang: reverseLocaleLookup(lang),
  }).catch(() => null);

  const locales = await getLocales(page, client);

  return (
    <Layout locales={locales} navigation={navigation} settings={settings} lang={reverseLocaleLookup(lang)}>
      <SliceZone slices={page.data.slices} components={components} context={{ settings, lang: reverseLocaleLookup(lang) }} />
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("page", {
    lang: "*",
    filters: [prismic.filter.not("my.page.uid", "home")],
  });

  return pages
    .filter((page) => typeof page.uid === "string" && page.uid.length > 0)
    .map((page) => ({
      uid: page.uid,
      lang: page.lang,
    }));
}
