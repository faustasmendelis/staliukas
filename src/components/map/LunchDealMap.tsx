"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useLocale } from "next-intl";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Restaurant } from "@/data/types";
import { getAllRestaurants } from "@/lib/restaurants";
import { getDistanceKm } from "@/lib/geo";
import { useLunchDeals, type LunchDeal } from "@/lib/hooks/useLunchDeals";
import LunchMapPopupCard from "./LunchMapPopupCard";

const VILNIUS_CENTER = { lat: 54.6872, lng: 25.2797, zoom: 14 };
const NEARBY_RADIUS_KM = 0.8;

function createLunchPinIcon(price: number, isNearby: boolean): L.DivIcon {
  return L.divIcon({
    className: "staliukas-pin",
    html: `
      <div class="pin-card pin-lunch ${isNearby ? "" : "pin-lunch-far"}">
        <span class="pin-lunch-price">${price}€</span>
        <div class="pin-arrow pin-arrow-lunch ${isNearby ? "" : "pin-arrow-far"}"></div>
      </div>
    `,
    iconSize: [52, 40],
    iconAnchor: [26, 40],
  });
}

function createUserIcon(): L.DivIcon {
  return L.divIcon({
    className: "staliukas-pin",
    html: `<div class="user-dot"><div class="user-dot-pulse"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function FlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const lat = center[0];
  const lng = center[1];
  const initial = useRef(true);
  useEffect(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    try {
      map.invalidateSize();
      if (initial.current) {
        initial.current = false;
        map.setView([lat, lng], zoom);
      } else {
        map.flyTo([lat, lng], zoom, { duration: 1.2 });
      }
    } catch {
      // Leaflet may throw if container has no size yet
    }
  }, [map, lat, lng, zoom]);
  return null;
}

interface LunchDealMapProps {
  userLocation: { lat: number; lng: number } | null;
}

export default function LunchDealMap({ userLocation }: LunchDealMapProps) {
  const locale = useLocale();
  const lunchDeals = useLunchDeals(locale);
  const [selected, setSelected] = useState<{
    restaurant: Restaurant;
    deal: LunchDeal;
  } | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const allRestaurants = useMemo(() => getAllRestaurants(), []);

  const restaurantsWithDeals = useMemo(() => {
    const withDeals = allRestaurants
      .filter((r) => lunchDeals.has(r.slug))
      .map((r) => {
        const dist = userLocation
          ? getDistanceKm(
              userLocation.lat,
              userLocation.lng,
              r.coordinates.lat,
              r.coordinates.lng
            )
          : null;
        return { restaurant: r, distance: dist };
      });

    withDeals.sort((a, b) => (a.distance ?? 99) - (b.distance ?? 99));
    return withDeals;
  }, [allRestaurants, lunchDeals, userLocation]);

  const flyTarget: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [VILNIUS_CENTER.lat, VILNIUS_CENTER.lng];

  const distance = useMemo(() => {
    if (!userLocation || !selected) return null;
    return getDistanceKm(
      userLocation.lat,
      userLocation.lng,
      selected.restaurant.coordinates.lat,
      selected.restaurant.coordinates.lng
    );
  }, [userLocation, selected]);

  return (
    <div className="relative w-full h-full">
      <style>{lunchMapStyles}</style>

      <MapContainer
        center={[VILNIUS_CENTER.lat, VILNIUS_CENTER.lng]}
        zoom={VILNIUS_CENTER.zoom}
        className="w-full h-full z-0"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyTo
          center={flyTarget}
          zoom={userLocation ? 15 : VILNIUS_CENTER.zoom}
        />

        {userLocation && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={NEARBY_RADIUS_KM * 1000}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.06,
              weight: 1.5,
              dashArray: "6 4",
            }}
          />
        )}

        {restaurantsWithDeals.map(({ restaurant: r, distance: dist }) => {
          const deal = lunchDeals.get(r.slug)!;
          const isNearby = dist !== null && dist <= NEARBY_RADIUS_KM;
          return (
            <Marker
              key={r.id}
              position={[r.coordinates.lat, r.coordinates.lng]}
              icon={createLunchPinIcon(deal.price, isNearby || !userLocation)}
              eventHandlers={{
                click: () =>
                  setSelected(
                    selected?.restaurant.id === r.id
                      ? null
                      : { restaurant: r, deal }
                  ),
              }}
            />
          );
        })}

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon()}
          />
        )}
      </MapContainer>

      {restaurantsWithDeals.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-[500] pointer-events-none">
          <div className="bg-card-bg border border-border rounded-xl px-6 py-4 text-center shadow-lg">
            <p className="text-lg font-semibold">No lunch deals yet today</p>
            <p className="text-sm text-muted mt-1">
              Restaurants post their deals in the morning
            </p>
          </div>
        </div>
      )}

      {/* Bottom deal list on mobile */}
      {restaurantsWithDeals.length > 0 && !selected && userLocation && (
        <div className="absolute bottom-0 left-0 right-0 z-[500] sm:hidden">
          <div className="bg-card-bg/95 backdrop-blur border-t border-border px-3 py-2 max-h-44 overflow-y-auto">
            {restaurantsWithDeals
              .filter(({ distance: d }) => d !== null && d <= NEARBY_RADIUS_KM)
              .slice(0, 8)
              .map(({ restaurant: r, distance: d }) => {
                const deal = lunchDeals.get(r.slug)!;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelected({ restaurant: r, deal })}
                    className="w-full flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <p className="text-xs text-muted truncate">
                        {deal.description}
                      </p>
                    </div>
                    <div className="shrink-0 ml-3 text-right">
                      <p className="text-sm font-bold text-amber-600">
                        {deal.price}€
                      </p>
                      {d !== null && (
                        <p className="text-[10px] text-muted">
                          {d < 1
                            ? `${Math.round(d * 1000)}m`
                            : `${d.toFixed(1)}km`}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Desktop side list */}
      {restaurantsWithDeals.length > 0 && !selected && userLocation && (
        <div className="absolute top-4 left-4 z-[500] hidden sm:block w-72 max-h-[calc(100%-32px)] overflow-y-auto bg-card-bg/95 backdrop-blur border border-border rounded-xl shadow-lg">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-semibold">
              {restaurantsWithDeals.filter(({ distance: d }) => d !== null && d <= NEARBY_RADIUS_KM).length} {locale === "lt" ? "pietų pasiūlymai netoliese" : "lunch deals nearby"}
            </p>
          </div>
          <div className="divide-y divide-border/50">
            {restaurantsWithDeals
              .filter(({ distance: d }) => d !== null && d <= NEARBY_RADIUS_KM)
              .map(({ restaurant: r, distance: d }) => {
                const deal = lunchDeals.get(r.slug)!;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelected({ restaurant: r, deal });
                      mapRef.current?.flyTo([r.coordinates.lat, r.coordinates.lng], 16, { duration: 0.8 });
                    }}
                    className="w-full p-3 text-left hover:bg-muted-bg/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{r.name}</p>
                      <span className="shrink-0 text-sm font-bold text-amber-600">{deal.price}€</span>
                    </div>
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">{deal.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted">{deal.hours ?? "11:00–15:00"}</span>
                      {d !== null && (
                        <span className="text-[10px] text-muted">
                          · {d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {selected && (
        <LunchMapPopupCard
          restaurant={selected.restaurant}
          deal={selected.deal}
          locale={locale}
          distance={distance}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

const lunchMapStyles = `
  .staliukas-pin {
    background: none !important;
    border: none !important;
  }

  .pin-lunch {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f59e0b;
    border-radius: 6px;
    padding: 4px 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    min-width: 40px;
    text-align: center;
  }

  .pin-lunch:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
  }

  .pin-lunch-far {
    background: #d4d4d4;
    opacity: 0.7;
  }

  .pin-lunch-price {
    color: white;
    font-size: 14px;
    font-weight: 800;
    line-height: 1.2;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }

  .pin-arrow-lunch {
    position: absolute;
    bottom: -6px;
    left: 50%;
    margin-left: -6px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #f59e0b;
  }

  .pin-arrow-far {
    border-top-color: #d4d4d4;
  }

  .user-dot {
    position: relative;
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }

  .user-dot-pulse {
    position: absolute;
    top: -6px;
    left: -6px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.2);
    animation: user-pulse 2s ease-out infinite;
  }

  @keyframes user-pulse {
    0% { transform: scale(1); opacity: 0.4; }
    100% { transform: scale(2); opacity: 0; }
  }

  .leaflet-container {
    font-family: inherit;
  }
`;
