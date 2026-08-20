"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Props {
  variant?: "card" | "inline";
}

export default function NewsletterSignup({ variant = "card" }: Props) {
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
          body: JSON.stringify({ email, source: "newsletter" }),
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
    if (variant === "inline") {
      return (
        <p className="text-sm font-medium text-center">
          {t("signup.success")} {t("signup.successDesc")}
        </p>
      );
    }
    return (
      <div className="bg-card-bg border border-border rounded-xl p-4 text-center">
        <p className="text-sm font-medium text-primary">{t("signup.success")}</p>
        <p className="text-xs text-muted mt-1">{t("signup.successDesc")}</p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder={t("signup.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-white text-primary font-medium rounded-lg text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "..." : t("signup.submit")}
        </button>
      </form>
    );
  }

  return (
    <div className="bg-card-bg border border-border rounded-xl p-4">
      <p className="text-sm text-muted mb-3">{t("signup.subtitle")}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder={t("signup.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "..." : t("signup.submit")}
        </Button>
      </form>
    </div>
  );
}
