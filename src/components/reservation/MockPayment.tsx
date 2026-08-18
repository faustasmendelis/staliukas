"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Button from "@/components/ui/Button";

interface MockPaymentProps {
  onComplete: (method: string) => void;
}

const BANKS = [
  {
    id: "montonio",
    name: "Montonio",
    color: "bg-[#1a1a2e]",
    textColor: "text-white",
  },
  {
    id: "swedbank",
    name: "Swedbank",
    color: "bg-[#ff6200]",
    textColor: "text-white",
  },
  {
    id: "seb",
    name: "SEB",
    color: "bg-[#60cd18]",
    textColor: "text-white",
  },
  {
    id: "luminor",
    name: "Luminor",
    color: "bg-[#652d86]",
    textColor: "text-white",
  },
];

export default function MockPayment({ onComplete }: MockPaymentProps) {
  const t = useTranslations();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");

  const handleBank = (bankId: string) => {
    setSelectedBank(bankId);
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onComplete(bankId);
      }, 1000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-lg font-semibold text-success">
          {t("payment.success")}
        </p>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3 animate-spin">⏳</div>
        <p className="text-lg font-medium text-muted">
          {t("payment.processing")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("payment.title")}</h2>
      <p className="text-sm text-muted">{t("payment.subtitle")}</p>

      <div className="bg-muted-bg rounded-lg p-3 text-center">
        <p className="text-sm font-medium">
          {t("payment.depositAmount", { amount: "€5.00" })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {BANKS.map((bank) => (
          <Button
            key={bank.id}
            type="button"
            variant="outline"
            size="lg"
            onClick={() => handleBank(bank.id)}
            className={`${bank.color} ${bank.textColor} border-transparent hover:opacity-90 font-bold`}
          >
            {bank.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
