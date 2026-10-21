import { NextResponse } from "next/server";

/**
 * Brevo newsletter subscribe endpoint.
 *
 * Required environment variable:
 *   BREVO_API_KEY – your Brevo v3 API key
 *
 * List ID: passed per request from NewsletterSlice (Prismic `brevo_list_id` field),
 * with optional fallback to BREVO_LIST_ID env var.
 *
 * Brevo Contacts API: https://developers.brevo.com/reference/createcontact
 */
export async function POST(req) {
  try {
    const { email, listId } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 },
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const brevoListId = Number(listId || process.env.BREVO_LIST_ID);

    if (!apiKey) {
      console.error("Missing BREVO_API_KEY environment variable.");
      return NextResponse.json(
        { success: false, error: "Newsletter service not configured." },
        { status: 500 },
      );
    }

    if (!brevoListId || Number.isNaN(brevoListId)) {
      return NextResponse.json(
        { success: false, error: "Invalid Brevo list configuration." },
        { status: 500 },
      );
    }

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        listIds: [brevoListId],
        updateEnabled: true,
      }),
    });

    if (brevoRes.ok || brevoRes.status === 204) {
      return NextResponse.json({ success: true });
    }

    const errorBody = await brevoRes.json().catch(() => ({}));
    const message = errorBody?.message || `Brevo error ${brevoRes.status}`;
    console.error("Brevo API error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: brevoRes.status },
    );
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error." },
      { status: 500 },
    );
  }
}
