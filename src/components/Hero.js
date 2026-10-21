import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@/components/PrismicRichText";
import RotatingWord from "@/components/RotatingWord";
import { StatValue } from "@/components/CountUpNumber";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { toSegments } from "@/lib/segments";
import { Button } from "./ui/Button";
import { GlassCard } from "./ui/GlassCard";
import { MonoLogo } from "./ui/MonoLogo";
import { Reveal } from "./ui/Reveal";
import { WordReveal } from "./ui/WordReveal";
import { cn } from "./ui/cn";

function splitHeadingLastWord(heading) {
  const fullText = prismic.asText(heading).trimEnd();

  if (!fullText) {
    return { prefixText: "", lastWord: "", punctuation: "" };
  }

  const lastSpace = fullText.lastIndexOf(" ");
  const prefixText = lastSpace >= 0 ? fullText.slice(0, lastSpace) : "";
  const lastToken = lastSpace >= 0 ? fullText.slice(lastSpace + 1) : fullText;
  const tokenMatch = lastToken.match(/^(.*?)([.!?,:;]*)$/);
  const lastWord = tokenMatch?.[1] || lastToken;
  const punctuation = tokenMatch?.[2] || "";

  return { prefixText, lastWord, punctuation };
}

const HEADING =
  "font-heading font-bold tracking-[-0.035em] text-ink text-balance text-[42px] leading-[1.28] sm:text-[58px] lg:text-[76px] xl:text-[88px]";

/**
 * Full-viewport hero on the animated neural backdrop.
 *
 * @param {import("@prismicio/client").Content.HeroSliceSlice} slice
 */
export function Hero({ slice }) {
  const isBlueTheme = slice.variation === "blue";
  const { heading, rotating_words, stats, description, button_link, button_link_2, features, logos } = slice.primary;

  const hasRotating = rotating_words && rotating_words.length > 0;
  const headingText = prismic.asText(heading).trimEnd();
  const { prefixText, lastWord, punctuation } = splitHeadingLastWord(heading);
  const rotatingEntries = hasRotating ? rotating_words.map((item) => item.word?.trim()).filter(Boolean) : [];
  const shouldReplaceLastWord =
    hasRotating && lastWord && rotatingEntries.some((word) => word.toLowerCase() === lastWord.toLowerCase());
  const wordList = hasRotating
    ? [...(shouldReplaceLastWord ? [lastWord] : []), ...rotatingEntries].filter(
        (word, index, list) => word && list.indexOf(word) === index,
      )
    : [];
  const markerClass = isBlueTheme ? "marker marker-mint" : "marker";
  const filledStats = (stats ?? []).filter((s) => s.value || s.label);
  const filledLogos = (logos ?? []).filter((l) => prismic.isFilled.image(l.logo) || l.logo_name);
  const filledFeatures = (features ?? []).filter((f) => f.title || f.description);

  return (
    <section className="relative isolate -mt-[84px] flex min-h-[100svh] flex-col overflow-hidden pt-[84px]">
      <HeroBackdrop accent={isBlueTheme ? "mint" : "blue"} />

      <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center px-5 py-20 text-center md:px-8 md:py-28">
        {prismic.isFilled.richText(heading) && (
          <h1 className={cn(HEADING, "max-w-[1100px]")}>
            {hasRotating && wordList.length > 0 ? (
              <>
                <WordReveal as="span" segments={toSegments(shouldReplaceLastWord ? prefixText : headingText)} />{" "}
                <Reveal as="span" delay={0.35} y={0} className="inline-block">
                  <span className={markerClass}>
                    <RotatingWord words={wordList} />
                  </span>
                </Reveal>
                {shouldReplaceLastWord ? punctuation : ""}
              </>
            ) : (
              <WordReveal as="span" segments={toSegments(heading)} />
            )}
          </h1>
        )}

        {prismic.isFilled.richText(description) && (
          <Reveal delay={0.5} className="mt-7 max-w-[620px] text-[17px] leading-relaxed text-body md:text-[20px]">
            <PrismicRichText field={description} />
          </Reveal>
        )}

        {(prismic.isFilled.link(button_link) || prismic.isFilled.link(button_link_2)) && (
          <Reveal delay={0.65} className="mt-10 flex flex-wrap justify-center gap-3">
            <Button field={button_link} size="lg" variant={isBlueTheme ? "mint" : "primary"} />
            <Button field={button_link_2} size="lg" variant="ghost" />
          </Reveal>
        )}

        {filledLogos.length > 0 && (
          <Reveal delay={0.8} className="mt-14">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Trusted by</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {filledLogos.map((item, i) =>
                prismic.isFilled.image(item.logo) ? (
                  <span key={i} className="opacity-60 transition-opacity duration-300 hover:opacity-100">
                    <MonoLogo
                      src={`${item.logo.url.split("?")[0]}?auto=format&h=96`}
                      alt={item.logo_name || item.logo.alt || ""}
                      className="h-8 w-auto"
                    />
                  </span>
                ) : (
                  <span key={i} className="font-heading text-[15px] font-semibold text-ink/40">
                    {item.logo_name}
                  </span>
                ),
              )}
            </div>
          </Reveal>
        )}
      </div>

      {filledStats.length > 0 && (
        <div className="mx-auto w-full max-w-[1240px] px-5 pb-12 md:px-8 md:pb-16">
          <Reveal delay={0.8} y={36}>
            <dl
              className={cn(
                "grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-surface-2/50 backdrop-blur-md sm:grid-cols-3",
                filledStats.length >= 6 ? "lg:grid-cols-6" : filledStats.length === 4 ? "lg:grid-cols-4" : "",
              )}
            >
              {filledStats.map((stat, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-center gap-1.5 border-line px-4 py-6 text-center [&:not(:last-child)]:border-r max-sm:[&:nth-child(2n)]:border-r-0 sm:max-lg:[&:nth-child(3n)]:border-r-0 max-lg:border-b"
                >
                  <dd className="order-1 font-heading text-[30px] font-bold leading-none tracking-tight text-ink md:text-[36px]">
                    <StatValue value={stat.value} />
                  </dd>
                  {stat.label && (
                    <dt className="order-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{stat.label}</dt>
                  )}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-6 top-0 h-px scale-x-0 transition-transform duration-500 group-hover:scale-x-100",
                      isBlueTheme ? "bg-mint" : "bg-primary",
                    )}
                  />
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      )}

      {filledFeatures.length > 0 && (
        <div className="mx-auto grid w-full max-w-[1240px] gap-4 px-5 pb-16 md:grid-cols-3 md:px-8">
          {filledFeatures.map((feature, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <GlassCard className="h-full" innerClassName="flex gap-4 p-6">
                {prismic.isFilled.image(feature.icon) && (
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                    <PrismicNextImage field={feature.icon} fallbackAlt="" className="size-6 object-contain brightness-0 invert" />
                  </span>
                )}
                <div className="text-left">
                  {feature.title && <h3 className="mb-1.5 text-[16px] font-semibold text-ink">{feature.title}</h3>}
                  {feature.description && <p className="text-[14px] leading-relaxed text-body">{feature.description}</p>}
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
