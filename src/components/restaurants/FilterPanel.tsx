"use client";

import { useTranslations } from "next-intl";
import type {
  City,
  CuisineType,
  Neighborhood,
  VibeTag,
} from "@/data/types";
import Badge from "@/components/ui/Badge";

interface Filters {
  city: string;
  neighborhood: string;
  cuisine: string;
  priceRange: string;
  vibeTags: VibeTag[];
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const CUISINES: CuisineType[] = [
  "lithuanian",
  "italian",
  "japanese",
  "french",
  "georgian",
  "mexican",
  "seafood",
  "steakhouse",
  "vegetarian",
  "international",
];

const CITIES: City[] = ["vilnius", "kaunas", "klaipeda"];

const NEIGHBORHOODS: Neighborhood[] = [
  "senamiestis",
  "naujamiestis",
  "uzupis",
  "snpiskes",
  "paupys",
];

const VIBE_TAGS: VibeTag[] = [
  "terrace",
  "business-lunch",
  "pet-friendly",
  "natural-wine",
  "late-night-kitchen",
];

export default function FilterPanel({
  filters,
  onFilterChange,
}: FilterPanelProps) {
  const t = useTranslations();

  const update = (partial: Partial<Filters>) => {
    const next = { ...filters, ...partial };
    if (partial.city !== undefined && partial.city !== "vilnius") {
      next.neighborhood = "";
    }
    onFilterChange(next);
  };

  const toggleVibe = (tag: VibeTag) => {
    const next = filters.vibeTags.includes(tag)
      ? filters.vibeTags.filter((t) => t !== tag)
      : [...filters.vibeTags, tag];
    update({ vibeTags: next });
  };

  const hasFilters =
    filters.city ||
    filters.neighborhood ||
    filters.cuisine ||
    filters.priceRange ||
    filters.vibeTags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.cuisine}
          onChange={(e) => update({ cuisine: e.target.value })}
          className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">{t("filters.allCuisines")}</option>
          {CUISINES.map((c) => (
            <option key={c} value={c}>
              {t(`cuisines.${c}`)}
            </option>
          ))}
        </select>

        <select
          value={filters.neighborhood}
          onChange={(e) => update({ neighborhood: e.target.value })}
          className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">{t("filters.allNeighborhoods")}</option>
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {t(`neighborhoods.${n}`)}
            </option>
          ))}
        </select>

        <select
          value={filters.priceRange}
          onChange={(e) => update({ priceRange: e.target.value })}
          className="px-3 py-2 rounded-lg border border-border bg-card-bg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">{t("filters.anyPrice")}</option>
          <option value="1">€</option>
          <option value="2">€€</option>
          <option value="3">€€€</option>
        </select>

        {hasFilters && (
          <button
            onClick={() =>
              onFilterChange({
                city: "",
                neighborhood: "",
                cuisine: "",
                priceRange: "",
                vibeTags: [],
              })
            }
            className="px-3 py-2 text-sm text-error hover:text-error/80 transition-colors"
          >
            {t("filters.clearAll")}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {VIBE_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleVibe(tag)}
            className="transition-all"
          >
            <Badge
              variant={filters.vibeTags.includes(tag) ? "default" : "outline"}
            >
              {t(`vibes.${tag}`)}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
