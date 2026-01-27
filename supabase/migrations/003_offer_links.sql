-- Offer Links Table for shareable calculator offers
-- This allows tracking of offer visits and user engagement

-- Create offer_links table to store calculator offers
CREATE TABLE IF NOT EXISTS offer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id TEXT UNIQUE NOT NULL, -- Short unique identifier for the URL
  
  -- Calculator configuration
  offer_data JSONB NOT NULL, -- Complete offer configuration
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration date
  is_active BOOLEAN DEFAULT true,
  
  -- Optional customer info
  customer_email TEXT,
  customer_name TEXT,
  notes TEXT
);

-- Create offer_visits table to track when users view offers
CREATE TABLE IF NOT EXISTS offer_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id TEXT NOT NULL REFERENCES offer_links(link_id) ON DELETE CASCADE,
  
  -- Visit metadata
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Optional tracking data
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_offer_links_link_id ON offer_links(link_id);
CREATE INDEX IF NOT EXISTS idx_offer_links_created_at ON offer_links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offer_links_active ON offer_links(is_active);
CREATE INDEX IF NOT EXISTS idx_offer_visits_link_id ON offer_visits(link_id);
CREATE INDEX IF NOT EXISTS idx_offer_visits_visited_at ON offer_visits(visited_at DESC);

-- Enable RLS
ALTER TABLE offer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_visits ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view offers via link)
CREATE POLICY "Allow public read access to active offer links" 
  ON offer_links FOR SELECT 
  USING (is_active = true);

-- Create policies for public insert (tracking visits)
CREATE POLICY "Allow public insert for offer visits" 
  ON offer_visits FOR INSERT 
  WITH CHECK (true);

-- Create policies for read access to visits (for analytics)
CREATE POLICY "Allow public read access to offer visits" 
  ON offer_visits FOR SELECT 
  USING (true);

-- Function to generate a short unique link ID
CREATE OR REPLACE FUNCTION generate_link_id()
RETURNS TEXT AS $$
DECLARE
  characters TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  link_id TEXT := '';
  i INTEGER;
  link_exists BOOLEAN;
BEGIN
  LOOP
    link_id := '';
    FOR i IN 1..8 LOOP
      link_id := link_id || substr(characters, floor(random() * length(characters) + 1)::integer, 1);
    END LOOP;
    
    -- Check if link_id already exists
    SELECT EXISTS(SELECT 1 FROM offer_links WHERE offer_links.link_id = link_id) INTO link_exists;
    
    IF NOT link_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN link_id;
END;
$$ LANGUAGE plpgsql;

-- Note: Admin operations (create/update/delete offers) should be handled through service role key in backend API
