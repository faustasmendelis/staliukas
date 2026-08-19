"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import type { Restaurant } from "@/data/types";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";

interface MapPopupCardProps {
  restaurant: Restaurant;
  locale: string;
  distance: number | null;
  onClose: () => void;
}

export default function MapPopupCard({
  restaurant,
  locale,
  distance,
  onClose,
}: MapPopupCardProps) {
  const t = useTranslations();
  const r = restaurant;
  const loc = locale as "lt" | "en";

  return (
    <div className="absolute top-4 right-4 w-80 max-h-[calc(100%-32px)] overflow-y-auto bg-card-bg border border-border rounded-xl shadow-2xl z-[1000]">
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
            📍 {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{r.name}</h3>
          <span className="text-accent font-medium text-sm shrink-0">
            {"€".repeat(r.priceRange)}
          </span>
        </div>

        <p className="text-sm text-muted mt-0.5">
          {t(`cuisines.${r.cuisine}`)}
          {r.neighborhood && ` · ${t(`neighborhoods.${r.neighborhood}`)}`}
          {!r.neighborhood && ` · ${t(`cities.${r.city}`)}`}
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <StarRating rating={r.rating} />
          <span className="text-xs text-muted">
            ({r.reviewCount})
          </span>
        </div>

        {r.offPeakDiscount && (
          <div className="mt-3 bg-discount-bg rounded-lg p-2.5 flex items-center gap-2">
            <span className="text-lg">🏷️</span>
            <div>
              <p className="text-xs font-bold text-discount-text">
                -{r.offPeakDiscount.percentOff}%{" "}
                {r.offPeakDiscount.startTime}–{r.offPeakDiscount.endTime}
              </p>
              <p className="text-[11px] text-discount-text/80">
                {r.offPeakDiscount.label[loc]}
              </p>
            </div>
          </div>
        )}

        {r.vibeTags.length > 0 && (
          <div className="flex items-center gap-1 mt-3 flex-wrap">
            {r.vibeTags.map((tag) => (
              <Badge key={tag} variant="outline">
                {t(`vibes.${tag}`)}
              </Badge>
            ))}
          </div>
        )}

        <Link
          href={`/${locale}/restaurants/${r.slug}`}
          className="mt-4 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          {t("common.bookTable")}
        </Link>
      </div>
    </div>
  );
}
