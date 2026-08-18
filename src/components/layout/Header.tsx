"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();

  return (
    <header className="sticky top-0 z-50 bg-card-bg/95 backdrop-blur border-b border-border">
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
          </nav>

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
