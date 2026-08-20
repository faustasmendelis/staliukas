"use client";

import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import type { Reservation } from "@/data/types";
import { getReservation } from "@/lib/reservations";
import { downloadIcsFile, getGoogleCalendarUrl } from "@/lib/calendar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import NewsletterSignup from "@/components/reservation/NewsletterSignup";

function SuccessContent() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (id) {
      const r = getReservation(id);
      if (r) setReservation(r);
    }
  }, [id]);

  if (!reservation) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">{t("common.loading")}</p>
      </div>
    );
  }

  const calendarEvent = {
    title: `${t("common.bookTable")} — ${reservation.restaurantName}`,
    description: `${t("reservation.partySize")}: ${reservation.partySize}. ${reservation.specialRequests || ""}`,
    location: reservation.restaurantName,
    startDate: reservation.date,
    startTime: reservation.time,
  };

  const googleUrl = getGoogleCalendarUrl(calendarEvent);

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold mb-2">{t("success.title")}</h1>
      <p className="text-muted mb-8">{t("success.subtitle")}</p>

      <div className="bg-card-bg border border-border rounded-xl p-6 text-left space-y-3 mb-8">
        <div className="flex justify-between">
          <span className="text-sm text-muted">{t("success.restaurant")}</span>
          <span className="text-sm font-medium">
            {reservation.restaurantName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted">{t("success.date")}</span>
          <span className="text-sm font-medium">{reservation.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted">{t("success.time")}</span>
          <span className="text-sm font-medium">{reservation.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted">{t("success.partySize")}</span>
          <span className="text-sm font-medium">
            {reservation.partySize} {t("reservation.people")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted">{t("success.guest")}</span>
          <span className="text-sm font-medium">{reservation.guestName}</span>
        </div>
        {reservation.paymentMethod && (
          <div className="flex justify-between">
            <span className="text-sm text-muted">{t("common.deposit")}</span>
            <Badge variant="accent">€5.00 — {reservation.paymentMethod}</Badge>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-8">
        <p className="text-sm font-medium">{t("success.addToCalendar")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => downloadIcsFile(calendarEvent)}
          >
            📅 {t("success.downloadIcs")}
          </Button>
          <a href={googleUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full">
              📅 {t("success.googleCalendar")}
            </Button>
          </a>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mb-8">
        <span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full uppercase tracking-wide">
          {t("demo.badge")}
        </span>
        <p className="text-sm text-muted mt-2 mb-4">{t("demo.successNote")}</p>
        <NewsletterSignup />
      </div>

      <Link href={`/${locale}`}>
        <Button variant="primary" size="lg">
          {t("success.backHome")}
        </Button>
      </Link>
    </div>
  );
}

export default function ReservationSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
