"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { COOKIE_KEY, hasTrackingConsent } from "@/lib/cookies";

/**
 * Renders analytics / tracking scripts only when the user has accepted cookies.
 * Listens for the "cookieConsentAccepted" event so scripts load immediately on
 * first-time acceptance — no page reload needed.
 */
export default function CookieScripts() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (hasTrackingConsent(localStorage.getItem(COOKIE_KEY))) {
      setAccepted(true);
      return;
    }

    function handleAccept() {
      setAccepted(true);
    }
    window.addEventListener("cookieConsentAccepted", handleAccept);
    return () => window.removeEventListener("cookieConsentAccepted", handleAccept);
  }, []);

  if (!accepted) return null;

  return (
    <>
      {/* ── Google Analytics ── Replace G-XXXXXXXXXX with your Measurement ID ── */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}

      {/* ── Add other consent-gated scripts here (e.g. Meta Pixel, Hotjar) ── */}
    </>
  );
}
