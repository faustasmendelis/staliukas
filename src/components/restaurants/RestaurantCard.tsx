"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import type { Restaurant } from "@/data/types";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const r = restaurant;

  const priceLabel = "€".repeat(r.priceRange);

  return (
    <Link
      href={`/${locale}/restaurants/${r.slug}`}
      className="group bg-card-bg rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={r.images[0]}
          alt={r.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {r.offPeakDiscount && (
          <div className="absolute top-3 left-3">
            <Badge variant="discount">
              -{r.offPeakDiscount.percentOff}% {r.offPeakDiscount.startTime}–
              {r.offPeakDiscount.endTime}
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="default">
            {t(`cuisines.${r.cuisine}`)}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {r.name}
          </h3>
          <span className="text-sm font-medium text-accent shrink-0">
            {priceLabel}
          </span>
        </div>

        <p className="text-sm text-muted mb-2">
          {t(`cities.${r.city}`)}
          {r.neighborhood && ` · ${t(`neighborhoods.${r.neighborhood}`)}`}
        </p>

        <div className="flex items-center justify-between">
          <StarRating rating={r.rating} />
          <span className="text-xs text-muted">
            {r.reviewCount} {r.reviewCount === 1 ? t("common.review") : t("common.reviews")}
          </span>
        </div>

        {r.vibeTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {r.vibeTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline">
                {t(`vibes.${tag}`)}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
