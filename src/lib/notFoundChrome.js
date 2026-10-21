import { headers } from "next/headers";
import { createClient } from "@/lib/prismicio";

/**
 * Resolves language + Layout chrome (nav/settings/locales) for 404 pages.
 */
export async function getNotFoundChrome() {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const lang = isEn ? "en" : "hr";

  const client = createClient();
  const [navigation, settings] = await Promise.all([
    client.getSingle("navigation", { lang }).catch(() => null),
    client.getSingle("settings", { lang }).catch(() => null),
  ]);

  const locales = [
    { lang: "hr", lang_name: "Croatian", url: "/" },
    { lang: "en", lang_name: "English", url: "/en" },
  ];

  return { lang, navigation, settings, locales };
}
