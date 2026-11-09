import { Layout } from "@/components/Layout";
import { NotFoundView } from "@/components/NotFoundView";

export const metadata = {
  title: "404 | selekcija",
  robots: { index: false, follow: false },
};

/**
 * Locale-segment 404 used when `notFound()` is called from `[lang]` routes.
 * Kept free of request APIs so unknown URLs are served as static HTML.
 */
export default function LangNotFound() {
  return (
    <Layout locales={[]} navigation={null} settings={null} lang="hr">
      <NotFoundView />
    </Layout>
  );
}
