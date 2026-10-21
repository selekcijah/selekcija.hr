import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText as BasePrismicRichText } from "@prismicio/react";
import { bulletListComponents } from "@/components/ui/listComponents";

/** @type {import("@prismicio/react").JSXMapSerializer} */
const defaultComponents = {
  paragraph: ({ children }) => <p className="mb-5 last:mb-0">{children}</p>,
  oList: ({ children }) => <ol className="mb-5 pl-5 last:mb-0 md:pl-6">{children}</ol>,
  oListItem: ({ children }) => (
    <li className="mb-1.5 list-decimal pl-1 marker:text-mint last:mb-0 md:pl-2">{children}</li>
  ),
  list: ({ children }) => <ul className="mb-5 flex flex-col gap-3 last:mb-0">{children}</ul>,
  listItem: bulletListComponents.listItem,
  preformatted: ({ children }) => (
    <pre className="mb-5 overflow-x-auto rounded-xl border border-line bg-surface-2 p-4 text-sm text-ink last:mb-0 md:p-6">
      <code>{children}</code>
    </pre>
  ),
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  hyperlink: ({ children, node }) => (
    <PrismicNextLink
      field={node.data}
      className="text-ink underline decoration-primary/50 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
    >
      {children}
    </PrismicNextLink>
  ),
};

export function PrismicRichText({ components, ...props }) {
  return <BasePrismicRichText components={{ ...defaultComponents, ...components }} {...props} />;
}
