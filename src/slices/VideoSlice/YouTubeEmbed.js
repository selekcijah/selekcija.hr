"use client";

import { useState } from "react";
import Image from "next/image";

function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Client-side YouTube embed with thumbnail → iframe swap on play.
 * @param {{ videoId: string, title?: string }} props
 */
export function YouTubeEmbed({ videoId, title = "YouTube video" }) {
  const [playing, setPlaying] = useState(false);

  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl border border-line bg-surface-2">
      {playing ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 cursor-pointer"
        >
          <Image src={thumbnailUrl} alt={title} fill sizes="100vw" className="object-cover" unoptimized />
          <span className="absolute inset-0 bg-surface/25" />
          <span className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_0_12px_rgba(34,124,255,0.28),0_0_50px_rgba(34,124,255,0.55)]">
            <i className="ri-play-fill text-[28px]" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}

export { extractYouTubeId };
