"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Restaurant, Reservation } from "@/data/types";
import { saveReservation } from "@/lib/reservations";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import MockPayment from "./MockPayment";

interface ReservationFormProps {
  restaurant: Restaurant;
}

interface SlotAvailability {
  time: string;
  available_seats: number;
}

function isInDiscountWindow(
  time: string,
  startTime: string,
  endTime: string
): boolean {
  return time >= startTime && time < endTime;
}

export default function ReservationForm({ restaurant }: ReservationFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const discount = restaurant.offPeakDiscount;
  const selectedSlotHasDiscount =
    discount &&
    time &&
    isInDiscountWindow(time, discount.startTime, discount.endTime);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!date) return;

    async function fetchAvailability() {
      try {
        const res = await fetch(
          `/api/availability/${restaurant.slug}?date=${date}`
        );
        if (res.ok) {
          const data = await res.json();
          setSlots(data.slots);
        }
      } catch {
        // API not available — show all slots as available
      }
    }

    fetchAvailability();
  }, [date, restaurant.slug]);

  // Fallback: generate static slots if API didn't return any
  const timeSlots: SlotAvailability[] =
    slots.length > 0
      ? slots
      : Array.from({ length: 22 }, (_, i) => {
          const h = 11 + Math.floor(i / 2);
          const m = i % 2 === 0 ? "00" : "30";
          return {
            time: `${h.toString().padStart(2, "0")}:${m}`,
            available_seats: 20,
          };
        });

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = t("reservation.selectDate");
    if (!time) newErrors.time = t("reservation.selectTime");
    if (!partySize) newErrors.partySize = t("reservation.selectPartySize");
    if (!name.trim()) newErrors.name = t("reservation.name");
    if (!phone.trim()) newErrors.phone = t("reservation.phone");
    if (!email.trim() || !email.includes("@"))
      newErrors.email = t("reservation.email");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setShowPayment(true);
  };

  const handlePaymentComplete = async (method: string) => {
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_slug: restaurant.slug,
          party_size: Number(partySize),
          booking_time: time,
          booking_date: date,
          guest_name: name,
          email,
          phone,
          special_requests: specialRequests || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Booking failed. Please try again.");
        setShowPayment(false);
        setSubmitting(false);
        return;
      }
    } catch {
      // If API fails, fall through to localStorage as fallback
    }

    // Also save to localStorage for the success page
    const reservation: Reservation = {
      id: crypto.randomUUID(),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      date,
      time,
      partySize: Number(partySize),
      guestName: name,
      phone,
      email,
      specialRequests: specialRequests || undefined,
      depositAmount: 5,
      paymentMethod: method,
      createdAt: new Date().toISOString(),
    };

    saveReservation(reservation);
    router.push(`/${locale}/reservation-success?id=${reservation.id}`);
  };

  if (showPayment) {
    return (
      <MockPayment
        onComplete={handlePaymentComplete}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{t("reservation.title")}</h2>
        <span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full uppercase tracking-wide">
          {t("demo.badge")}
        </span>
      </div>
      <p className="text-xs text-muted -mt-2">{t("demo.bookingNote")}</p>

      <Input
        label={t("reservation.date")}
        type="date"
        min={today}
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setTime("");
        }}
        error={errors.date}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">
          {t("reservation.time")}
        </label>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {timeSlots.map((slot) => {
            const hasDiscount =
              discount &&
              isInDiscountWindow(slot.time, discount.startTime, discount.endTime);
            const isFull =
              partySize && slot.available_seats < Number(partySize);
            return (
              <button
                key={slot.time}
                type="button"
                disabled={!!isFull}
                onClick={() => setTime(slot.time)}
                className={`px-2 py-1.5 rounded-lg text-sm border transition-colors ${
                  isFull
                    ? "border-border bg-muted-bg text-muted opacity-50 cursor-not-allowed"
                    : time === slot.time
                    ? "bg-primary text-white border-primary"
                    : hasDiscount
                    ? "border-accent bg-discount-bg text-discount-text hover:border-accent"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {slot.time}
                {isFull ? (
                  <span className="block text-[10px]">full</span>
                ) : hasDiscount ? (
                  <span className="block text-[10px]">
                    -{discount.percentOff}%
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        {errors.time && <p className="text-xs text-error">{errors.time}</p>}
      </div>

      {selectedSlotHasDiscount && (
        <Badge variant="discount">
          {t("reservation.discountApplied", {
            percentOff: discount.percentOff,
          })}
        </Badge>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">
          {t("reservation.partySize")}
        </label>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setPartySize(String(n));
                setTime("");
              }}
              className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                partySize === String(n)
                  ? "bg-primary text-white border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {errors.partySize && (
          <p className="text-xs text-error">{errors.partySize}</p>
        )}
      </div>

      <Input
        label={t("reservation.name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <Input
        label={t("reservation.phone")}
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
      />

      <Input
        label={t("reservation.email")}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">
          {t("reservation.specialRequests")}
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder={t("reservation.specialRequestsPlaceholder")}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-border bg-card-bg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {t("reservation.submit")}
      </Button>
    </form>
  );
}
