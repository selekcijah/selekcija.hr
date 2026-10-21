import { RichText } from "@/components/RichText";

/**
 * @typedef {import("@prismicio/client").Content.BlogBodySliceSlice} BlogBodySliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BlogBodySliceSlice>} BlogBodySliceProps
 * @type {import("react").FC<BlogBodySliceProps>}
 */
const BlogBodySlice = ({ slice }) => {
  const { variation, primary } = slice;

  if (variation === "quote") {
    return (
      <blockquote className="my-10 rounded-2xl border border-primary/30 bg-primary/5 px-6 py-6 md:px-8">
        <div className="text-[20px] leading-relaxed text-ink md:text-[22px]">
          {primary.quote_text && <RichText field={primary.quote_text} />}
        </div>
        {primary.quote_source && (
          <cite className="mt-4 block text-[13px] not-italic uppercase tracking-[0.16em] text-muted">
            {primary.quote_source}
          </cite>
        )}
      </blockquote>
    );
  }

  return <RichText field={primary.content} />;
};

export default BlogBodySlice;
