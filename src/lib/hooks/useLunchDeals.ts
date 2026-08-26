"use client";

import { useState, useEffect } from "react";
import { STATIC_LUNCH_DEALS, type StaticLunchDeal } from "@/data/lunch-deals";

export interface LunchDeal {
  restaurant_slug: string;
  price: number;
  description: string;
  menu_items?: { category: string; name: { lt: string; en: string } }[];
  hours?: string;
}

function staticToLunchDeal(s: StaticLunchDeal, locale: string): LunchDeal {
  return {
    restaurant_slug: s.restaurant_slug,
    price: s.price,
    description: locale === "lt" ? s.description.lt : s.description.en,
    menu_items: s.menu_items,
    hours: s.hours,
  };
}

export function useLunchDeals(locale: string = "en"): Map<string, LunchDeal> {
  const [deals, setDeals] = useState<Map<string, LunchDeal>>(() => {
    const map = new Map<string, LunchDeal>();
    for (const d of STATIC_LUNCH_DEALS) {
      map.set(d.restaurant_slug, staticToLunchDeal(d, locale));
    }
    return map;
  });

  useEffect(() => {
    let mounted = true;

    async function fetchDeals() {
      try {
        const res = await fetch("/api/lunch-deals");
        if (!res.ok) return;
        const data: LunchDeal[] = await res.json();
        if (!mounted || data.length === 0) return;
        setDeals((prev) => {
          const map = new Map(prev);
          for (const d of data) {
            if (!map.has(d.restaurant_slug)) {
              map.set(d.restaurant_slug, d);
            }
          }
          return map;
        });
      } catch {
        // Supabase not available — static data is fine
      }
    }

    fetchDeals();

    return () => {
      mounted = false;
    };
  }, [locale]);

  return deals;
}
