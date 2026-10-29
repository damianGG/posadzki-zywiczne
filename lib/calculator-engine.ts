/**
 * Single deterministic calculation engine shared by the public calculator and
 * read-only AI endpoints. No database, React or network dependencies.
 */
export type PriceRange = {
  min_m2: number;
  max_m2: number | null;
  price_per_m2: number;
  is_flat_rate?: boolean;
};

export type PricingSurface = { id: string; name: string; price_per_m2: number; price_ranges?: PriceRange[] };
export type PricingColor = { id: string; name: string; additional_price: number };
export type PricingConcrete = { id: string; name: string; additional_price: number };
export type PricingService = {
  id: string; name: string; price_per_m2?: number | null;
  price_per_mb?: number | null; price_fixed?: number | null;
  is_included_in_floor_price?: boolean;
};
export type CalculationParams = {
  area_m2: number;
  perimeter_m?: number;
  surface: PricingSurface;
  color: PricingColor;
  concrete?: PricingConcrete;
  services: PricingService[];
};
export type LineItem = {
  id: string; name: string; quantity: number; unit: "m2" | "mb" | "kpl" | "ryczalt";
  unit_price_pln: number; amount_pln: number;
  included_in_floor_price?: boolean;
};

const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
function nonnegative(value: number, description: string) {
  if (!Number.isFinite(value) || value < 0 || value > 10_000_000) {
    throw new Error("Nieprawidłowa stawka: " + description);
  }
  return value;
}

/** "known_subtotal_pln" excludes unknown linear services without a perimeter. */
export function calculateFloorEstimate(params: CalculationParams) {
  const { area_m2: area, perimeter_m: perimeter, surface, color, concrete, services } = params;
  if (!Number.isFinite(area) || area < 1 || area > 2500) throw new Error("Powierzchnia musi wynosić od 1 do 2500 m²");
  if (perimeter !== undefined && (!Number.isFinite(perimeter) || perimeter <= 0 || perimeter > 1000)) {
    throw new Error("Obwód musi być większy od 0 i nie przekraczać 1000 m");
  }
  const rows: LineItem[] = [];
  const ranges = surface.price_ranges || [];
  const range = ranges.find(r => area >= Number(r.min_m2) && (r.max_m2 === null || area <= Number(r.max_m2)));
  const flat = Boolean(range?.is_flat_rate);
  const unit = nonnegative(Number(range?.price_per_m2 ?? surface.price_per_m2), "powierzchnia");
  rows.push({
    id: "surface", name: surface.name, quantity: flat ? 1 : area, unit: flat ? "ryczalt" : "m2",
    unit_price_pln: unit, amount_pln: money(flat ? unit : area * unit),
  });
  const colorRate = nonnegative(Number(color.additional_price), "kolor");
  if (colorRate) rows.push({
    id: "color", name: color.name, quantity: area, unit: "m2",
    unit_price_pln: colorRate, amount_pln: money(area * colorRate),
  });
  if (concrete) {
    const concreteRate = nonnegative(Number(concrete.additional_price), "stan podłoża");
    if (concreteRate) rows.push({
      id: "concrete", name: concrete.name, quantity: area, unit: "m2",
      unit_price_pln: concreteRate, amount_pln: money(area * concreteRate),
    });
  }
  const missing: string[] = [];
  for (const service of services) {
    if (service.is_included_in_floor_price) {
      rows.push({
        id: service.id, name: service.name, quantity: 1, unit: "kpl",
        unit_price_pln: 0, amount_pln: 0, included_in_floor_price: true,
      });
      continue;
    }
    // Same precedence as existing web calculator: m² -> running meters -> fixed.
    if (service.price_per_m2 != null && Number(service.price_per_m2) > 0) {
      const rate = nonnegative(Number(service.price_per_m2), service.id);
      rows.push({ id: service.id, name: service.name, quantity: area,
        unit: "m2", unit_price_pln: rate, amount_pln: money(area * rate) });
    } else if (service.price_per_mb != null && Number(service.price_per_mb) > 0) {
      const rate = nonnegative(Number(service.price_per_mb), service.id);
      if (perimeter === undefined) {
        missing.push(service.id);
      } else {
        rows.push({ id: service.id, name: service.name, quantity: perimeter,
          unit: "mb", unit_price_pln: rate, amount_pln: money(perimeter * rate) });
      }
    } else if (service.price_fixed != null && Number(service.price_fixed) > 0) {
      const rate = nonnegative(Number(service.price_fixed), service.id);
      rows.push({ id: service.id, name: service.name, quantity: 1,
        unit: "kpl", unit_price_pln: rate, amount_pln: money(rate) });
    }
  }
  const known = money(rows.reduce((sum, item) => sum + item.amount_pln, 0));
  const complete = missing.length === 0;
  return {
    currency: "PLN" as const,
    area_m2: area,
    perimeter_m: perimeter ?? null,
    items: rows,
    known_subtotal_pln: known,
    total_pln: complete ? known : null,
    price_per_m2_pln: complete ? money(known / area) : null,
    complete,
    missing_information: missing.length
      ? [{ field: "perimeter_m", reason: "Podaj obwód pomieszczenia w mb, aby doliczyć wybrane cokoły lub uszczelnienia." }]
      : [],
    disclaimer: "Wycena orientacyjna, niewiążąca. Wymaga potwierdzenia stanu i wilgotności podłoża, zakresu robót, terminu, dojazdu oraz zasad naliczenia VAT.",
  };
}
