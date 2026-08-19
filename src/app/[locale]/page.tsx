"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { filterRestaurants, type RestaurantFilters } from "@/lib/restaurants";
import type { VibeTag } from "@/data/types";
import SearchBar from "@/components/restaurants/SearchBar";
import FilterPanel from "@/components/restaurants/FilterPanel";
import RestaurantGrid from "@/components/restaurants/RestaurantGrid";

interface Filters {
  city: string;
  neighborhood: string;
  cuisine: string;
  priceRange: string;
  vibeTags: VibeTag[];
}

const defaultFilters: Filters = {
  city: "",
  neighborhood: "",
  cuisine: "",
  priceRange: "",
  vibeTags: [],
};

export default function HomePage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const apiFilters: RestaurantFilters = {
    ...(search && { search }),
    ...(filters.city && { city: filters.city as RestaurantFilters["city"] }),
    ...(filters.neighborhood && {
      neighborhood:
        filters.neighborhood as RestaurantFilters["neighborhood"],
    }),
    ...(filters.cuisine && {
      cuisine: filters.cuisine as RestaurantFilters["cuisine"],
    }),
    ...(filters.priceRange && { priceRange: Number(filters.priceRange) }),
    ...(filters.vibeTags.length > 0 && { vibeTags: filters.vibeTags }),
  };

  const restaurants = filterRestaurants(apiFilters);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-dark to-primary text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
            {t("signup.comingSoon")} {t("signup.earlyAccess")}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            {t("common.appName")}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t("common.tagline")}
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar value={search} onChange={handleSearch} />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterPanel filters={filters} onFilterChange={setFilters} />
        <div className="mt-6">
          <RestaurantGrid restaurants={restaurants} />
        </div>
      </section>
    </div>
  );
}
