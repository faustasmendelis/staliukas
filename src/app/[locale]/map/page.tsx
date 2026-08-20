"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";

const RestaurantMap = dynamic(
  () => import("@/components/map/RestaurantMap"),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div className="w-full rounded-xl bg-muted-bg border border-border animate-pulse flex items-center justify-center map-skeleton">
      <style>{`
        .map-skeleton {
          height: calc(100vh - 200px);
          height: calc(100dvh - 160px);
          min-height: 300px;
        }
        @media (max-width: 639px) {
          .map-skeleton {
            height: calc(100vh - 140px);
            height: calc(100dvh - 140px);
            min-height: 250px;
          }
        }
      `}</style>
      <span className="text-muted text-sm">Loading map...</span>
    </div>
  );
}

const CITIES = [
  { id: "vilnius", labelKey: "vilnius" as const },
];

export default function MapPage() {
  const t = useTranslations();
  const [activeCity, setActiveCity] = useState("vilnius");
  const [showDealsOnly, setShowDealsOnly] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError(t("map.locationDenied"));
      return;
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setActiveCity("");
        setLocating(false);
      },
      () => {
        setLocationError(t("map.locationDenied"));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [t]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-6">
      <div className="hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {t("map.title")}
          </h1>
          <p className="text-muted text-sm mt-1">{t("map.subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
        {CITIES.map((city) => (
          <Button
            key={city.id}
            variant={activeCity === city.id ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveCity(city.id)}
          >
            {city.id ? t(`cities.${city.id}`) : t(`map.${city.labelKey}`)}
          </Button>
        ))}

        <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

        <Button
          variant={showDealsOnly ? "primary" : "outline"}
          size="sm"
          onClick={() => setShowDealsOnly(!showDealsOnly)}
        >
          🏷️ {t("map.showDeals")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNearMe}
          disabled={locating}
        >
          📍 {locating ? "..." : t("map.nearMe")}
        </Button>
      </div>

      {locationError && (
        <p className="text-sm text-error mb-3">{locationError}</p>
      )}

      <RestaurantMap
        activeCity={activeCity}
        showDealsOnly={showDealsOnly}
        userLocation={userLocation}
      />
    </div>
  );
}
