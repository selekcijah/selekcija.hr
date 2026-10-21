"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";
import * as prismic from "@prismicio/client";
import { Input } from "@/components/ui/Field";
import { NeuralMark } from "@/components/ui/NeuralMark";

/**
 * Blog sidebar with search and latest posts.
 * @param {{ latestPosts: any[], lang: string, searchQuery?: string }} props
 */
export function BlogSidebar({ latestPosts = [], lang = "hr", searchQuery = "" }) {
  const router = useRouter();
  const [query, setQuery] = useState(searchQuery);
  const isEn = lang === "en" || lang === "en-gb";
  const blogBase = isEn ? "/en/blog" : "/blog";

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `${blogBase}?search=${encodeURIComponent(q)}` : blogBase);
  }

  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface-3/50 p-6 backdrop-blur-sm">
        <h3 className="mb-4 font-heading text-[18px] font-semibold text-ink">{isEn ? "Search" : "Pretraži"}</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isEn ? "Search here…" : "Pretraži…"}
            aria-label={isEn ? "Search" : "Pretraži"}
          />
          <button
            type="submit"
            aria-label={isEn ? "Search" : "Pretraži"}
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-hover"
          >
            <i className="ri-search-line text-[18px]" />
          </button>
        </form>
      </div>

      {latestPosts.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface-3/50 p-6 backdrop-blur-sm">
          <h3 className="mb-5 font-heading text-[18px] font-semibold text-ink">
            {isEn ? "Latest posts" : "Najnoviji članci"}
          </h3>
          <ul className="flex flex-col gap-4">
            {latestPosts.map((post) => {
              const href = post.lang?.startsWith("en") ? `/en/blog/${post.uid}` : `/blog/${post.uid}`;
              const rawDate = post.data.date || post.first_publication_date;
              const date = rawDate
                ? new Date(rawDate).toLocaleDateString(isEn ? "en-GB" : "hr-HR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : null;
              const title = prismic.asText(post.data.title);
              const image = post.data.featured_image;

              return (
                <li key={post.id}>
                  <Link href={href} className="group flex gap-3">
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-2">
                      {prismic.isFilled.image(image) ? (
                        <PrismicNextImage field={image} fill sizes="64px" fallbackAlt="" className="object-cover" />
                      ) : (
                        <span className="flex size-full items-center justify-center">
                          <NeuralMark className="w-5 text-primary/50" />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      {date && <span className="mb-1 block text-[12px] text-muted">{date}</span>}
                      <span className="block text-[14px] font-medium leading-snug text-ink transition-colors group-hover:text-primary">
                        {title}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
