"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { MarkerHeading } from "@/components/ui/MarkerHeading";
import { NeuralMark } from "@/components/ui/NeuralMark";

const COPY = {
  hr: {
    code: "404",
    title: "Stranica nije pronađena",
    body: "Tražena stranica ne postoji ili je premještena. Provjeri adresu ili se vrati na početnu.",
    home: "Natrag na početnu",
  },
  en: {
    code: "404",
    title: "Page not found",
    body: "The page you’re looking for doesn’t exist or has been moved. Check the URL or head back home.",
    home: "Back to home",
  },
};

/**
 * 404 content for use inside the site Layout (header + footer provided by parent).
 * Language follows the URL (`/en…` → English, otherwise Croatian).
 */
export function NotFoundView() {
  const pathname = usePathname() || "";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const t = COPY[isEn ? "en" : "hr"];
  const homeHref = isEn ? "/en" : "/";

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(34,124,255,0.22),transparent_65%)]" />
        <div className="bg-grid absolute inset-0 opacity-60" />
        <NeuralMark className="animate-float-slow absolute -right-16 top-1/2 w-[280px] -translate-y-1/2 text-primary/15 md:right-[8%] md:w-[420px]" />
        <div className="absolute -left-20 bottom-0 size-[420px] rounded-full bg-primary/15 blur-[140px]" />
      </div>

      <div className="mx-auto flex w-full max-w-[1240px] flex-col justify-center px-5 py-20 md:px-8 md:py-28 lg:min-h-[60vh]">
        <p
          aria-hidden
          className="mb-4 font-heading text-[72px] font-bold leading-none tracking-[-0.06em] text-primary/25 sm:text-[96px] md:text-[120px]"
        >
          {t.code}
        </p>
        <MarkerHeading as="h1" size="xl" text={t.title} autoMarker={1} className="max-w-[720px]" />
        <p className="mt-5 max-w-[480px] text-[16px] leading-relaxed text-body md:text-[17px]">{t.body}</p>
        <div className="mt-10">
          <Button href={homeHref} size="lg">
            {t.home}
          </Button>
        </div>
      </div>
    </section>
  );
}
