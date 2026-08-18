"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Review } from "@/data/types";
import StarRating from "@/components/ui/StarRating";

interface ReviewPreviewProps {
  reviews: Review[];
}

export default function ReviewPreview({ reviews }: ReviewPreviewProps) {
  const t = useTranslations();
  const locale = useLocale() as "lt" | "en";

  if (reviews.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{t("detail.reviews")}</h2>
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div key={i} className="bg-muted-bg rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{review.author}</span>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <p className="text-sm text-muted">{review.text[locale]}</p>
            <p className="text-xs text-muted mt-2">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
