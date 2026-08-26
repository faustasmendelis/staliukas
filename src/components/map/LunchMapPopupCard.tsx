"use client";

import Image from "next/image";
import type { Restaurant } from "@/data/types";
import type { LunchDeal } from "@/lib/hooks/useLunchDeals";
import StarRating from "@/components/ui/StarRating";

const CATEGORY_ICONS: Record<string, string> = {
  soup: "🍜",
  main: "🍽️",
  side: "🥗",
  dessert: "🍰",
  drink: "☕",
};

interface LunchMapPopupCardProps {
  restaurant: Restaurant;
  deal: LunchDeal;
  locale: string;
  distance: number | null;
  onClose: () => void;
}

export default function LunchMapPopupCard({
  restaurant,
  deal,
  locale,
  distance,
  onClose,
}: LunchMapPopupCardProps) {
  const r = restaurant;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${r.coordinates.lat},${r.coordinates.lng}`;
  const callUrl = `tel:${r.phone}`;

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:top-4 sm:bottom-auto sm:w-80 max-h-[calc(100%-32px)] overflow-y-auto bg-card-bg border border-border rounded-xl shadow-2xl z-[1000]">
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl">
        <Image
          src={r.images[0]}
          alt={r.name}
          fill
          className="object-cover"
          sizes="320px"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-sm hover:bg-black/70 transition-colors"
        >
          ×
        </button>
        {distance !== null && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {distance < 1
              ? `${Math.round(distance * 1000)} m`
              : `${distance.toFixed(1)} km`}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{r.name}</h3>
        </div>

        <p className="text-sm text-muted mt-0.5">{r.address}</p>

        <div className="mt-1.5 flex items-center gap-2">
          <StarRating rating={r.rating} />
          <span className="text-xs text-muted">({r.reviewCount})</span>
        </div>

        <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
              {deal.price}€
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-500 font-medium">
              {deal.hours ?? "11:00–15:00"}
            </span>
          </div>

          {deal.menu_items && deal.menu_items.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {deal.menu_items.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-sm">
                  <span className="shrink-0 text-xs mt-0.5">
                    {CATEGORY_ICONS[item.category] ?? "•"}
                  </span>
                  <span className="text-foreground">
                    {locale === "lt" ? item.name.lt : item.name.en}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm mt-1 text-foreground">{deal.description}</p>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {locale === "lt" ? "Maršrutas" : "Directions"}
          </a>
          <a
            href={callUrl}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted-bg transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {locale === "lt" ? "Skambinti" : "Call"}
          </a>
        </div>
      </div>
    </div>
  );
}
