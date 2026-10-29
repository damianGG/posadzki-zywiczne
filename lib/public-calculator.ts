import "server-only";
import { unstable_cache } from "next/cache";
import {
  getAllColors, getAllConcreteStates, getAllRoomTypes,
  getAllServices, getAllSurfaceTypes, getAllStepConfigs,
  type ColorOption, type ConcreteState, type RoomType,
  type Service, type SurfaceType, type StepConfig,
} from "@/lib/neon-calculator";
import { calculateFloorEstimate } from "@/lib/calculator-engine";

export class CalculatorInputError extends Error {
  constructor(message: string) { super(message); this.name = "CalculatorInputError"; }
}

type DatabaseCatalog = {
  surfaceTypes: SurfaceType[]; colors: ColorOption[]; services: Service[];
  roomTypes: RoomType[]; concreteStates: ConcreteState[]; stepConfigs: StepConfig[];
};

const catalogFromDatabase = unstable_cache(async (): Promise<DatabaseCatalog> => {
  const [s, c, a, r, b, steps] = await Promise.all([
    getAllSurfaceTypes(), getAllColors(), getAllServices(),
    getAllRoomTypes(), getAllConcreteStates(), getAllStepConfigs(),
  ]);
  if (![s, c, a, r, b, steps].every(v => v.success) ||
      !s.data?.length || !c.data?.length || !r.data?.length) {
    throw new Error("Cennik jest obecnie niedostępny.");
  }
  return {
    surfaceTypes: s.data, colors: c.data, services: a.data || [],
    roomTypes: r.data, concreteStates: b.data || [], stepConfigs: steps.data || [],
  };
}, ["public-calculator-v1"], { revalidate: 60 });

const numeric = (value: number | null | undefined) =>
  value == null ? null : Number(value);
