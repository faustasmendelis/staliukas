"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function NewsletterSignup() {
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
    return (
      <div className="bg-card-bg border border-border rounded-xl p-4 text-center">
        <p className="text-sm font-medium text-primary">{t("signup.success")}</p>
        <p className="text-xs text-muted mt-1">{t("signup.successDesc")}</p>
      </div>
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
