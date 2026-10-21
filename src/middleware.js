import { NextResponse } from "next/server";

const DEFAULT_LOCALE = "hr";
const NON_DEFAULT_PREFIXES = ["en"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Redirect /hr/... → /... (remove default locale prefix from URL)
  if (
    pathname.startsWith(`/${DEFAULT_LOCALE}/`) ||
    pathname === `/${DEFAULT_LOCALE}`
  ) {
    request.nextUrl.pathname =
      pathname.replace(new RegExp(`^\/${DEFAULT_LOCALE}`), "") || "/";
    return NextResponse.redirect(request.nextUrl);
  }

  // /en/... or /en — pass through, App Router handles it
  const hasNonDefaultLocale = NON_DEFAULT_PREFIXES.some(
    (loc) =>
      pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`,
  );
  if (hasNonDefaultLocale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // No locale prefix → rewrite internally to /hr/... for the [lang] segment
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  request.nextUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(request.nextUrl, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next|api|slice-simulator|favicon.ico|site\\.webmanifest|.*\\.(?:css|js|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp|map|webmanifest)).*)",
  ],
};
