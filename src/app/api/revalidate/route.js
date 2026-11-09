import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  let bodySecret = null;
  try {
    const body = await request.json();
    if (typeof body?.secret === "string") bodySecret = body.secret;
  } catch {
    // Prismic always sends JSON. Anything else is ignored.
  }
  const provided =
    bodySecret ||
    request.headers.get("x-revalidate-secret") ||
    new URL(request.url).searchParams.get("secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag("prismic");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
