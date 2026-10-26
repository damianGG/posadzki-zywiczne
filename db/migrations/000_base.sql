CREATE TABLE IF NOT EXISTS realizacje (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  short_description text,
  location text NOT NULL,
  surface_area text,
  project_type text NOT NULL,
  technology text,
  color text,
  duration text,
  keywords text[],
  tags text[],
  features text[],
  benefits text[],
  meta_description text,
  og_title text,
  og_description text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  faq jsonb DEFAULT '[]'::jsonb,
  cloudinary_folder text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  h1 text,
  content jsonb
);

CREATE INDEX IF NOT EXISTS idx_realizacje_created ON realizacje(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_realizacje_project_type ON realizacje(project_type);

CREATE TABLE IF NOT EXISTS contest_entries (
  email text NOT NULL,
  name text NOT NULL,
  code text NOT NULL,
  "timestamp" text NOT NULL
);

CREATE TABLE IF NOT EXISTS offer_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id text NOT NULL UNIQUE,
  offer_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  customer_email text,
  customer_name text,
  notes text
);

CREATE TABLE IF NOT EXISTS offer_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id text NOT NULL,
  visited_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  referrer text
);
