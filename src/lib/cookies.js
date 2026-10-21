export const COOKIE_KEY = "cookie_consent";

export function hasTrackingConsent(value) {
  if (!value || value === "declined") return false;
  if (value === "accepted") return true;
  try {
    const parsed = JSON.parse(value);
    return Boolean(parsed?.statistics || parsed?.marketing || parsed?.preferences);
  } catch {
    return false;
  }
}
