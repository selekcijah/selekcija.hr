import { createClient } from "@/lib/prismicio";
import { Suspense } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BlogListClient } from "./BlogListClient";

/**
 * @typedef {import("@prismicio/client").Content.BlogListSliceSlice} BlogListSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BlogListSliceSlice>} BlogListSliceProps
 * @type {import("react").FC<BlogListSliceProps>}
 */
const BlogListSlice = async ({ slice, context }) => {
  const lang = context?.lang ?? "hr";
  const client = createClient();

  const posts = await client
    .getAllByType("blog_post", {
      lang,
      orderings: [{ field: "my.blog_post.date", direction: "desc" }],
    })
    .catch(() => []);

  return (
    <Section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <SectionHeader
        heading={slice.primary?.heading}
        description={slice.primary?.description}
        className="mb-12 md:mb-16"
      />
      <Suspense fallback={<p className="text-center text-body">Loading…</p>}>
        <BlogListClient posts={posts} lang={lang} />
      </Suspense>
    </Section>
  );
};

export default BlogListSlice;
