-- Extend shop_products with standalone-result visibility, product pages and variants content

ALTER TABLE shop_products
  ADD COLUMN IF NOT EXISTS show_in_configurator_result BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS result_display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS result_display_type TEXT NOT NULL DEFAULT 'card' CHECK (result_display_type IN ('card', 'compact')),
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS page_title TEXT,
  ADD COLUMN IF NOT EXISTS page_description TEXT,
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS specifications JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE shop_products
SET
  show_in_configurator_result = COALESCE(show_in_configurator_result, false),
  result_display_order = COALESCE(result_display_order, display_order, 0),
  slug = COALESCE(NULLIF(slug, ''), product_id),
  page_title = COALESCE(NULLIF(page_title, ''), name),
  page_description = COALESCE(NULLIF(page_description, ''), description),
  meta_title = COALESCE(NULLIF(meta_title, ''), name),
  meta_description = COALESCE(NULLIF(meta_description, ''), description)
WHERE true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_shop_products_slug_unique
  ON shop_products (slug)
  WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_shop_products_result_visibility
  ON shop_products (show_in_configurator_result, result_display_order);
