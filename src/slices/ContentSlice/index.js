import * as prismic from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { Section } from "@/components/ui/Section";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { Reveal } from "@/components/ui/Reveal";

const bodyComponents = {
  hyperlink: ({ children, node }) => <PrismicNextLink field={node.data}>{children}</PrismicNextLink>,
  image: ({ node }) => (
    <figure className="rich-image">
      <PrismicNextImage field={node} fallbackAlt="" className="h-auto w-full object-cover" />
    </figure>
  ),
};

const ContentSlice = ({ slice }) => {
  const { heading, lead, body } = slice.primary;

  return (
    <Section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {(prismic.isFilled.richText(heading) || prismic.isFilled.richText(lead)) && (
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-6 lg:sticky lg:top-[120px]">
              {prismic.isFilled.richText(heading) && <MarkerHeading field={heading} size="lg" autoMarker={1} />}
              {prismic.isFilled.richText(lead) && (
                <Reveal delay={0.15} className="border-l-2 border-primary pl-5 text-[18px] leading-relaxed text-ink/85 md:text-[20px]">
                  <PrismicRichText field={lead} />
                </Reveal>
              )}
            </div>
          </div>
        )}

        {prismic.isFilled.richText(body) && (
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rich rounded-3xl border border-line bg-surface-2/50 p-7 text-[16px] backdrop-blur-sm md:p-10 md:text-[17px]">
              <PrismicRichText field={body} components={bodyComponents} />
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
};

export default ContentSlice;
