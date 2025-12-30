-- Calculator Settings Table for managing floor calculator configuration
-- This allows admins to dynamically update prices, images, and descriptions

-- Create calculator_surface_types table
CREATE TABLE IF NOT EXISTS calculator_surface_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_m2 NUMERIC NOT NULL,
  price_ranges JSONB DEFAULT '[]'::jsonb, -- Array of {min_m2, max_m2, price_per_m2}
  image_url TEXT,
  properties JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calculator_colors table
CREATE TABLE IF NOT EXISTS calculator_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  color_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  ral_code TEXT NOT NULL,
  additional_price NUMERIC DEFAULT 0,
  thumbnail_url TEXT,
  preview_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calculator_services table
CREATE TABLE IF NOT EXISTS calculator_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'przygotowanie', 'wykończenie', 'ochrona', 'logistyka'
  price_per_m2 NUMERIC,
  price_per_mb NUMERIC,
  price_fixed NUMERIC,
  image_url TEXT,
  is_mandatory BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calculator_room_types table
CREATE TABLE IF NOT EXISTS calculator_room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calculator_concrete_states table
CREATE TABLE IF NOT EXISTS calculator_concrete_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  additional_price NUMERIC DEFAULT 0,
  show_price_in_label BOOLEAN DEFAULT false, -- Whether to show "+25 zł" in label
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_surface_types_active ON calculator_surface_types(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_colors_active ON calculator_colors(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_services_active ON calculator_services(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_services_category ON calculator_services(category);
CREATE INDEX IF NOT EXISTS idx_room_types_available ON calculator_room_types(is_available, display_order);

-- Insert default surface types
INSERT INTO calculator_surface_types (type_id, name, description, price_per_m2, properties, display_order) VALUES
('podstawowa', 'Podstawowa lekko chropowata', 'Powierzchnia z kruszywem kwarcowym zapewniająca dobrą przyczepność', 200, '["Kruszywo kwarcowe", "Lekko chropowata", "Dobra przyczepność", "Standardowa odporność"]'::jsonb, 1),
('akrylowa', 'Z posypką z płatków akrylowych', 'Dekoracyjna powierzchnia z kolorowymi płatkami akrylowymi', 230, '["Płatki akrylowe", "Efekt dekoracyjny", "Zwiększona estetyka", "Dobra odporność"]'::jsonb, 2),
('zacierana', 'Zacierana mechanicznie', 'Gładka powierzchnia zacierana mechanicznie dla najwyższej jakości', 260, '["Zacierana mechanicznie", "Gładka powierzchnia", "Najwyższa jakość", "Maksymalna odporność"]'::jsonb, 3)
ON CONFLICT (type_id) DO NOTHING;

-- Insert default colors
INSERT INTO calculator_colors (color_id, name, ral_code, additional_price, display_order) VALUES
('ral7035', 'RAL 7035 - Szary jasny', 'RAL 7035', 0, 1),
('ral7040', 'RAL 7040 - Szary okno', 'RAL 7040', 0, 2),
('ral7035posypka', 'RAL 7035 z posypką', 'RAL 7035', 50, 3)
ON CONFLICT (color_id) DO NOTHING;

-- Insert default services
INSERT INTO calculator_services (service_id, name, description, category, price_per_m2, is_mandatory, is_default, display_order) VALUES
('gruntowanie', 'Gruntowanie podłoża', 'Dwukrotne gruntowanie podłoża dla lepszej przyczepności', 'przygotowanie', 8, true, true, 1)
ON CONFLICT (service_id) DO NOTHING;

INSERT INTO calculator_services (service_id, name, description, category, price_per_mb, is_mandatory, is_default, display_order) VALUES
('cokol', 'Cokoły na wysokość 10cm', 'Wykonanie cokołu żywicznego na wysokość 10cm', 'wykończenie', 15, true, true, 2),
('uszczelnienie', 'Uszczelnienie między ścianą a posadzką', 'Silikonowe uszczelnienie styku posadzki z ścianą', 'wykończenie', 8, true, true, 3),
('dylatacje', 'Dylatacje', 'Wykonanie dylatacji w posadzce zgodnie z wymogami technicznymi', 'wykończenie', 12, false, false, 4)
ON CONFLICT (service_id) DO NOTHING;

INSERT INTO calculator_services (service_id, name, description, category, price_per_m2, is_mandatory, is_default, display_order) VALUES
('podklad', 'Podkład wyrównujący', 'Samopoziomujący podkład cementowy do wyrównania powierzchni', 'przygotowanie', 15, false, false, 5),
('szlifowanie', 'Szlifowanie betonu', 'Mechaniczne przygotowanie powierzchni betonowej', 'przygotowanie', 12, false, false, 6),
('naprawa-ubytków', 'Naprawa ubytków', 'Wypełnienie i wyrównanie ubytków w podłożu', 'przygotowanie', 25, false, false, 7),
('demontaz', 'Demontaż starej posadzki', 'Usunięcie istniejącej posadzki wraz z wywozem gruzu', 'przygotowanie', 8, false, false, 8),
('warstwa-ochronna', 'Warstwa ochronna', 'Dodatkowa warstwa ochronna zwiększająca odporność', 'ochrona', 18, false, false, 9),
('antypoślizgowa', 'Powierzchnia antypoślizgowa', 'Specjalna tekstura zwiększająca bezpieczeństwo', 'ochrona', 22, false, false, 10)
ON CONFLICT (service_id) DO NOTHING;

INSERT INTO calculator_services (service_id, name, description, category, price_fixed, is_mandatory, is_default, display_order) VALUES
('transport', 'Transport i dostawa', 'Dostawa materiałów na teren budowy', 'logistyka', 150, false, false, 11),
('sprzatanie', 'Sprzątanie końcowe', 'Kompleksowe sprzątanie po zakończeniu prac', 'wykończenie', 200, false, false, 12)
ON CONFLICT (service_id) DO NOTHING;

-- Insert default room types
INSERT INTO calculator_room_types (room_id, name, description, icon, is_available, display_order) VALUES
('garaz-piwnica', 'Garaż / Piwnica', 'Posadzka żywiczna dla garaży i piwnic - wytrzymała i łatwa w utrzymaniu', '🚗', true, 1),
('mieszkanie-dom', 'Mieszkanie / Dom', 'Elegancka posadzka żywiczna do przestrzeni mieszkalnych', '🏠', true, 2),
('balkon-taras', 'Balkon / Taras', 'Posadzka zewnętrzna odporna na warunki atmosferyczne (niedostępne)', '🌿', false, 3)
ON CONFLICT (room_id) DO NOTHING;

-- Insert default concrete states
INSERT INTO calculator_concrete_states (state_id, name, description, additional_price, show_price_in_label, display_order) VALUES
('nowa-wylewka', 'Nowa wylewka betonowa', 'Świeża wylewka betonowa - wymaga jedynie gruntowania', 0, false, 1),
('plytki', 'Płytki ceramiczne', 'Istniejące płytki - wymagają usunięcia i przygotowania podłoża', 25, false, 2)
ON CONFLICT (state_id) DO NOTHING;

-- Disable services in 'ochrona' category by default
UPDATE calculator_services SET is_active = false WHERE category = 'ochrona';

-- Add RLS policies (allow public read, admin write)
ALTER TABLE calculator_surface_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_concrete_states ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to surface types" ON calculator_surface_types FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to colors" ON calculator_colors FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to services" ON calculator_services FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to room types" ON calculator_room_types FOR SELECT USING (is_available = true OR is_available = false);
CREATE POLICY "Allow public read access to concrete states" ON calculator_concrete_states FOR SELECT USING (true);

-- Note: Admin write access should be handled through service role key in backend API
