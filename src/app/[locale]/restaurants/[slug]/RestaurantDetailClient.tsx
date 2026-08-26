"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import type { Restaurant, OffPeakDiscount } from "@/data/types";
import { useLiveDiscounts } from "@/lib/hooks/useLiveDiscounts";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import RestaurantGallery from "@/components/restaurants/RestaurantGallery";
import ReviewPreview from "@/components/restaurants/ReviewPreview";
import ReservationForm from "@/components/reservation/ReservationForm";
import NewsletterSignup from "@/components/reservation/NewsletterSignup";

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantDetailClient({ restaurant }: Props) {
  const t = useTranslations();
  const locale = useLocale() as "lt" | "en";
  const liveDiscounts = useLiveDiscounts();
  const liveForThis = liveDiscounts.get(restaurant.slug);

  const r = liveForThis && liveForThis.length > 0
    ? {
        ...restaurant,
        offPeakDiscount: {
          startTime: liveForThis[0].start_time,
          endTime: liveForThis[0].end_time,
          percentOff: liveForThis[0].percent_off,
          label: {
            lt: liveForThis[0].label_lt ?? `${liveForThis[0].percent_off}% nuolaida`,
            en: liveForThis[0].label_en ?? `${liveForThis[0].percent_off}% off`,
          },
        } satisfies OffPeakDiscount,
      }
    : restaurant;

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link
        href={`/${locale}`}
        className="text-sm text-primary hover:text-primary-light transition-colors mb-4 inline-block"
      >
        ← {t("common.backToList")}
      </Link>

      <RestaurantGallery images={r.images} name={r.name} />

      <div className="mt-6 lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">{r.name}</h1>
              <Badge>{t(`cuisines.${r.cuisine}`)}</Badge>
              <span className="text-accent font-medium">
                {"€".repeat(r.priceRange)}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={r.rating} size="md" />
              <span className="text-sm text-muted">
                ({r.reviewCount} {t("common.reviews")})
              </span>
            </div>

            {r.vibeTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {r.vibeTags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {t(`vibes.${tag}`)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {r.offPeakDiscount && (
            <div className="bg-discount-bg border border-accent/20 rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">🏷️</span>
              <p className="font-medium text-discount-text">
                {t("detail.offPeakBanner", {
                  startTime: r.offPeakDiscount.startTime,
                  endTime: r.offPeakDiscount.endTime,
                  percentOff: r.offPeakDiscount.percentOff,
                })}
              </p>
            </div>
          )}

          <p className="text-muted leading-relaxed">{r.description[locale]}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted-bg rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-1">
                {t("detail.address")}
              </h3>
              <p className="text-sm text-muted">{r.address}</p>
              <a
                href={`https://www.google.com/maps?q=${r.coordinates.lat},${r.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-1 inline-block"
              >
                {t("detail.viewOnMap")} →
              </a>
            </div>
            <div className="bg-muted-bg rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-1">
                {t("detail.phone")}
              </h3>
              <p className="text-sm text-muted">{r.phone}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">
              {t("detail.menuHighlights")}
            </h2>
            <ul className="space-y-2">
              {r.menuHighlights.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <span className="text-accent">•</span>
                  {item[locale]}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">
              {t("detail.openingHours")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {days.map((day) => (
                <div
                  key={day}
                  className="flex justify-between text-sm py-1 px-2 rounded hover:bg-muted-bg"
                >
                  <span>{t(`days.${day}`)}</span>
                  <span className="text-muted">
                    {r.openingHours[day] || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ReviewPreview reviews={r.reviews} />
        </div>

        <div className="mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-card-bg border border-border rounded-xl p-6">
              <ReservationForm restaurant={r} />
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </div>
    </div>
  );
}
