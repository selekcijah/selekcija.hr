import { Layout } from "@/components/Layout";
import { NotFoundView } from "@/components/NotFoundView";
import { getNotFoundChrome } from "@/lib/notFoundChrome";

export const metadata = {
  title: "404 | selekcija",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const { lang, navigation, settings, locales } = await getNotFoundChrome();

  return (
    <Layout locales={locales} navigation={navigation} settings={settings} lang={lang}>
      <NotFoundView />
    </Layout>
  );
}
