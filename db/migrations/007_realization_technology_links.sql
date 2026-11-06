-- Apply in Neon only after reviewing real project evidence.
-- This migration adds optional verified material/system relationships to realizacje.
-- Legacy rows remain valid: empty arrays mean "not verified", not "none used".
ALTER TABLE realizacje
  ADD COLUMN IF NOT EXISTS technology_links JSONB NOT NULL DEFAULT
    '{"systemSlugs":[],"usedMaterialIds":[],"equivalentShopProductIds":[]}'::jsonb;

-- Names are stable identifiers defined in lib/floor-system-catalog.ts.
-- Do NOT populate this column by heuristics over realization titles/tags.
-- Example after checking the actual project materials:
-- UPDATE realizacje
-- SET technology_links = '{"systemSlugs":["..."],"usedMaterialIds":["..."],"equivalentShopProductIds":[]}'::jsonb
-- WHERE slug = 'confirmed-realization-slug';
