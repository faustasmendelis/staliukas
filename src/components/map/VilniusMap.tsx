"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import type { Restaurant } from "@/data/types";
import { getAllRestaurants } from "@/lib/restaurants";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";

interface MapPin {
  restaurant: Restaurant;
  x: number;
  y: number;
}

const VILNIUS_PINS: MapPin[] = (() => {
  const all = getAllRestaurants().filter((r) => r.city === "vilnius");
  const positions: Record<string, { x: number; y: number }> = {
    "senoji-trobele": { x: 52, y: 48 },
    "ertlio-namas": { x: 48, y: 44 },
    "gaspars": { x: 38, y: 42 },
    "sakura-vilnius": { x: 58, y: 62 },
    "mamma-mia-vilnius": { x: 62, y: 52 },
    "zalia-varlyte": { x: 32, y: 28 },
  };
  return all.map((r) => ({
    restaurant: r,
    x: positions[r.slug]?.x ?? 50,
    y: positions[r.slug]?.y ?? 50,
  }));
})();

const NEIGHBORHOODS = [
  { id: "senamiestis", path: "M 42 38 L 58 36 L 60 52 L 54 56 L 42 54 Z", labelX: 50, labelY: 46 },
  { id: "naujamiestis", path: "M 28 34 L 42 38 L 42 54 L 30 52 L 26 42 Z", labelX: 34, labelY: 44 },
  { id: "uzupis", path: "M 58 36 L 72 38 L 70 56 L 60 52 Z", labelX: 64, labelY: 46 },
  { id: "snpiskes", path: "M 24 18 L 42 16 L 42 38 L 28 34 L 24 26 Z", labelX: 33, labelY: 28 },
  { id: "paupys", path: "M 54 56 L 60 52 L 70 56 L 68 68 L 54 66 Z", labelX: 62, labelY: 62 },
];

const STREETS = [
  "M 20 40 Q 40 38 60 42 Q 75 44 85 40",
  "M 50 15 Q 48 30 50 50 Q 52 65 50 80",
  "M 30 20 Q 45 35 55 55 Q 60 65 65 75",
  "M 25 55 Q 40 50 55 48 Q 65 46 78 50",
  "M 35 25 Q 50 28 65 30",
];

const RIVER = "M 15 60 Q 30 55 45 58 Q 55 60 60 55 Q 68 48 75 42 Q 80 38 88 35";

