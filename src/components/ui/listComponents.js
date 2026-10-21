/**
 * Shared rich-text list styling: glowing mint dots (and numbered ordered lists).
 */
export const bulletListComponents = {
  list: ({ children }) => <ul className="flex flex-col gap-3">{children}</ul>,
  listItem: ({ children }) => (
    <li className="relative pl-6 before:absolute before:left-0 before:top-[0.65em] before:size-1.5 before:rounded-full before:bg-mint before:shadow-[0_0_8px_rgba(69,217,150,0.9)]">
      {children}
    </li>
  ),
};
