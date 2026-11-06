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
      <p className="text-sm font-medium text-primary">{manufacturers[system.manufacturerId].name}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{system.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{system.summary}</p>
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
          Wybór systemu wymaga aktualnej dokumentacji technicznej oraz oględzin podłoża.
          Nie należy traktować samych nazw materiałów jako instrukcji mieszania lub wykonywania warstw.
        </p>
      </section>
      {exampleMaterials.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Przykładowe materiały z oferty producenta</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">Wskazane produkty służą do poznania asortymentu. Nie oznacza to, że wszystkie tworzą wspólnie zatwierdzony system lub były wykorzystane podczas konkretnej realizacji.</p>
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