const publicSurface = (s: SurfaceType) => ({
  id: s.type_id, name: s.name, description: s.description,
  price_per_m2: Number(s.price_per_m2),
  price_ranges: s.price_ranges || [],
});
const publicColor = (c: ColorOption) => ({
  id: c.color_id, name: c.name, ral_code: c.ral_code,
  additional_price: Number(c.additional_price),
});
const publicService = (s: Service) => ({
  id: s.service_id, name: s.name, description: s.description,
  price_per_m2: numeric(s.price_per_m2),
  price_per_mb: numeric(s.price_per_mb),
  price_fixed: numeric(s.price_fixed),
  is_default: Boolean(s.is_default), is_mandatory: Boolean(s.is_mandatory),
  is_included_in_floor_price: Boolean(s.is_included_in_floor_price),
});
export async function getPublicCalculatorOptions() {
  const config = await catalogFromDatabase();
  return {
    version: "1", currency: "PLN", source: "aktualny cennik posadzkizywiczne.com",
    rooms: config.roomTypes.filter(x => x.is_available !== false).map(x => ({ id: x.room_id, name: x.name })),
    surfaces: config.surfaceTypes.filter(x => x.is_active !== false).map(publicSurface),
    colors: config.colors.filter(x => x.is_active !== false).map(publicColor),
    concrete_states: config.concreteStates.map(x => ({
      id: x.state_id, name: x.name, additional_price: Number(x.additional_price),
    })),
    services: config.services.filter(x => x.is_active !== false).map(publicService),
    steps: {
      concrete_state_required_for_garage: config.stepConfigs.find(x => x.step_id === "concrete_state")?.is_visible !== false,
    },
    note: "Stawki są orientacyjne; wynik może wymagać obwodu, oględzin i potwierdzenia podatku VAT.",
  };
}
function requiredString(value: unknown, name: string) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_\-ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]{1,100}$/.test(value)) {
    throw new CalculatorInputError("Nieprawidłowy identyfikator: " + name);
  }
  return value;
}
function amount(value: unknown, name: string, min: number, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    throw new CalculatorInputError(name + " musi być liczbą od " + min + " do " + max);
  }
  return value;
}
export async function createPublicEstimate(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new CalculatorInputError("Oczekiwano obiektu JSON.");
  }
  const input = body as Record<string, unknown>;
  const area = amount(input.area_m2, "area_m2", 1, 2500);
  const perimeter = input.perimeter_m === undefined || input.perimeter_m === null
    ? undefined : amount(input.perimeter_m, "perimeter_m", 0.01, 1000);
  const roomId = requiredString(input.room_id, "room_id");
  const surfaceId = requiredString(input.surface_id, "surface_id");
  const colorId = requiredString(input.color_id, "color_id");
  const concreteId = input.concrete_state_id == null ? null : requiredString(input.concrete_state_id, "concrete_state_id");
  const serviceIds = input.service_ids == null ? null : input.service_ids;
  if (serviceIds !== null && (!Array.isArray(serviceIds) || serviceIds.length > 30 ||
      serviceIds.some(x => typeof x !== "string" || x.length > 100))) {
    throw new CalculatorInputError("service_ids musi być listą maksymalnie 30 identyfikatorów.");
  }
  const catalog = await catalogFromDatabase();
  const room = catalog.roomTypes.find(x => x.room_id === roomId && x.is_available !== false);
  const surface = catalog.surfaceTypes.find(x => x.type_id === surfaceId && x.is_active !== false);
  const color = catalog.colors.find(x => x.color_id === colorId && x.is_active !== false);
  const garageRequiresConcrete = roomId === "garaz-piwnica" &&
    catalog.stepConfigs.find(x => x.step_id === "concrete_state")?.is_visible !== false;
  const concrete = concreteId == null ? undefined : catalog.concreteStates.find(x => x.state_id === concreteId);
  if (!room || !surface || !color || (concreteId !== null && !concrete)) {
    throw new CalculatorInputError("Wybrano niedostępną opcję. Odczytaj ponownie aktualną listę opcji.");
  }
  if (garageRequiresConcrete && !concrete) {
    throw new CalculatorInputError("Podaj concrete_state_id dla garażu.");
  }
  const activeServices = catalog.services.filter(x => x.is_active !== false);
  const requested = new Set<string>((serviceIds ?? activeServices.filter(x => x.is_default).map(x => x.service_id)) as string[]);
  if ([...requested].some(id => !activeServices.some(x => x.service_id === id))) {
    throw new CalculatorInputError("Wybrano niedostępną usługę. Odczytaj ponownie listę opcji.");
  }
  activeServices.forEach(x => { if (x.is_mandatory) requested.add(x.service_id); });
  const chosenServices = activeServices.filter(x => requested.has(x.service_id));
  const calculation = calculateFloorEstimate({
    area_m2: area, perimeter_m: perimeter,
    surface: {
      id: surface.type_id, name: surface.name,
      price_per_m2: Number(surface.price_per_m2), price_ranges: surface.price_ranges || [],
    },
    color: { id: color.color_id, name: color.name, additional_price: Number(color.additional_price) },
    concrete: concrete ? {
      id: concrete.state_id, name: concrete.name, additional_price: Number(concrete.additional_price),
    } : undefined,
    services: chosenServices.map(x => ({
      id: x.service_id, name: x.name,
      price_per_m2: numeric(x.price_per_m2),
      price_per_mb: numeric(x.price_per_mb),
      price_fixed: numeric(x.price_fixed),
      is_included_in_floor_price: x.is_included_in_floor_price,
    })),
  });
  return {
    ...calculation,
    room: { id: room.room_id, name: room.name },
    surface: { id: surface.type_id, name: surface.name },
    color: { id: color.color_id, name: color.name },
    concrete_state: concrete ? { id: concrete.state_id, name: concrete.name } : null,
    service_ids: chosenServices.map(x => x.service_id),
    estimate_status: calculation.complete ? "orientacyjna" : "wymaga_uzupelnienia",
    calculator_url: "https://www.posadzkizywiczne.com/kalkulator",
    contact_url: "https://www.posadzkizywiczne.com/kontakt",
    is_binding_offer: false,
  };
}
