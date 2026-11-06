import type { Realizacja } from "@/types/realizacje";
import { catalogSystems, getCatalogMaterial, getCatalogSystem, systemsForApplication, type SystemApplication } from "@/lib/floor-system-catalog";

/**
 * Explicit, auditable attribution. Never infer materials used from category,
 * brand mentions, tags or photos. Fill a record only from documented job data.
 *
 * A record can also come from Realizacja.technologyLinks (Neon/CMS).
 */
export interface TechnologyLinks {
  systemSlugs: string[];
  usedMaterialIds: string[];
  /** Commercial equivalents for DIY, not presented as products actually used. */
  equivalentShopProductIds?: string[];
}
export const documentedRealizationMaterials: Record<string, TechnologyLinks> = {};

export function resolveTechnologyLinks(realization: Realizacja) {
  const relation = realization.technologyLinks ?? documentedRealizationMaterials[realization.slug];
  const documentedSystems = (relation?.systemSlugs ?? []).map(getCatalogSystem).filter((system): system is NonNullable<typeof system> => Boolean(system));
  const usedMaterials = (relation?.usedMaterialIds ?? []).map(getCatalogMaterial).filter((material): material is NonNullable<typeof material> => Boolean(material));
  const suggestedCategory: Partial<Record<Realizacja["category"], SystemApplication>> = {
    garaze: "garaze", "balkony-tarasy": "balkony", "pomieszczenia-czyste": "hale",
  };
  const application = suggestedCategory[realization.category];
  const suggestedSystems = application ? systemsForApplication(application).filter(system => !documentedSystems.some(documented => documented.slug === system.slug)) : [];
  return { documentedSystems, usedMaterials, suggestedSystems, equivalentShopProductIds: relation?.equivalentShopProductIds ?? [] };
}

export function realizationsForSystem(realizations: Realizacja[], slug: string): Realizacja[] {
  if (!catalogSystems.some(system => system.slug === slug)) return [];
  return realizations.filter(realization => {
    const relation = realization.technologyLinks ?? documentedRealizationMaterials[realization.slug];
    return relation?.systemSlugs.includes(slug) ?? false;
  });
}
