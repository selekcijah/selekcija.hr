/**
 * Pulls a lat/lng pin out of a Google Maps embed URL when possible.
 */
export function parseMapEmbedCoords(url) {
  if (!url || typeof url !== "string") return null;
  const pin = url.match(/!3d(-?\d+(?:\.\d+)?)!2d(-?\d+(?:\.\d+)?)/);
  if (pin) return { lat: Number(pin[1]), lng: Number(pin[2]) };
  const center = url.match(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/);
  if (center) return { lat: Number(center[2]), lng: Number(center[1]) };
  return null;
}
