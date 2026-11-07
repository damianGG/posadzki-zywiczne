import Link from "next/link";
import type { Realizacja } from "@/types/realizacje";
import { brands } from "@/lib/floor-system-catalog";
import { resolveTechnologyLinks } from "@/lib/realization-materials";

/**
 * Render real attribution only when explicitly verified for this project.
 * Suggestions are visually and semantically separate from materials used.
 */
export default function RealizationTechnology({ realization }: { realization: Realizacja }) {
  const { documentedSystems, usedMaterials, suggestedSystems } = resolveTechnologyLinks(realization);
  if (!documentedSystems.length && !usedMaterials.length && !suggestedSystems.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="realization-systems-heading">
      <div className="rounded-2xl border bg-background p-6 md:p-8">
        <h2 id="realization-systems-heading" className="text-2xl font-bold">Technologia i materiały</h2>
        {documentedSystems.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Udokumentowane systemy</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {documentedSystems.map(system => (
                <Link key={system.slug} href={`/systemy/${system.slug}`} className="rounded-lg border px-4 py-3 text-sm font-medium hover:border-primary hover:text-primary">
                  {system.title}
                </Link>
              ))}
            </div>
          </div>
        )}
        {usedMaterials.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Materiały faktycznie wykorzystane</h3>
            <p className="mt-2 text-sm text-muted-foreground">Poniższe nazwy przypisujemy tylko na podstawie potwierdzonej dokumentacji wykonawczej.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {usedMaterials.map(material => (
                <Link key={material.id} href={`/systemy/materialy/${material.id}`} className="rounded-xl border p-4 hover:border-primary">
                  <p className="text-xs text-muted-foreground">{brands[material.brandId].name}</p>
                  <p className="mt-1 font-semibold">{material.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Zobacz kartę materiału</p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Nie publikujemy niepotwierdzonych nazw produktów użytych w tej realizacji.
            Szczegółowa lista materiałów zostanie dodana po weryfikacji dokumentacji.
          </p>
        )}
        {suggestedSystems.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold">Inne rozwiązania do tego typu zastosowania</h3>
            <p className="mt-2 text-sm text-muted-foreground">To propozycje do porównania, a nie lista materiałów zastosowanych w pokazanej realizacji.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {suggestedSystems.slice(0, 4).map(system => (
                <Link key={system.slug} href={`/systemy/${system.slug}`} className="rounded-lg border px-4 py-3 text-sm hover:border-primary hover:text-primary">
                  {system.title}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 border-t pt-5">
          <Link href="/systemy" className="text-sm font-semibold text-primary hover:underline">Poznaj katalog systemów posadzkowych</Link>
        </div>
      </div>
    </section>
  );
}
