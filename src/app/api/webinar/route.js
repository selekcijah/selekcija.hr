import { NextResponse } from "next/server";

/**
 * Brevo webinar registration endpoint.
 *
 * Required environment variables:
 *   BREVO_API_KEY – your Brevo v3 API key
 *
 * The Brevo list ID is passed per request from the WebinarForm slice (Prismic field).
 *
 * Brevo Contacts API: https://developers.brevo.com/reference/createcontact
 */
export async function POST(req) {
  try {
    const { firstName, lastName, company, email, listId } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 },
      );
    }

    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { success: false, error: "First name and last name are required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const brevoListId = Number(listId);

    if (!apiKey) {
      console.error("Missing BREVO_API_KEY environment variable.");
      return NextResponse.json(
        { success: false, error: "Registration service not configured." },
        { status: 500 },
      );
    }

    if (!brevoListId || Number.isNaN(brevoListId)) {
      return NextResponse.json(
        { success: false, error: "Invalid Brevo list configuration." },
        { status: 500 },
      );
    }

    const attributes = {
      FIRSTNAME: firstName.trim(),
      LASTNAME: lastName.trim(),
    };

    if (company?.trim()) {
      attributes.COMPANY = company.trim();
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
        attributes,
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
    console.error("Webinar registration route error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error." },
      { status: 500 },
    );
  }
}
