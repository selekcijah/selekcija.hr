import { cn } from "./cn";

/**
 * Decorative neural-network mark from the logo, drawn with `currentColor`.
 */
export function NeuralMark({ className }) {
  return <span aria-hidden="true" className={cn("mask-neural inline-block aspect-[292/326] bg-current", className)} />;
}
