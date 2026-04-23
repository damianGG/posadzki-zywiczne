-- Magazyn i projekty: rejestr zużycia materiałów

CREATE TABLE IF NOT EXISTS magazyn_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quantity_available NUMERIC NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projekty_material_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  material_id UUID NOT NULL REFERENCES magazyn_materials(id) ON DELETE RESTRICT,
  quantity_used NUMERIC NOT NULL CHECK (quantity_used > 0),
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_magazyn_materials_active ON magazyn_materials(is_active, name);
CREATE INDEX IF NOT EXISTS idx_project_usage_project_name ON projekty_material_usage(project_name, usage_date DESC);
CREATE INDEX IF NOT EXISTS idx_project_usage_material_id ON projekty_material_usage(material_id);

ALTER TABLE magazyn_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE projekty_material_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access to magazyn_materials"
  ON magazyn_materials FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to projekty_material_usage"
  ON projekty_material_usage FOR ALL
  USING (auth.role() = 'service_role');

-- Funkcja transakcyjna: dodaje wpis zużycia i odejmuje stan magazynowy
CREATE OR REPLACE FUNCTION register_project_material_usage(
  p_project_name TEXT,
  p_material_id UUID,
  p_quantity_used NUMERIC,
  p_usage_date DATE DEFAULT CURRENT_DATE,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  current_stock NUMERIC;
  new_usage_id UUID;
BEGIN
  IF p_project_name IS NULL OR btrim(p_project_name) = '' THEN
    RAISE EXCEPTION 'Nazwa projektu jest wymagana';
  END IF;

  IF p_quantity_used IS NULL OR p_quantity_used <= 0 THEN
    RAISE EXCEPTION 'Ilość zużycia musi być większa od 0';
  END IF;

  SELECT quantity_available
  INTO current_stock
  FROM magazyn_materials
  WHERE id = p_material_id
    AND is_active = true
  FOR UPDATE;

  IF current_stock IS NULL THEN
    RAISE EXCEPTION 'Materiał nie istnieje lub jest nieaktywny';
  END IF;

  IF current_stock < p_quantity_used THEN
    RAISE EXCEPTION 'Brak wystarczającej ilości materiału w magazynie';
  END IF;

  UPDATE magazyn_materials
  SET quantity_available = quantity_available - p_quantity_used,
      updated_at = NOW()
  WHERE id = p_material_id;

  INSERT INTO projekty_material_usage (project_name, material_id, quantity_used, usage_date, notes)
  VALUES (btrim(p_project_name), p_material_id, p_quantity_used, COALESCE(p_usage_date, CURRENT_DATE), NULLIF(btrim(p_notes), ''))
  RETURNING id INTO new_usage_id;

  RETURN new_usage_id;
END;
$$;
