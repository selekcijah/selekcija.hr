import { redirectToPreviewURL } from "@prismicio/next";
import { createClient } from "@/lib/prismicio";

/**
 * @param {import("next/server").NextRequest} request
 */
export async function GET(request) {
  const client = createClient();

  return await redirectToPreviewURL({ client, request });
}
