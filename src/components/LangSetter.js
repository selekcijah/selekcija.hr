"use client";
import { useEffect } from "react";

/**
 * Sets the <html lang="…"> attribute client-side so that CookieConsent
 * can detect the page language without prop drilling through the root layout.
 */
export default function LangSetter({ lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
