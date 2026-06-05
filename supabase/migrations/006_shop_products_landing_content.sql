-- Extend shop_products with rich landing page content blocks

ALTER TABLE shop_products
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS technical_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS application_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS faq_items JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE shop_products
SET
  technical_documents = COALESCE(technical_documents, '[]'::jsonb),
  application_steps = COALESCE(application_steps, '[]'::jsonb),
  faq_items = COALESCE(faq_items, '[]'::jsonb)
WHERE true;