export default function VilniusMap() {
  const t = useTranslations();
  const locale = useLocale();
  const [activePin, setActivePin] = useState<MapPin | null>(null);

  return (
    <div className="relative">
      <div className="bg-card-bg border border-border rounded-xl overflow-hidden">
        <svg
          viewBox="0 0 100 85"
          className="w-full h-auto"
          style={{ minHeight: "400px" }}
        >
          <rect x="0" y="0" width="100" height="85" className="fill-muted-bg" />

          <path
            d={RIVER}
            fill="none"
            stroke="var(--primary-light)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d={RIVER}
            fill="none"
            stroke="var(--primary-light)"
            strokeWidth="0.6"
            strokeLinecap="round"
            opacity="0.5"
            strokeDasharray="0.5 0.8"
          />

          {NEIGHBORHOODS.map((n) => (
            <g key={n.id}>
              <path
                d={n.path}
                fill="var(--primary)"
                opacity="0.08"
                stroke="var(--primary)"
                strokeWidth="0.3"
                strokeOpacity="0.3"
              />
              <text
                x={n.labelX}
                y={n.labelY}
                textAnchor="middle"
                fontSize="2"
                fill="var(--muted)"
                opacity="0.6"
                fontWeight="500"
              >
                {t(`neighborhoods.${n.id}`)}
              </text>
            </g>
          ))}

          {STREETS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="var(--border)"
              strokeWidth="0.3"
              strokeLinecap="round"
              opacity="0.5"
            />
          ))}

          {VILNIUS_PINS.map((pin) => {
            const hasDiscount = !!pin.restaurant.offPeakDiscount;
            const isActive = activePin?.restaurant.id === pin.restaurant.id;

            return (
              <g
                key={pin.restaurant.id}
                className="cursor-pointer"
                onClick={() => setActivePin(isActive ? null : pin)}
              >
                {hasDiscount && !isActive && (
                  <>
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r="2.5"
                      fill="var(--accent)"
                      opacity="0.2"
                    >
                      <animate
                        attributeName="r"
                        values="2.5;4;2.5"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.2;0.05;0.2"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}

                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={isActive ? "2.2" : "1.8"}
                  fill={hasDiscount ? "var(--accent)" : "var(--primary)"}
                  stroke="var(--card-bg)"
                  strokeWidth="0.5"
                  className="transition-all duration-200"
                />

                <text
                  x={pin.x}
                  y={pin.y + 0.5}
                  textAnchor="middle"
                  fontSize="1.6"
                  fill="white"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  🍽
                </text>

                {hasDiscount && !isActive && (
                  <g>
                    <rect
                      x={pin.x + 2}
                      y={pin.y - 3}
                      width="8"
                      height="3"
                      rx="0.8"
                      fill="var(--discount-bg)"
                      stroke="var(--accent)"
                      strokeWidth="0.2"
                    />
                    <text
                      x={pin.x + 6}
                      y={pin.y - 1}
                      textAnchor="middle"
                      fontSize="1.5"
                      fill="var(--discount-text)"
                      fontWeight="bold"
                    >
                      -{pin.restaurant.offPeakDiscount!.percentOff}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-4 left-4 flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 bg-card-bg/90 backdrop-blur rounded-full px-2.5 py-1 border border-border">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
            {t("map.restaurant")}
          </span>
          <span className="flex items-center gap-1.5 bg-card-bg/90 backdrop-blur rounded-full px-2.5 py-1 border border-border">
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
            {t("map.withDiscount")}
          </span>
        </div>
      </div>

      {activePin && (
        <MapPopup
          pin={activePin}
          locale={locale}
          onClose={() => setActivePin(null)}
        />
      )}
    </div>
  );
}

function MapPopup({
  pin,
  locale,
  onClose,
}: {
  pin: MapPin;
  locale: string;
  onClose: () => void;
}) {
  const t = useTranslations();
  const r = pin.restaurant;
  const loc = locale as "lt" | "en";

  return (
    <div className="absolute top-4 right-4 w-80 bg-card-bg border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg">{r.name}</h3>
            <p className="text-sm text-muted">
              {t(`cuisines.${r.cuisine}`)} · {t(`neighborhoods.${r.neighborhood}`)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-lg leading-none p-1"
          >
            ×
          </button>
        </div>

        <div className="mt-2">
          <StarRating rating={r.rating} />
          <span className="text-xs text-muted ml-2">
            ({r.reviewCount} {t("common.reviews")})
          </span>
        </div>

        <p className="text-sm text-muted mt-2 line-clamp-2">
          {r.description[loc]}
        </p>

        {r.offPeakDiscount && (
          <div className="mt-3 bg-discount-bg rounded-lg p-2.5 flex items-center gap-2">
            <span className="text-lg">🏷️</span>
            <div>
              <p className="text-xs font-semibold text-discount-text">
                -{r.offPeakDiscount.percentOff}%{" "}
                {r.offPeakDiscount.startTime}–{r.offPeakDiscount.endTime}
              </p>
              <p className="text-xs text-discount-text/80">
                {r.offPeakDiscount.label[loc]}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {r.vibeTags.map((tag) => (
            <Badge key={tag} variant="outline">
              {t(`vibes.${tag}`)}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/${locale}/restaurants/${r.slug}`}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            {t("common.bookTable")}
          </Link>
        </div>
      </div>
    </div>
  );
}
