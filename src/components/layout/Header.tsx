"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-accent text-white text-center text-xs sm:text-sm py-1.5 font-medium">
        {t("demo.badge")} — {t("demo.banner")}
      </div>
      <div className="bg-card-bg/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-bold text-primary">
              {t("common.appName")}
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link
              href={`/${locale}`}
              className="text-muted hover:text-foreground transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              href={`/${locale}/map`}
              className="text-muted hover:text-foreground transition-colors"
            >
              📍 {t("map.nav")}
            </Link>
            <Link
              href={`/${locale}/restaurants/register`}
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              {t("nav.forRestaurants")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 text-foreground"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      </div>

      {mobileOpen && (
        <nav className="sm:hidden bg-card-bg border-b border-border px-4 py-3 flex flex-col gap-3 text-sm">
          <Link
            href={`/${locale}`}
            onClick={() => setMobileOpen(false)}
            className="text-muted hover:text-foreground transition-colors py-1"
          >
            {t("nav.home")}
          </Link>
          <Link
            href={`/${locale}/map`}
            onClick={() => setMobileOpen(false)}
            className="text-muted hover:text-foreground transition-colors py-1"
          >
            📍 {t("map.nav")}
          </Link>
          <Link
            href={`/${locale}/restaurants/register`}
            onClick={() => setMobileOpen(false)}
            className="text-accent hover:text-accent/80 font-medium transition-colors py-1"
          >
            {t("nav.forRestaurants")}
          </Link>
        </nav>
      )}
    </header>
  );
}
