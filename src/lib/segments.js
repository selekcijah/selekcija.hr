/**
 * Converts a Prismic rich text / title field (or a plain string) into text
 * segments. `strong` spans become blue markers, `em` spans become mint markers.
 *
 * @param {string | import("@prismicio/client").RichTextField | null | undefined} input
 * @returns {{ text: string, tone: "blue" | "mint" | null }[]}
 */
export function toSegments(input) {
  if (!input) return [];
  if (typeof input === "string") return input.trim() ? [{ text: input, tone: null }] : [];
  if (!Array.isArray(input)) return [];

  const segments = [];

  input.forEach((block) => {
    const text = block?.text;
    if (!text) return;
    if (segments.length) segments.push({ text: " ", tone: null });

    const tones = new Array(text.length).fill(null);
    (block.spans || []).forEach((span) => {
      const tone = span.type === "strong" ? "blue" : span.type === "em" ? "mint" : null;
      if (!tone) return;
      for (let i = span.start; i < span.end; i++) tones[i] = tone;
    });

    let current = { text: "", tone: tones[0] };
    for (let i = 0; i < text.length; i++) {
      if (tones[i] !== current.tone) {
        if (current.text) segments.push(current);
        current = { text: "", tone: tones[i] };
      }
      current.text += text[i];
    }
    if (current.text) segments.push(current);
  });

  return segments;
}

/**
 * Highlights the trailing `count` words in blue when a heading carries no
 * editor-defined highlight.
 */
export function withAutoMarker(segments, count = 0, tone = "blue") {
  const textual = segments.filter((s) => s.text.trim());
  if (textual.length && textual.every((s) => s.tone)) {
    segments = [{ text: segments.map((s) => s.text).join(""), tone: null }];
  }
  if (!count || segments.some((s) => s.tone)) return segments;
  const full = segments.map((s) => s.text).join("").trimEnd();
  const words = full.split(/\s+/);
  if (words.length <= count) return segments;
  const tail = words.slice(-count).join(" ");
  const head = full.slice(0, full.length - tail.length);
  const match = tail.match(/^(.*?)([.!?,:;]*)$/);
  const out = [{ text: head, tone: null }, { text: match[1], tone }];
  if (match[2]) out.push({ text: match[2], tone: null });
  return out;
}

export const segmentsToText = (segments) => segments.map((s) => s.text).join("");
