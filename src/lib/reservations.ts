import type { Reservation } from "@/data/types";

const STORAGE_KEY = "staliukas_reservations";

export function saveReservation(reservation: Reservation): void {
  const existing = getReservations();
  existing.push(reservation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getReservation(id: string): Reservation | undefined {
  return getReservations().find((r) => r.id === id);
}
