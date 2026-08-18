"use client";

import { useTranslations } from "next-intl";
import type { Restaurant } from "@/data/types";
import RestaurantCard from "./RestaurantCard";

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export default function RestaurantGrid({ restaurants }: RestaurantGridProps) {
  const t = useTranslations();

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl mb-2">🍽️</p>
        <p className="text-lg font-medium text-foreground">
          {t("common.noResults")}
        </p>
        <p className="text-sm text-muted mt-1">{t("common.noResultsDesc")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </div>
  );
}
