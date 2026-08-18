"use client";

import { useTranslations } from "next-intl";
import VilniusMap from "@/components/map/VilniusMap";

export default function MapPage() {
  const t = useTranslations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        {t("map.title")}
      </h1>
      <p className="text-muted mb-6">{t("map.subtitle")}</p>
      <VilniusMap />
    </div>
  );
}
