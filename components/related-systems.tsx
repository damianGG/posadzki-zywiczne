import Link from "next/link";
import { systemsForApplication, type SystemApplication } from "@/lib/floor-system-catalog";

export default function RelatedSystems({ application, title = "Systemy posadzkowe do porównania" }: { application: SystemApplication; title?: string }) {
  const systems = systemsForApplication(application).filter(system => !system.isConcept);
  if (!systems.length) return null;
  return (
    <section className="mt-12" aria-labelledby={`systems-${application}`}>
      <h2 id={`systems-${application}`} className="text-2xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Poznaj rozwiązania do tego zastosowania. Ostateczny układ warstw wybieramy po ocenie podłoża
        i aktualnej dokumentacji producenta.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {systems.map(system => (
          <Link key={system.slug} href={`/systemy/${system.slug}`} className="rounded-xl border p-5 hover:border-primary">
            <h3 className="font-semibold">{system.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{system.summary}</p>
          </Link>
        ))}
      </div>
      <Link href="/systemy" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">Pełny katalog systemów</Link>
    </section>
  );
}
