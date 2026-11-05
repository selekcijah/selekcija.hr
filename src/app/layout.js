import "./globals.css";

import { PrismicPreview } from "@prismicio/next";

import { repositoryName } from "@/lib/prismicio";
import Chatbot from "@/components/Chatbot";
import CookieScripts from "@/components/CookieScripts";

/**
 * @param {{ children: React.ReactNode }}
 */
export default function RootLayout({ children }) {
  return (
    <html lang="hr" className="overflow-x-clip">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Selekcija" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#040b1e" />
        <link rel="preload" href="/fonts/space-grotesk/SpaceGrotesk-Bold.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/space-grotesk/SpaceGrotesk-Regular.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="bg-surface font-body text-body antialiased" suppressHydrationWarning>
        {children}
        <CookieScripts />
        <Chatbot />
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
