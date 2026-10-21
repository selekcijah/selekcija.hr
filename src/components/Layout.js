import { Header } from "./Header";
import { Footer } from "./Footer";
import LangSetter from "./LangSetter";
import CookieConsent from "./CookieConsent";

export function Layout({ locales, navigation, settings, lang, children }) {
  // Map Prismic locale IDs (e.g. "hr", "en") to BCP-47 lang attribute values
  const htmlLang = lang?.slice(0, 2) || "hr";

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(34,124,255,0.16),transparent_60%)]"
      />
      <div aria-hidden className="brand-noise pointer-events-none fixed inset-0 -z-10" />
      <LangSetter lang={htmlLang} />
      <Header locales={locales} navigation={navigation} settings={settings} lang={lang} />
      <main className="pt-[84px]">{children}</main>
      <Footer navigation={navigation} settings={settings} lang={lang} />
      <CookieConsent settings={settings} lang={lang} />
    </div>
  );
}
