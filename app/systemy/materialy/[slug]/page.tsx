import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { catalogMaterials, catalogSystems, getCatalogMaterial, brands } from "@/lib/floor-system-catalog";
import { absoluteUrl } from "@/lib/site-config";
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogMaterials.map(material => ({ slug: material.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const material = getCatalogMaterial(slug);
  if (!material) return { title: "Nie znaleziono materiału" };
  return {
    title: `${material.name} — informacje o materiale`,
    description: material.description,
    alternates: { canonical: absoluteUrl(`/systemy/materialy/${slug}`) },
    // These concise reference cards are not full commercial or technical product pages yet.
    robots: { index: false, follow: true },
  };
}
export default async function MaterialPage({ params }: Props) {
  const { slug } = await params;
  const material = getCatalogMaterial(slug);
  if (!material) notFound();
  const related = catalogSystems.filter(system => system.exampleMaterialIds.includes(material.id));
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <nav aria-label="Ścieżka nawigacji" className="mb-7 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Strona główna</Link> / <Link href="/systemy" className="hover:underline">Systemy</Link> / {material.name}
      </nav>
      <p className="text-sm font-medium text-primary">{brands[material.brandId].name}</p>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">{material.name}</h1>
      <p className="mt-5 text-lg leading-relaxed">{material.description}</p>
      {material.isConcept && (
        <p className="mt-5 max-w-3xl rounded-xl border p-5 text-sm leading-relaxed text-muted-foreground">
          To projekt karty produktu należącego do samodzielnej marki EPOVIO.
          Formulacja, wytwórca kontraktowy oraz szczegółowe dane techniczne wymagają zatwierdzenia.
          Produkt nie jest jeszcze dostępny do kupienia.
        </p>
      )}
      {material.technicalFields && material.technicalFields.length > 0 && (
        <section className="mt-9" aria-labelledby="material-technical-fields">
          <h2 id="material-technical-fields" className="text-2xl font-semibold">Karta techniczna – dane w opracowaniu</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Układ dokumentacji EPOVIO; miejsca bez potwierdzonych danych oznaczyliśmy jako wymagające weryfikacji.
          </p>
          <dl className="mt-5 overflow-hidden rounded-xl border">
            {material.technicalFields.map((field, index) => (
              <div key={field.label} className={`grid gap-2 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6 ${index % 2 ? "bg-muted/40" : "bg-background"}`}>
                <dt className="font-semibold">{field.label}</dt>
                <dd className="text-sm text-muted-foreground">{field.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {material.referenceConsumption && (
        <section className="mt-9 rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Orientacyjne zużycie wg dokumentacji producenta</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{material.referenceConsumption}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Zużycie zależy od chłonności, chropowatości, grubości i wariantu wykończenia.
            Nie jest to gotowa wycena ani instrukcja wykonania kompletnego systemu.
          </p>
        </section>
      )}
      <section className="mt-9 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">{material.isConcept ? "Co będzie zawierać finalna dokumentacja?" : "Dokumentacja i dobór"}</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {material.isConcept
            ? "Po zatwierdzeniu produktu EPOVIO opublikujemy własną kartę techniczną: przeznaczenie, przygotowanie podłoża, proporcje mieszania, zużycie, aplikację, warunki utwardzania, parametry użytkowe, przechowywanie oraz wymagane informacje bezpieczeństwa. Do tego czasu ta strona nie jest instrukcją aplikacji ani ofertą sprzedaży."
            : "Właściwości, dopuszczalne zastosowania, przygotowanie podłoża, zużycie i zgodność z pozostałymi warstwami należy sprawdzić w aktualnej karcie technicznej producenta. Ta strona nie zastępuje dokumentacji, nie stanowi oferty sprzedaży ani potwierdzenia zastosowania materiału na konkretnej realizacji."}
        </p>
        {material.technicalSheetUrl && (
          <a href={material.technicalSheetUrl} target="_blank" rel="noopener noreferrer"
             className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">
            Otwórz oficjalną kartę techniczną producenta (PDF)
          </a>
        )}
      </section>
      {related.length > 0 && (
        <section className="mt-9">
          <h2 className="text-xl font-semibold">Powiązane grupy rozwiązań</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {related.map(system => <Link key={system.slug} className="rounded-lg border px-4 py-3 text-sm font-medium hover:border-primary" href={`/systemy/${system.slug}`}>{system.title}</Link>)}
          </div>
        </section>
      )}
      <p className="mt-9"><Link href="/kontakt" className="font-semibold text-primary hover:underline">Zapytaj o dobór materiału do inwestycji</Link></p>
    </main>
  );
}
