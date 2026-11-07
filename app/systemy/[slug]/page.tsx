import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { catalogSystems, getCatalogMaterial, getCatalogSystem, manufacturers } from "@/lib/floor-system-catalog";
import { getAllRealizacje } from "@/lib/realizacje";
import { realizationsForSystem } from "@/lib/realization-materials";
import { absoluteUrl } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;
export function generateStaticParams() {
  return catalogSystems.map(system => ({ slug: system.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const system = getCatalogSystem(slug);
  if (!system) return { title: "System nie został znaleziony" };
  return {
    title: `${system.title} | Systemy posadzek żywicznych`,
    description: system.summary,
    alternates: { canonical: absoluteUrl(`/systemy/${slug}`) },
    ...(system.isConcept ? { robots: { index: false, follow: true } } : {}),
  };
}
export default async function SystemDetailsPage({ params }: Props) {
  const { slug } = await params;
  const system = getCatalogSystem(slug);
  if (!system) notFound();
  const projects = realizationsForSystem(await getAllRealizacje(), system.slug).slice(0, 6);
  const exampleMaterials = system.exampleMaterialIds.map(getCatalogMaterial).filter((material): material is NonNullable<typeof material> => Boolean(material));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <nav aria-label="Ścieżka nawigacji" className="mb-7 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Strona główna</Link> / <Link href="/systemy" className="hover:underline">Systemy</Link> / {system.title}
      </nav>
      <p className="text-sm font-medium text-primary">{manufacturers[system.manufacturerId].name}{system.isConcept ? " · system w opracowaniu" : ""}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{system.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{system.summary}</p>
      {system.isConcept && (
        <p className="mt-5 max-w-3xl rounded-lg border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          EPOVIO Garage to opracowywana przez nas koncepcja wykonawcza wykorzystująca oryginalne
          produkty Sicon. Ich karty techniczne są dostępne poniżej, ale łączna specyfikacja systemu,
          receptura wariantów i komplet zestawu DIY wymagają jeszcze zatwierdzenia. Nie prowadzimy sprzedaży.
        </p>
      )}
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href={system.serviceHref} className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90">Zobacz ofertę wykonawczą</Link>
        <Link href="/kontakt" className="rounded-lg border px-5 py-3 font-medium hover:border-primary">Zapytaj o dobór systemu</Link>
      </div>
      <section className="mt-12 max-w-4xl">
        <h2 className="text-2xl font-semibold">Co trzeba sprawdzić przed wyborem?</h2>
        <ul className="mt-5 list-disc space-y-3 pl-6 text-muted-foreground">
          {system.selectionCriteria.map(item => <li key={item}>{item}</li>)}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          {system.isConcept
            ? "Proponowana kolejność warstw nie jest deklaracją producenta Sicon o kompatybilności wybranej pary materiałów. Ostateczną recepturę, międzywarstwy i warunki aplikacji zatwierdzimy po weryfikacji. To nie jest instrukcja wykonawcza ani oferta handlowa."
            : "Wybór systemu wymaga aktualnej dokumentacji technicznej oraz oględzin podłoża. Nie należy traktować samych nazw materiałów jako instrukcji mieszania lub wykonywania warstw."}
        </p>
      </section>
      {system.proposedLayers && system.proposedLayers.length > 0 && (
        <section className="mt-12" aria-labelledby="epovio-layers">
          <h2 id="epovio-layers" className="text-2xl font-semibold">Proponowana budowa systemu EPOVIO Garage</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Układ opracowany na podstawie przeznaczenia materiałów GF-E Premium i RR100-E oraz systemów
            kwarcowych Sicon. Stanowi propozycję do potwierdzenia, a nie zatwierdzoną recepturę.
          </p>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {system.proposedLayers.map(layer => {
              const material = layer.materialId ? getCatalogMaterial(layer.materialId) : undefined;
              return (
                <li key={layer.title} className="rounded-xl border p-5">
                  <h3 className="font-semibold">{layer.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{layer.description}</p>
                  {material && (
                    <Link href={`/systemy/materialy/${material.id}`} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                      Zobacz kartę materiału: {material.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="mt-6 rounded-xl bg-muted/40 p-5">
            <h3 className="font-semibold">Karty techniczne producenta Sicon</h3>
            <p className="mt-2 text-sm text-muted-foreground">Dane o zużyciu dotyczą poszczególnych produktów, nie zatwierdzonego kompletnego zestawu EPOVIO.</p>
            <div className="mt-3 flex flex-wrap gap-4">
              {exampleMaterials.filter(material => Boolean(material.technicalSheetUrl)).map(material => (
                <a key={material.id} href={material.technicalSheetUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                  {material.name} — PDF Sicon
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
      {system.pendingValidation && system.pendingValidation.length > 0 && (
        <section className="mt-12 rounded-xl border p-6" aria-labelledby="epovio-validation">
          <h2 id="epovio-validation" className="text-xl font-semibold">Co trzeba jeszcze zatwierdzić?</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {system.pendingValidation.map(item => <li key={item}>{item}</li>)}
          </ul>
        </section>
      )}
      {system.plannedOffer && system.plannedOffer.length > 0 && (
        <section className="mt-12" aria-labelledby="epovio-variants">
          <h2 id="epovio-variants" className="text-2xl font-semibold">Planowane warianty EPOVIO</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Poniższe zestawy są na razie szkicami w Shopify. Choć wskazujemy komponenty bazowe Sicon,
            nie ustalono jeszcze ostatecznych ilości w opakowaniu, receptur kompletnych wariantów,
            cen ani możliwości zakupu.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {system.plannedOffer.map(offer => (
              <article key={offer.name} className="rounded-xl border p-5">
                <h3 className="font-semibold">{offer.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{offer.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      {exampleMaterials.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">{system.isConcept ? "Materiały bazowe Sicon" : "Przykładowe materiały z oferty producenta"}</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            {system.isConcept
              ? "Są to produkty Sicon wybrane jako podstawa koncepcji EPOVIO Garage. Nie oznacza to, że producent zatwierdził ich użycie jako jednego kompletnego systemu."
              : "Wskazane produkty służą do poznania asortymentu. Nie oznacza to, że wszystkie tworzą wspólnie zatwierdzony system lub były wykorzystane podczas konkretnej realizacji."}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exampleMaterials.map(material => (
              <Link key={material.id} href={`/systemy/materialy/${material.id}`} className="rounded-xl border p-5 hover:border-primary">
                <h3 className="font-semibold">{material.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{material.description}</p>
                <span className="mt-4 inline-block text-sm font-medium text-primary">Poznaj materiał</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="mt-12 border-t pt-9">
        <h2 className="text-2xl font-semibold">Realizacje potwierdzające zastosowanie</h2>
        {projects.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <Link key={project.slug} href={`/realizacje/${project.slug}`} className="rounded-xl border p-5 hover:border-primary">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{project.location} · {project.details.surface}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Nie przypisaliśmy jeszcze żadnej realizacji do tego rozwiązania na podstawie zweryfikowanej dokumentacji.
            Nie publikujemy niepotwierdzonych powiązań materiałowych.
          </p>
        )}
      </section>
      <p className="mt-10"><Link href="/systemy" className="font-semibold text-primary hover:underline">Wszystkie systemy posadzkowe</Link></p>
    </main>
  );
}
