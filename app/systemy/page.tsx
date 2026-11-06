import type { Metadata } from "next";
import Link from "next/link";
import { catalogSystems, manufacturers, type ManufacturerId } from "@/lib/floor-system-catalog";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Systemy posadzek żywicznych Sika, Flowcrete, Sto i Sicon",
  description: "Dobór systemów posadzek żywicznych do garaży, parkingów, hal, balkonów i ESD. Porównaj zastosowania oraz wymagania i zobacz materiały producentów.",
  alternates: { canonical: absoluteUrl("/systemy") },
};
const manufacturerIds: ManufacturerId[] = ["sika", "flowcrete", "sto", "sicon"];

export default function SystemsIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <nav aria-label="Ścieżka nawigacji" className="mb-7 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">Strona główna</Link> / Systemy
      </nav>
      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Systemy posadzek żywicznych</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Poznaj rozwiązania producentów Sika, Flowcrete, Sto i Sicon. Najpierw wybierz zastosowanie,
        a następnie sprawdź warunki techniczne, które decydują o doborze warstw.
      </p>
      <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
        Ten katalog pomaga porównywać technologie. Nie jest gotową recepturą wykonania posadzki:
        zgodność warstw, zużycie i parametry potwierdzamy dla kompletnego systemu według aktualnych dokumentów producenta.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {manufacturerIds.map(id => (
          <section key={id} id={id} className="scroll-mt-28 rounded-2xl border p-6">
            <h2 className="text-2xl font-semibold">{manufacturers[id].name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{manufacturers[id].description}</p>
            <ul className="mt-5 space-y-3">
              {catalogSystems.filter(system => system.manufacturerId === id).map(system => (
                <li key={system.slug}>
                  <Link href={`/systemy/${system.slug}`} className="block rounded-lg border p-4 transition-colors hover:border-primary">
                    <span className="font-semibold">{system.title}</span>
                    <span className="mt-2 block text-sm text-muted-foreground">{system.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="mt-12 rounded-2xl bg-muted/50 p-6 md:p-8">
        <h2 className="text-2xl font-semibold">Zacznij od pomieszczenia, nie od nazwy żywicy</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">Inny zestaw wymagań dotyczy garażu, a inny parkingu na stropie czy posadzki ESD. Przejdź do usługi, aby zobaczyć proces i zakres prac.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {[
            { label: "Garaże", href: "/garaze" },
            { label: "Parkingi", href: "/parkingi" },
            { label: "Hale i magazyny", href: "/hale-magazyny" },
            { label: "Posadzki ESD", href: "/posadzki-elektrostatyczne" },
            { label: "Balkony i tarasy", href: "/posadzki-zywiczne-na-balkony" },
          ].map(item => <Link key={item.href} href={item.href} className="rounded-lg border bg-background px-4 py-3 text-sm font-medium hover:border-primary">{item.label}</Link>)}
        </div>
      </section>
    </main>
  );
}
