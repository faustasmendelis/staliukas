export interface TelegramLink {
  id: string;
  telegram_chat_id: number;
  restaurant_slug: string;
  restaurant_name: string;
  linked_at: string;
}

export interface Booking {
  id: string;
  restaurant_slug: string;
  party_size: number;
  booking_time: string;
  booking_date: string;
  guest_name: string | null;
  notes: string | null;
  email: string | null;
  phone: string | null;
  special_requests: string | null;
  source: "website" | "telegram";
  status: string;
  created_via: string;
  created_at: string;
}

export interface LiveDiscount {
  id: string;
  restaurant_slug: string;
  percent_off: number;
  start_time: string;
  end_time: string;
  valid_date: string;
  label_lt: string | null;
  label_en: string | null;
  active: boolean;
  created_at: string;
}

export interface RestaurantCapacity {
  id: string;
  restaurant_slug: string;
  total_seats: number;
  slot_duration_min: number;
  updated_at: string;
}
