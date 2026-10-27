import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, ArrowRight } from "lucide-react"
import { stoneCities, findStoneCity } from "@/lib/stone-cities"
import { absoluteUrl } from "@/lib/site-config"

interface Props { params: Promise<{ city: string }> }
export const dynamicParams = false
export function generateStaticParams() { return stoneCities.map(({ slug }) => ({ city: slug })) }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const record = findStoneCity(city)
  if (!record) return { robots: { index: false }, title: "Nie znaleziono miasta" }
  const title = `Kamienny dywan ${record.name} | Tarasy, schody, wycena`
  const description = `Kamienny dywan ${record.name}: jak przygotować taras, schody lub balkon? Wymagania podłoża, hydroizolacja, praktyczne wskazówki i kontakt w sprawie wyceny.`
  return { title, description, alternates: { canonical: absoluteUrl(`/kamienny-dywan/${record.slug}`) }, openGraph: { title, description, url: absoluteUrl(`/kamienny-dywan/${record.slug}`) } }
}

export default async function StoneCarpetCityPage({ params }: Props) {
  const { city: citySlug } = await params
  const city = findStoneCity(citySlug)
  if (!city) notFound()
  const nearby = city.nearby.map(findStoneCity).filter((value): value is NonNullable<typeof value> => Boolean(value))
  return <main className="mx-auto max-w-4xl px-4 py-12 md:py-20">
    <nav aria-label="Ścieżka nawigacji" className="mb-8 text-sm text-muted-foreground"><Link href="/" className="underline">Strona główna</Link> / <Link href="/kamienny-dywan" className="underline">Kamienny dywan</Link> / {city.name}</nav>
    <article>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><MapPin className="h-4 w-4" /> Podkarpackie / {city.name}</p>
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Kamienny dywan {city.name}</h1>
      <p className="mt-5 text-lg text-muted-foreground">Poradnik: {city.focus.toLowerCase()} {city.locative} i zakres prac przed wykonaniem nawierzchni.</p>
      <div className="prose prose-lg mt-10 max-w-none dark:prose-invert prose-a:text-primary">
        <h2>Kamienny dywan {city.locative} — najważniejszy przypadek</h2><p>{city.scenario}</p>
        <h2>Na co uważać przed montażem?</h2><p>{city.warning}</p>
        <p>Kamienny dywan to warstwa dekoracyjna z kruszywa połączonego żywicą. W otwartoporowej wersji woda może przechodzić przez ziarna. Dlatego na odsłoniętych płytach balkonów i tarasów istotna jest odrębna, kompatybilna hydroizolacja, spadek oraz uszczelnione krawędzie. Nie należy przykrywać wilgotnego, słabego podłoża bez jego diagnozy. <Link href="/kamienny-dywan">Zobacz pełny poradnik o technologii kamiennego dywanu</Link>.</p>
        <h2>Co wpływa na wycenę?</h2><p>Metraż jest punktem wyjścia, ale na koszt składają się także przygotowanie podłoża, prace przy progach, stopniach, dylatacjach i system ochrony przed wodą. Przed kontaktem przygotuj kilka zdjęć z różnych stron, przybliżone wymiary oraz informację o istniejącej okładzinie i ewentualnych przeciekach. Rzetelny dobór materiałów powinien bazować na karcie technicznej systemu.</p>
        <h2>{city.question}</h2><p>{city.answer}</p>
        <p>Jeżeli porównujesz kilka sposobów wykończenia, zobacz też <Link href="/posadzki-zywiczne-na-balkony">systemy żywiczne na balkon i taras</Link> oraz poradnik <Link href="/blog/czy-posadzka-zywiczna-nadaje-sie-na-taras">o posadzkach żywicznych na zewnątrz</Link>. Rodzaj żywicy i przygotowanie podłoża mają znaczenie dla żywotności całej powierzchni.</p>
      </div>
      <section className="mt-10 rounded-xl border p-7">
        <h2 className="text-2xl font-semibold">Wyceń kamienny dywan {city.locative}</h2>
        <p className="my-3 text-muted-foreground">Opisz nawierzchnię i prześlij zdjęcia. Dobór systemu i termin ustalamy po analizie warunków zlecenia; nie deklarujemy lokalnego oddziału ani nieudokumentowanych realizacji.</p>
        <Link href="/kontakt" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground">Przejdź do kontaktu <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </article>
    <aside className="mt-12 border-t pt-8" aria-label="Powiązane lokalizacje"><h2 className="mb-4 text-lg font-semibold">Sprawdź pobliskie miasta</h2><ul className="flex flex-wrap gap-3">{nearby.map(c => <li key={c.slug}><Link href={`/kamienny-dywan/${c.slug}`} className="rounded-md border px-4 py-2 hover:border-primary">{c.name}</Link></li>)}<li><Link href="/kamienny-dywan" className="rounded-md border px-4 py-2 hover:border-primary">Pozostałe miasta</Link></li></ul></aside>
  </main>
}
