-- Staliukas v2: Capacity + Block/Unblock Model
-- Run this in the Supabase SQL Editor

-- Restaurant capacity settings
CREATE TABLE IF NOT EXISTS restaurant_capacity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_slug TEXT UNIQUE NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 20,
  slot_duration_min INTEGER NOT NULL DEFAULT 90,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add new columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'telegram';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS special_requests TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed';

-- Enable Realtime on bookings
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- RLS for restaurant_capacity
ALTER TABLE restaurant_capacity ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  CREATE POLICY "Public can read capacity"
    ON restaurant_capacity FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Insert capacity for all 67 restaurants (default 20 seats)
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('nineteen18', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('dziaugsmas', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('amandus', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('grey', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('etno-dvaras', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('snekutis', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('georgian-house', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('ertlio-namas', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('pacai-restaurant', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('el-gato-negro', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('momo-grill', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('da-antonio', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('omakase-by-vaidas-uzgerys', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('le-travi', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('14-horses', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('farmer-the-ocean', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('stikliai', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('eleno', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('demo', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('gaspars', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('brasserie-astoria', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('sweet-root', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('bistro-18', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('lokys', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('meat-lovers-pub', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('casa-della-pasta', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('sugamour', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('aj-sokoladas', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('iki-velumos', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('bunte-gans', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('busi-trecias', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('mykolo-4', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('radharane', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('lalaland-pizza', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('dublis', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('dine', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('selfish-bistro', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('sakotis', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('boom-burgers', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('queensberry', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('narutis', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('telegrafas', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('zatar', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('jurgis-ir-drakonas', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('berneliu-uzeiga', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('snekutis-polocko', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('pho-bo-ga', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('gan-bei', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('senoji-trobele', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('steak-and-grill-house', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('mimine', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('green-cafe', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('cozy', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('kregzdute', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('restaurant-medininkai', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('gurmaniskasis-draugas', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('keule-ruke', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('mano-guru', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('amatu-stotis', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('forto-dvaras', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('cloud-nine', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('kamane', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('briusly', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('cili-kaimas', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('rib-room', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('paparazzi', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
INSERT INTO restaurant_capacity (restaurant_slug, total_seats) VALUES ('pompeja', 20) ON CONFLICT (restaurant_slug) DO NOTHING;
