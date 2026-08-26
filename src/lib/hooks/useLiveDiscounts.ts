"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { LiveDiscount } from "@/lib/supabase/types";

function groupBySlug(discounts: LiveDiscount[]): Map<string, LiveDiscount[]> {
  const map = new Map<string, LiveDiscount[]>();
  for (const d of discounts) {
    const existing = map.get(d.restaurant_slug) ?? [];
    existing.push(d);
    map.set(d.restaurant_slug, existing);
  }
  return map;
}

export function useLiveDiscounts(): Map<string, LiveDiscount[]> {
  const [discounts, setDiscounts] = useState<Map<string, LiveDiscount[]>>(
    new Map()
  );

  useEffect(() => {
    let mounted = true;

    async function fetchDiscounts() {
      try {
        const res = await fetch("/api/discounts");
        if (!res.ok) return;
        const data: LiveDiscount[] = await res.json();
        if (mounted) {
          setDiscounts(groupBySlug(data));
        }
      } catch {
        // Supabase not configured yet — fail silently
      }
    }

    fetchDiscounts();

    const channel = supabase
      .channel("live_discounts_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_discounts" },
        () => {
          fetchDiscounts();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return discounts;
}
