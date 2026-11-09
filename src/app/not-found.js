import { Layout } from "@/components/Layout";
import { NotFoundView } from "@/components/NotFoundView";

export const metadata = {
  title: "404 | selekcija",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Layout locales={[]} navigation={null} settings={null} lang="hr">
      <NotFoundView />
    </Layout>
  );
}
