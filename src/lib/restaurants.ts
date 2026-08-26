import type { Restaurant, City, CuisineType, Neighborhood, VibeTag, OffPeakDiscount } from "@/data/types";
import type { LiveDiscount } from "@/lib/supabase/types";
import restaurantsData from "@/data/restaurants.json";

const restaurants: Restaurant[] = restaurantsData as Restaurant[];

export function getAllRestaurants(): Restaurant[] {
  return restaurants;
}

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return restaurants.find((r) => r.slug === slug);
}

export interface RestaurantFilters {
  search?: string;
  city?: City;
  neighborhood?: Neighborhood;
  cuisine?: CuisineType;
  priceRange?: number;
  vibeTags?: VibeTag[];
}

export function mergeWithLiveDiscounts(
  restaurants: Restaurant[],
  liveDiscounts: Map<string, LiveDiscount[]>
): Restaurant[] {
  if (liveDiscounts.size === 0) return restaurants;

  return restaurants.map((r) => {
    const live = liveDiscounts.get(r.slug);
    if (!live || live.length === 0) return r;

    const newest = live[0];
    const discount: OffPeakDiscount = {
      startTime: newest.start_time,
      endTime: newest.end_time,
      percentOff: newest.percent_off,
      label: {
        lt: newest.label_lt ?? `${newest.percent_off}% nuolaida`,
        en: newest.label_en ?? `${newest.percent_off}% off`,
      },
    };

    return { ...r, offPeakDiscount: discount, _isLiveDiscount: true } as Restaurant & { _isLiveDiscount: boolean };
  });
}

export function filterRestaurants(filters: RestaurantFilters): Restaurant[] {
  return restaurants.filter((r) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!r.name.toLowerCase().includes(q)) return false;
    }
    if (filters.city && r.city !== filters.city) return false;
    if (filters.neighborhood && r.neighborhood !== filters.neighborhood)
      return false;
    if (filters.cuisine && r.cuisine !== filters.cuisine) return false;
    if (filters.priceRange && r.priceRange !== filters.priceRange) return false;
    if (filters.vibeTags && filters.vibeTags.length > 0) {
      if (!filters.vibeTags.every((tag) => r.vibeTags.includes(tag)))
        return false;
    }
    return true;
  });
}
