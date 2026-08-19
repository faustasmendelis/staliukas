"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();

  return (
    <footer className="bg-card-bg border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍽️</span>
            <span className="font-bold text-primary">
              {t("common.appName")}
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted">
            <Link href={`/${locale}/restaurants/register`} className="hover:text-foreground transition-colors">
              {t("nav.forRestaurants")}
            </Link>
            <span>{t("footer.about")}</span>
            <span>{t("footer.contact")}</span>
            <span>{t("footer.terms")}</span>
            <span>{t("footer.privacy")}</span>
          </div>
          <p className="text-xs text-muted">
            © 2026 Staliukas. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
