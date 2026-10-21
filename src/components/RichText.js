import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { PrismicRichText as BasePrismicRichText } from "@prismicio/react";

/** @type {import("@prismicio/react").JSXMapSerializer} */
const blogComponents = {
  heading1: ({ children }) => <h1>{children}</h1>,
  heading2: ({ children }) => <h2>{children}</h2>,
  heading3: ({ children }) => <h3>{children}</h3>,
  heading4: ({ children }) => <h4>{children}</h4>,
  paragraph: ({ children }) => <p>{children}</p>,
  preformatted: ({ children }) => (
    <pre>
      <code>{children}</code>
    </pre>
  ),
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  list: ({ children }) => <ul>{children}</ul>,
  listItem: ({ children }) => <li>{children}</li>,
  oList: ({ children }) => <ol>{children}</ol>,
  oListItem: ({ children }) => <li>{children}</li>,
  hyperlink: ({ children, node }) => (
    <PrismicNextLink field={node.data}>{children}</PrismicNextLink>
  ),
  image: ({ node }) => (
    <figure className="rich-image">
      {node.linkTo ? (
        <PrismicNextLink field={node.linkTo}>
          <PrismicNextImage field={node} fallbackAlt="" className="h-auto w-full" />
        </PrismicNextLink>
      ) : (
        <PrismicNextImage field={node} fallbackAlt="" className="h-auto w-full" />
      )}
    </figure>
  ),
};

/**
 * Rich text renderer for blog post body content.
 */
export function RichText({ field, components }) {
  return (
    <div className="rich">
      <BasePrismicRichText field={field} components={{ ...blogComponents, ...components }} />
    </div>
  );
}
