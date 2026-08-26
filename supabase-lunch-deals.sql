-- Lunch deals table
CREATE TABLE IF NOT EXISTS lunch_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_slug TEXT NOT NULL,
  price NUMERIC(6,2) NOT NULL,
  description TEXT NOT NULL,
  valid_date DATE NOT NULL DEFAULT CURRENT_DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lunch_deals_date ON lunch_deals (valid_date, active);

ALTER TABLE lunch_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read lunch deals"
  ON lunch_deals FOR SELECT
  USING (true);

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE lunch_deals;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;
