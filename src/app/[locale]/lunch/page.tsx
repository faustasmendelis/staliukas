"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

const LunchDealMap = dynamic(
  () => import("@/components/map/LunchDealMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full bg-muted-bg animate-pulse flex items-center justify-center lunch-skeleton">
        <span className="text-muted text-sm">Loading map...</span>
      </div>
    ),
  }
);

const OFFICE_AREAS = [
  { id: "cyber-city", label: "Cyber City", lat: 54.6757, lng: 25.2838 },
  { id: "konstitucijos", label: "Konstitucijos pr.", lat: 54.6952, lng: 25.2711 },
  { id: "senamiestis", label: "Senamiestis", lat: 54.6825, lng: 25.2867 },
  { id: "naujamiestis", label: "Naujamiestis", lat: 54.6755, lng: 25.2729 },
  { id: "snipiskes", label: "Šnipiškės", lat: 54.6985, lng: 25.2745 },
  { id: "paupys", label: "Paupys", lat: 54.6720, lng: 25.2935 },
  { id: "saltiniskiu", label: "Šaltiniškės / BC", lat: 54.7025, lng: 25.2615 },
] as const;

const STORAGE_KEY = "staliukas_office";

export default function LunchPage() {
  const t = useTranslations();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const office = OFFICE_AREAS.find((o) => o.id === saved);
      if (office) {
        setSelectedOffice(office.id);
        setUserLocation({ lat: office.lat, lng: office.lng });
      }
    }
  }, []);

  const handleOfficeSelect = useCallback((officeId: string) => {
    const office = OFFICE_AREAS.find((o) => o.id === officeId);
    if (!office) return;
    setSelectedOffice(officeId);
    setUserLocation({ lat: office.lat, lng: office.lng });
    localStorage.setItem(STORAGE_KEY, officeId);
    setLocationError("");
  }, []);

  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError(t("map.locationDenied"));
      return;
    }

    setLocating(true);
    setLocationError("");
    setSelectedOffice(null);
    localStorage.removeItem(STORAGE_KEY);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
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
    <div className="flex flex-col h-[calc(100dvh-88px)] sm:h-[calc(100dvh-96px)]">
      {/* Header */}
      <div className="px-3 sm:px-6 pt-2 sm:pt-4 pb-2 sm:pb-3">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {t("lunch.title")}
            </h1>
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              {t("lunch.subtitle")}
            </p>
          </div>
        </div>

        {/* Office selector + near me */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          <button
            onClick={handleNearMe}
            disabled={locating}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors ${
              !selectedOffice && userLocation
                ? "bg-blue-500 text-white border-blue-500"
                : "border-border text-muted hover:border-primary/50"
            }`}
          >
            📍 {locating ? "..." : t("lunch.nearMe")}
          </button>

          <div className="w-px h-5 bg-border shrink-0" />

          {OFFICE_AREAS.map((office) => (
            <button
              key={office.id}
              onClick={() => handleOfficeSelect(office.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors ${
                selectedOffice === office.id
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted hover:border-primary/50"
              }`}
            >
              {office.label}
            </button>
          ))}
        </div>

        {locationError && (
          <p className="text-xs text-error mt-1">{locationError}</p>
        )}
      </div>

      {/* Map fills remaining space */}
      <div className="flex-1 min-h-0">
        <LunchDealMap userLocation={userLocation} />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
