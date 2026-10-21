"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/components/ui/cn";

const DEFAULT_CENTER = { lat: 43.507881, lng: 16.503365 };
const PRIMARY = "#227cff";
const SURFACE = "#040b1e";

function markerHtml() {
  return `
    <div class="selekcija-map-pin" aria-hidden="true">
      <span class="selekcija-map-pin__glow"></span>
      <svg viewBox="0 0 40 48" width="36" height="44" fill="none">
        <path d="M20 46s14-14.2 14-26A14 14 0 1 0 6 20c0 11.8 14 26 14 26Z" fill="${PRIMARY}"/>
        <circle cx="20" cy="18" r="6.5" fill="${SURFACE}"/>
        <circle cx="20" cy="18" r="3.2" fill="#fff"/>
      </svg>
    </div>
  `;
}

/**
 * Dark high-contrast map that matches the navy / electric-blue site chrome.
 */
export function DarkMap({
  lat,
  lng,
  zoom = 15,
  className,
  label = "Selekcija.hr",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let map;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      const center = [lat ?? DEFAULT_CENTER.lat, lng ?? DEFAULT_CENTER.lng];

      map = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: false,
        attributionControl: true,
        zoomControl: true,
      });

      map.createPane("tintPane");
      map.getPane("tintPane").style.zIndex = 250;
      map.getPane("tintPane").style.pointerEvents = "none";
      map.getPane("tintPane").style.mixBlendMode = "color";

      map.createPane("shadePane");
      map.getPane("shadePane").style.zIndex = 260;
      map.getPane("shadePane").style.pointerEvents = "none";
      map.getPane("shadePane").style.mixBlendMode = "multiply";

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS",
          maxZoom: 16,
        },
      ).addTo(map);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "",
          maxZoom: 16,
          opacity: 0.9,
        },
      ).addTo(map);

      const world = [
        [-85, -180],
        [85, 180],
      ];

      L.rectangle(world, {
        pane: "tintPane",
        color: "transparent",
        weight: 0,
        fillColor: PRIMARY,
        fillOpacity: 0.32,
        interactive: false,
      }).addTo(map);

      L.rectangle(world, {
        pane: "shadePane",
        color: "transparent",
        weight: 0,
        fillColor: SURFACE,
        fillOpacity: 0.48,
        interactive: false,
      }).addTo(map);

      const icon = L.divIcon({
        className: "selekcija-map-marker",
        html: markerHtml(),
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -40],
      });

      L.circle(center, {
        radius: 220,
        color: PRIMARY,
        weight: 1.5,
        opacity: 0.7,
        fillColor: PRIMARY,
        fillOpacity: 0.14,
      }).addTo(map);

      const marker = L.marker(center, { icon })
        .addTo(map)
        .bindPopup(label, {
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
          offset: [0, -4],
        });

      requestAnimationFrame(() => {
        map.invalidateSize();
        marker.openPopup();
      });
    })();

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, [lat, lng, zoom, label]);

  return (
    <div className={cn("selekcija-dark-map relative h-full w-full", className)}>
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_42%,transparent_30%,rgba(4,11,30,0.78)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(34,124,255,0.25),inset_0_0_110px_rgba(4,11,30,0.95)]"
      />
    </div>
  );
}
