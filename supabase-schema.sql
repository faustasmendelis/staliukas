-- Staliukas Telegram Bot Schema
-- Run this in the Supabase SQL Editor

-- Maps Telegram chats to restaurants
CREATE TABLE telegram_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_chat_id BIGINT UNIQUE NOT NULL,
  restaurant_slug TEXT NOT NULL,
  restaurant_name TEXT NOT NULL,
  linked_at TIMESTAMPTZ DEFAULT now()
);

-- Staff-logged reservations
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_slug TEXT NOT NULL,
  party_size INTEGER NOT NULL,
  booking_time TEXT NOT NULL,
  booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  guest_name TEXT,
  notes TEXT,
  created_via TEXT DEFAULT 'telegram',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Staff-pushed live discounts
CREATE TABLE live_discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_slug TEXT NOT NULL,
  percent_off INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  valid_date DATE NOT NULL DEFAULT CURRENT_DATE,
  label_lt TEXT,
  label_en TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime on live_discounts for instant website updates
ALTER PUBLICATION supabase_realtime ADD TABLE live_discounts;

-- Row Level Security
ALTER TABLE live_discounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active discounts"
  ON live_discounts FOR SELECT
  USING (active = true AND valid_date = CURRENT_DATE);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read bookings"
  ON bookings FOR SELECT
  USING (true);

ALTER TABLE telegram_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read telegram links"
  ON telegram_links FOR SELECT
  USING (true);
