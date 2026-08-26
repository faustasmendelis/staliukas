-- Staliukas v2: Capacity + Block/Unblock Model
-- Run this in the Supabase SQL Editor

-- Restaurant capacity settings (set via Telegram /setup command)
CREATE TABLE IF NOT EXISTS restaurant_capacity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_slug TEXT UNIQUE NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 20,
  slot_duration_min INTEGER NOT NULL DEFAULT 90,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Unified bookings table: both Staliukas website bookings and Telegram-blocked slots
-- source = 'website' for customer bookings, 'telegram' for blocked slots
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'telegram';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS special_requests TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed';

-- Enable Realtime on bookings for availability updates
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- RLS for restaurant_capacity
ALTER TABLE restaurant_capacity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read capacity"
  ON restaurant_capacity FOR SELECT
  USING (true);
