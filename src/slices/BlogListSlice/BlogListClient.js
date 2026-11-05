"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";
import * as prismic from "@prismicio/client";
import { ArrowIcon } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { NeuralMark } from "@/components/ui/NeuralMark";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

const POSTS_PER_PAGE = 9;

function buildUrl(blogBase, page, q) {
  const params = new URLSearchParams();
  if (q) params.set("search", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${blogBase}?${qs}` : blogBase;
}

/**
 * Client component: renders the blog post grid with search filter and pagination.
 * @param {{ posts: any[], lang: string }} props
 */
export function BlogListClient({ posts, lang }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [draft, setDraft] = useState(searchQuery);

  const isEn = lang === "en-gb" || lang === "en";
  const blogBase = isEn ? "/en/blog" : "/blog";

  const filtered = searchQuery
    ? posts.filter((post) => {
        const title = prismic.asText(post.data.title).toLowerCase();
        const excerpt = (post.data.excerpt || "").toLowerCase();
        const content = prismic.asText(post.data.content).toLowerCase();
        const q = searchQuery.toLowerCase();
        return title.includes(q) || excerpt.includes(q) || content.includes(q);
      })
    : posts;

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const safePage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
  const startIdx = (safePage - 1) * POSTS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + POSTS_PER_PAGE);

  function handleSearch(e) {
    e.preventDefault();
    router.push(buildUrl(blogBase, 1, draft.trim()));
  }

  return (
    <>
      <form onSubmit={handleSearch} className="mx-auto mb-12 flex max-w-[520px] gap-2 rounded-full border border-line-strong bg-surface-2/70 p-1.5 backdrop-blur-md">
        <Input
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={isEn ? "Search articles…" : "Pretraži članke…"}
          aria-label={isEn ? "Search articles" : "Pretraži članke"}
          className="border-0 bg-transparent py-2.5 shadow-none focus:ring-0"
        />
        <button
          type="submit"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-hover"
          aria-label={isEn ? "Search" : "Pretraži"}
        >
          <i className="ri-search-line text-[18px]" />
        </button>
      </form>

      {paginated.length === 0 ? (
        <p className="py-16 text-center text-body">
          {isEn
            ? `No posts found${searchQuery ? ` for “${searchQuery}”` : ""}.`
            : `Nema objava${searchQuery ? ` za “${searchQuery}”` : ""}.`}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginated.map((post, index) => {
            const href = post.lang?.startsWith("en") ? `/en/blog/${post.uid}` : `/blog/${post.uid}`;
            const title = prismic.asText(post.data.title);
            const image = post.data.featured_image;
            const rawDate = post.data.date || post.first_publication_date;
            const date = rawDate
              ? new Date(rawDate).toLocaleDateString(isEn ? "en-GB" : "hr-HR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : null;
            const author = post.data.author;
            const excerpt = post.data.excerpt;

            return (
              <Reveal key={post.id} delay={index * 0.05}>
                <Link
                  href={href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-3/40 transition duration-500 hover:border-line-strong"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-surface-2">
                    {prismic.isFilled.image(image) ? (
                      <PrismicNextImage
                        field={image}
                        fill
                        sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
                        fallbackAlt=""
                        className="object-cover saturate-75 transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center">
                        <NeuralMark className="w-12 text-primary/50" />
                      </span>
                    )}
                    <span aria-hidden className="pointer-events-none absolute inset-0 bg-primary/45 mix-blend-color transition-[background-color] duration-500 group-hover:bg-primary/55" />
                    <span aria-hidden className="pointer-events-none absolute inset-0 bg-[rgba(4,11,30,0.28)]" />
                  </span>
                  <span className="flex flex-1 flex-col gap-3 p-6">
                    <span className="flex flex-wrap items-center gap-3 text-[13px] text-muted">
                      {date && (
                        <span className="inline-flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,124,255,0.9)]" />
                          {date}
                        </span>
                      )}
                      {author && <span>By {author}</span>}
                    </span>
                    <h3 className="font-heading text-[20px] font-semibold leading-snug text-ink transition-colors group-hover:text-primary">
                      {title}
                    </h3>
                    {excerpt && <p className="line-clamp-3 text-[14px] leading-relaxed text-body">{excerpt}</p>}
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[14px] font-medium text-ink">
                      {isEn ? "Read more" : "Čitaj više"}
                      <ArrowIcon className="size-3.5" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
          <PageLink href={safePage > 1 ? buildUrl(blogBase, safePage - 1, searchQuery) : null} label={isEn ? "Previous" : "Prethodna"}>
            <i className="ri-arrow-left-long-line" />
          </PageLink>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <PageLink key={num} href={buildUrl(blogBase, num, searchQuery)} active={num === safePage}>
              {String(num).padStart(2, "0")}
            </PageLink>
          ))}
          <PageLink href={safePage < totalPages ? buildUrl(blogBase, safePage + 1, searchQuery) : null} label={isEn ? "Next" : "Sljedeća"}>
            <i className="ri-arrow-right-long-line" />
          </PageLink>
        </nav>
      )}
    </>
  );
}

function PageLink({ href, active, label, children }) {
  const classes = cn(
    "inline-flex size-11 items-center justify-center rounded-full border text-[13px] font-medium transition",
    active
      ? "border-primary bg-primary text-white"
      : href
        ? "border-line-strong text-ink hover:border-primary hover:bg-primary/10"
        : "pointer-events-none border-line text-muted",
  );
  if (!href) {
    return (
      <span className={classes} aria-disabled="true" aria-label={label}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={classes} aria-current={active ? "page" : undefined} aria-label={label}>
      {children}
    </Link>
  );
}
