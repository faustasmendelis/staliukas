"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function RegisterRestaurantPage() {
  const t = useTranslations();

  const [form, setForm] = useState({
    restaurantName: "",
    contactName: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formId = process.env.NEXT_PUBLIC_FORMSPREE_RESTAURANT_ID;

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.restaurantName || !form.contactName || !form.email || !form.phone) return;

    setSubmitting(true);
    setError("");

    try {
      if (formId) {
        const res = await fetch(`https://formspree.io/f/${formId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, source: "restaurant_register" }),
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
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">{t("partner.success")}</h2>
        <p className="text-muted">{t("partner.successDesc")}</p>
      </div>
    );
  }

  const cityOptions = [
    { value: "", label: t("filters.allCities") },
    { value: "vilnius", label: t("cities.vilnius") },
    { value: "kaunas", label: t("cities.kaunas") },
    { value: "klaipeda", label: t("cities.klaipeda") },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <span className="inline-block bg-accent/10 text-accent text-sm font-bold px-4 py-1.5 rounded-full mb-4">
          {t("signup.comingSoon")}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          {t("partner.title")}
        </h1>
        <p className="text-lg text-muted">
          {t("partner.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {(["benefit1", "benefit2", "benefit3"] as const).map((key) => (
          <div key={key} className="bg-card-bg border border-border rounded-xl p-5 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary text-lg">
                {key === "benefit1" ? "👥" : key === "benefit2" ? "📈" : "⚡"}
              </span>
            </div>
            <p className="text-sm font-medium">{t(`partner.${key}`)}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-card-bg border border-border rounded-xl p-6 sm:p-8 space-y-4">
        <Input
          label={t("partner.restaurantName")}
          value={form.restaurantName}
          onChange={(e) => update("restaurantName", e.target.value)}
          required
        />
        <Input
          label={t("partner.contactName")}
          value={form.contactName}
          onChange={(e) => update("contactName", e.target.value)}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t("partner.email")}
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
          <Input
            label={t("partner.phone")}
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            required
          />
        </div>
        <Select
          label={t("partner.city")}
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          options={cityOptions}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">
            {t("partner.message")}
          </label>
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card-bg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm"
          />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "..." : t("partner.submit")}
        </Button>
      </form>
    </div>
  );
}
