"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Restaurant } from "@/data/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface ReservationFormProps {
  restaurant: Restaurant;
}

export default function ReservationForm({ restaurant }: ReservationFormProps) {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formId = process.env.NEXT_PUBLIC_FORMSPREE_CUSTOMER_ID;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setSubmitting(true);
    try {
      if (formId) {
        await fetch(`https://formspree.io/f/${formId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            restaurant: restaurant.name,
            source: "restaurant_page",
          }),
        });
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-primary mb-1">{t("signup.success")}</h3>
        <p className="text-sm text-muted">{t("signup.successDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <span className="inline-block bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full mb-3">
          {t("signup.comingSoon")}
        </span>
        <p className="text-sm text-muted">{t("signup.subtitle")}</p>
      </div>

      {restaurant.offPeakDiscount && (
        <div className="bg-discount-bg rounded-lg p-3 text-center">
          <p className="text-sm font-medium text-discount-text">
            -{restaurant.offPeakDiscount.percentOff}%{" "}
            {restaurant.offPeakDiscount.startTime}–{restaurant.offPeakDiscount.endTime}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder={t("signup.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "..." : t("signup.submit")}
        </Button>
      </form>
    </div>
  );
}
