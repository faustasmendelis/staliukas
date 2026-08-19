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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formId = process.env.NEXT_PUBLIC_FORMSPREE_CUSTOMER_ID;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes("@")) return;

    setSubmitting(true);
    setError("");

    try {
      if (formId) {
        const res = await fetch(`https://formspree.io/f/${formId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            restaurant: restaurant.name,
            source: "restaurant_page",
          }),
        });
        if (!res.ok) throw new Error();
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-primary mb-1">{t("signup.success")}</h3>
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
        <h2 className="text-lg font-semibold">{t("signup.earlyAccess")}</h2>
        <p className="text-sm text-muted mt-1">{t("signup.subtitle")}</p>
      </div>

      {restaurant.offPeakDiscount && (
        <div className="bg-discount-bg rounded-lg p-3 text-center">
          <p className="text-sm font-medium text-discount-text">
            -{restaurant.offPeakDiscount.percentOff}%{" "}
            {restaurant.offPeakDiscount.startTime}–{restaurant.offPeakDiscount.endTime}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label={t("signup.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label={t("signup.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-xs text-error">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "..." : t("signup.submit")}
        </Button>
      </form>
    </div>
  );
}
