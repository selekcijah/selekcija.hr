import { redirect } from "next/navigation";

// Redirect root to default locale route (/hr) to avoid 404 on hosts
export default function Page() {
  // Using server-side redirect to ensure deployed hosts without middleware still reach the site
  redirect("/hr");
}
