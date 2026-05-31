-- MVP shop tables for configurable resin floor bundles

CREATE TABLE IF NOT EXISTS shop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  pricing_model TEXT NOT NULL DEFAULT 'fixed' CHECK (pricing_model IN ('fixed', 'unit', 'm2', 'mb')),
  unit_label TEXT,
  image_url TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  applicable_room_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shop_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  description TEXT NOT NULL,
  room_type TEXT NOT NULL,
  coverage_from_m2 NUMERIC NOT NULL DEFAULT 0,
  coverage_to_m2 NUMERIC,
  base_price NUMERIC NOT NULL DEFAULT 0,
  price_per_m2 NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  included_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shop_recommendation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  room_type TEXT NOT NULL,
  min_area NUMERIC NOT NULL DEFAULT 0,
  max_area NUMERIC,
  recommended_product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shop_products_active ON shop_products(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_shop_bundles_room_type ON shop_bundles(room_type, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_shop_recommendation_rules_room_type ON shop_recommendation_rules(room_type, is_active, display_order);

INSERT INTO shop_products (product_id, name, short_name, description, category, price, pricing_model, unit_label, applicable_room_types, is_featured, is_active, display_order) VALUES
('grunt-epoksydowy', 'Grunt epoksydowy', 'Grunt', 'Warstwa gruntująca poprawiająca przyczepność systemu żywicznego do betonu.', 'chemia', 14, 'm2', 'zł / m²', '["garaz", "piwnica"]'::jsonb, false, true, 1),
('zywica-bazowa', 'Żywica bazowa do garażu', 'Żywica bazowa', 'Podstawowa warstwa robocza o wysokiej odporności mechanicznej.', 'chemia', 95, 'm2', 'zł / m²', '["garaz", "piwnica"]'::jsonb, false, true, 2),
('warstwa-zamykajaca', 'Warstwa zamykająca', 'Warstwa zamykająca', 'Zabezpiecza system przed zabrudzeniami i ułatwia późniejsze mycie posadzki.', 'chemia', 28, 'm2', 'zł / m²', '["garaz", "piwnica"]'::jsonb, false, true, 3),
('platki-dekoracyjne', 'Płatki dekoracyjne', 'Płatki dekoracyjne', 'Dekoracyjne płatki zwiększające estetykę i maskujące drobne zabrudzenia.', 'wykończenie', 22, 'm2', 'zł / m²', '["garaz", "piwnica"]'::jsonb, true, true, 4),
('cokol-epoksydowy', 'Cokół epoksydowy 10 cm', 'Cokół 10 cm', 'Wywinięcie żywicy na ścianę dla łatwiejszego utrzymania czystości i szczelności.', 'wykończenie', 18, 'mb', 'zł / mb', '["garaz", "piwnica"]'::jsonb, true, true, 5),
('warstwa-antyposlizgowa', 'Warstwa antypoślizgowa', 'Antypoślizg', 'Dodatkowa tekstura poprawiająca bezpieczeństwo przy mokrej nawierzchni.', 'bezpieczenstwo', 35, 'm2', 'zł / m²', '["garaz", "piwnica"]'::jsonb, true, true, 6),
('zestaw-narzedzi', 'Zestaw narzędzi aplikacyjnych', 'Zestaw narzędzi', 'Wałek, kuweta i akcesoria potrzebne do samodzielnej aplikacji zestawu.', 'akcesoria', 149, 'fixed', 'zł / zestaw', '["garaz", "piwnica"]'::jsonb, true, true, 7)
ON CONFLICT (product_id) DO NOTHING;

INSERT INTO shop_bundles (variant_id, name, short_name, description, room_type, coverage_from_m2, coverage_to_m2, base_price, price_per_m2, image_url, highlights, included_items, recommended_product_ids, cta_label, is_active, display_order) VALUES
('garaz-start', 'Zestaw Garaż Start', 'Start', 'Najprostszy zestaw do odświeżenia garażu domowego i piwnicy o standardowym obciążeniu.', 'garaz', 0, 30, 320, 122, '/placeholder.svg', '["do 30 m²", "ekonomiczny wariant", "łatwy do wdrożenia"]'::jsonb, '[{"product_id":"grunt-epoksydowy","quantity_type":"per_m2","quantity_value":1,"unit_label":"warstwa"},{"product_id":"zywica-bazowa","quantity_type":"per_m2","quantity_value":1,"unit_label":"system / m²"},{"product_id":"warstwa-zamykajaca","quantity_type":"per_m2","quantity_value":1,"unit_label":"warstwa"}]'::jsonb, '["zestaw-narzedzi", "cokol-epoksydowy"]'::jsonb, 'Wybierz Start', true, 1),
('garaz-trwalejszy', 'Zestaw Garaż Trwałość+', 'Trwałość+', 'Wariant dla intensywniej użytkowanych garaży z większą odpornością na ścieranie.', 'garaz', 20, 45, 390, 146, '/placeholder.svg', '["20–45 m²", "większa trwałość", "polecany do garażu 2-stanowiskowego"]'::jsonb, '[{"product_id":"grunt-epoksydowy","quantity_type":"per_m2","quantity_value":1,"unit_label":"warstwa"},{"product_id":"zywica-bazowa","quantity_type":"per_m2","quantity_value":1.15,"unit_label":"system / m²"},{"product_id":"warstwa-zamykajaca","quantity_type":"per_m2","quantity_value":1,"unit_label":"warstwa"},{"product_id":"warstwa-antyposlizgowa","quantity_type":"per_10m2","quantity_value":1,"unit_label":"dodatek / 10 m²"}]'::jsonb, '["cokol-epoksydowy", "platki-dekoracyjne"]'::jsonb, 'Wybierz Trwałość+', true, 2),
('garaz-premium', 'Zestaw Garaż Premium', 'Premium', 'Najbardziej kompletny zestaw z warstwą dekoracyjną i zabezpieczeniem do większych garaży.', 'garaz', 30, NULL, 490, 168, '/placeholder.svg', '["od 30 m²", "wariant premium", "najlepszy efekt wizualny"]'::jsonb, '[{"product_id":"grunt-epoksydowy","quantity_type":"per_m2","quantity_value":1,"unit_label":"warstwa"},{"product_id":"zywica-bazowa","quantity_type":"per_m2","quantity_value":1.2,"unit_label":"system / m²"},{"product_id":"warstwa-zamykajaca","quantity_type":"per_m2","quantity_value":1,"unit_label":"warstwa"},{"product_id":"platki-dekoracyjne","quantity_type":"per_m2","quantity_value":1,"unit_label":"dodatek / m²"}]'::jsonb, '["cokol-epoksydowy", "warstwa-antyposlizgowa", "zestaw-narzedzi"]'::jsonb, 'Wybierz Premium', true, 3),
('piwnica-standard', 'Zestaw Piwnica Standard', 'Piwnica', 'Zestaw do pomieszczeń pomocniczych, gdzie priorytetem jest szczelność i łatwe sprzątanie.', 'piwnica', 0, NULL, 280, 118, '/placeholder.svg', '["do piwnic i schowków", "łatwe utrzymanie czystości", "szybkie wdrożenie"]'::jsonb, '[{"product_id":"grunt-epoksydowy","quantity_type":"per_m2","quantity_value":1,"unit_label":"warstwa"},{"product_id":"zywica-bazowa","quantity_type":"per_m2","quantity_value":1,"unit_label":"system / m²"},{"product_id":"warstwa-zamykajaca","quantity_type":"per_m2","quantity_value":1,"unit_label":"warstwa"}]'::jsonb, '["cokol-epoksydowy"]'::jsonb, 'Wybierz zestaw do piwnicy', true, 4)
ON CONFLICT (variant_id) DO NOTHING;

INSERT INTO shop_recommendation_rules (rule_id, name, title, description, room_type, min_area, max_area, recommended_product_ids, is_active, display_order) VALUES
('garaz-maly', 'Mały garaż', 'Najczęściej dobierane do małego garażu', 'Przy mniejszym metrażu klienci najczęściej dobierają akcesoria startowe i cokół.', 'garaz', 0, 25, '["zestaw-narzedzi", "cokol-epoksydowy"]'::jsonb, true, 1),
('garaz-sredni', 'Średni garaż', 'Polecane dodatki do garażu 1,5–2 stanowiskowego', 'Przy większym użytkowaniu warto od razu dołożyć wykończenie dekoracyjne i warstwę antypoślizgową.', 'garaz', 25, 45, '["platki-dekoracyjne", "warstwa-antyposlizgowa", "cokol-epoksydowy"]'::jsonb, true, 2),
('piwnica-podstawowa', 'Piwnica', 'Dodatki polecane do piwnicy i pomieszczeń pomocniczych', 'W piwnicy najczęściej wybierane są uszczelniający cokół i pakiet narzędzi do aplikacji.', 'piwnica', 0, NULL, '["cokol-epoksydowy", "zestaw-narzedzi"]'::jsonb, true, 3)
ON CONFLICT (rule_id) DO NOTHING;

ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_recommendation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to shop products" ON shop_products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to shop bundles" ON shop_bundles FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to shop recommendation rules" ON shop_recommendation_rules FOR SELECT USING (is_active = true);
