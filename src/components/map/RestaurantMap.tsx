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
  vilnius: { lat: 54.6872, lng: 25.2797, zoom: 14 },
};

function createPinIcon(restaurant: Restaurant): L.DivIcon {
  const discount = restaurant.offPeakDiscount;
  const rating = restaurant.rating.toFixed(1);

  if (discount) {
    return L.divIcon({
      className: "staliukas-pin",
      html: `
        <div class="pin-card pin-has-discount">
          <span class="pin-rating">${rating}</span>
          <span class="pin-discount">-${discount.percentOff}%</span>
          <div class="pin-arrow"></div>
        </div>
      `,
      iconSize: [52, 52],
      iconAnchor: [26, 52],
    });
  }

  return L.divIcon({
    className: "staliukas-pin",
    html: `
      <div class="pin-card">
        <span class="pin-rating">${rating}</span>
        <div class="pin-arrow"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
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
    <div className="relative w-full rounded-xl overflow-hidden border border-border map-container">
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
  .map-container {
    height: calc(100vh - 200px);
    height: calc(100dvh - 160px);
    min-height: 300px;
  }

  @media (max-width: 639px) {
    .map-container {
      height: calc(100vh - 140px);
      height: calc(100dvh - 140px);
      min-height: 250px;
    }
  }

  .staliukas-pin {
    background: none !important;
    border: none !important;
  }

  .pin-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    border-radius: 6px;
    padding: 4px 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    min-width: 36px;
    text-align: center;
  }

  .pin-card:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  .pin-arrow {
    position: absolute;
    bottom: -6px;
    left: 50%;
    margin-left: -6px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid white;
  }

  .pin-rating {
    color: #1a1a1a;
    font-size: 14px;
    font-weight: 800;
    line-height: 1.2;
  }

  .pin-discount {
    color: #16a34a;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.1;
  }

  .pin-has-discount {
    border: 2px solid #16a34a;
  }

  .pin-has-discount .pin-arrow {
    border-top-color: #16a34a;
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
