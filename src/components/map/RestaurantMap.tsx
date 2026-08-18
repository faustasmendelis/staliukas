"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Restaurant } from "@/data/types";
import { getAllRestaurants } from "@/lib/restaurants";
import { getDistanceKm } from "@/lib/geo";
import MapPopupCard from "./MapPopupCard";

const CITY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  vilnius: { lat: 54.6872, lng: 25.2797, zoom: 13 },
  kaunas: { lat: 54.8985, lng: 23.9036, zoom: 13 },
  klaipeda: { lat: 55.7108, lng: 21.1350, zoom: 14 },
};

function createPinIcon(restaurant: Restaurant): L.DivIcon {
  const discount = restaurant.offPeakDiscount;
  const rating = restaurant.rating.toFixed(1);

  if (discount) {
    return L.divIcon({
      className: "staliukas-pin",
      html: `
        <div class="pin-container pin-discount">
          <div class="pin-pulse"></div>
          <div class="pin-body">
            <span class="pin-rating">${rating}</span>
          </div>
          <div class="pin-badge">-${discount.percentOff}%</div>
        </div>
      `,
      iconSize: [48, 56],
      iconAnchor: [24, 56],
    });
  }

  return L.divIcon({
    className: "staliukas-pin",
    html: `
      <div class="pin-container">
        <div class="pin-body pin-regular">
          <span class="pin-rating">${rating}</span>
        </div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
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

function FlyToCity({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [map, center, zoom]);
  return null;
}

interface RestaurantMapProps {
  activeCity: string;
  showDealsOnly: boolean;
  userLocation: { lat: number; lng: number } | null;
}

export default function RestaurantMap({
  activeCity,
  showDealsOnly,
  userLocation,
}: RestaurantMapProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const allRestaurants = useMemo(() => getAllRestaurants(), []);

  const restaurants = useMemo(() => {
    let filtered = allRestaurants;
    if (activeCity) {
      filtered = filtered.filter((r) => r.city === activeCity);
    }
    if (showDealsOnly) {
      filtered = filtered.filter((r) => r.offPeakDiscount);
    }
    return filtered;
  }, [allRestaurants, activeCity, showDealsOnly]);

  const cityCenter = CITY_CENTERS[activeCity] || CITY_CENTERS.vilnius;
  const flyTarget: [number, number] = [cityCenter.lat, cityCenter.lng];

  const distance = useMemo(() => {
    if (!userLocation || !selected) return null;
    return getDistanceKm(
      userLocation.lat,
      userLocation.lng,
      selected.coordinates.lat,
      selected.coordinates.lng
    );
  }, [userLocation, selected]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border" style={{ height: "calc(100vh - 200px)", minHeight: "400px" }}>
      <style>{mapStyles}</style>

      <MapContainer
        center={flyTarget}
        zoom={cityCenter.zoom}
        className="w-full h-full z-0"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToCity center={flyTarget} zoom={cityCenter.zoom} />

        {restaurants.map((r) => (
          <Marker
            key={r.id}
            position={[r.coordinates.lat, r.coordinates.lng]}
            icon={createPinIcon(r)}
            eventHandlers={{
              click: () => setSelected(selected?.id === r.id ? null : r),
            }}
          />
        ))}

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon()}
          />
        )}
      </MapContainer>

      {selected && (
        <MapPopupCard
          restaurant={selected}
          locale={locale}
          distance={distance}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

const mapStyles = `
  .staliukas-pin {
    background: none !important;
    border: none !important;
  }

  .pin-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pin-body {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: transform 0.15s;
  }

  .pin-body:hover {
    transform: rotate(-45deg) scale(1.15);
  }

  .pin-regular {
    background: #065f46;
  }

  .pin-discount .pin-body {
    background: #d97706;
  }

  .pin-rating {
    transform: rotate(45deg);
    color: white;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
  }

  .pin-badge {
    position: absolute;
    top: -8px;
    right: -12px;
    background: #fef3c7;
    color: #92400e;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 8px;
    border: 1.5px solid #d97706;
    white-space: nowrap;
    z-index: 10;
  }

  .pin-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 36px;
    height: 36px;
    margin-top: -18px;
    margin-left: -18px;
    border-radius: 50%;
    background: rgba(217, 119, 6, 0.25);
    animation: pin-pulse-anim 2s ease-out infinite;
  }

  @keyframes pin-pulse-anim {
    0% { transform: scale(1); opacity: 0.4; }
    100% { transform: scale(2.2); opacity: 0; }
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
