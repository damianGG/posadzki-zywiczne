import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, PhoneCall } from "lucide-react"
import { stoneCities } from "@/lib/stone-cities"
import { absoluteUrl, SITE_PHONE } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Kamienny dywan na taras, balkon i schody | Podkarpackie",
  description: "Kamienny dywan z żywicy i naturalnego kruszywa. Poradnik: hydroizolacja, odwodnienie, schody, tarasy, dobór systemu i wycena na Podkarpaciu.",
  alternates: { canonical: absoluteUrl("/kamienny-dywan") },
  openGraph: { title: "Kamienny dywan na Podkarpaciu – poradnik", url: absoluteUrl("/kamienny-dywan") },
}
export default function StoneHub() {
  return <main className="mx-auto max-w-5xl px-4 py-12 md:py-20">
    <nav aria-label="Ścieżka nawigacji" className="mb-8 text-sm"><Link href="/" className="underline">Strona główna</Link> / Kamienny dywan</nav>
    <p className="text-sm font-semibold text-primary">Przewodnik techniczny i informacje o wycenie</p>
    <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">Kamienny dywan na taras, balkon i schody</h1>
    <p className="mt-6 max-w-3xl text-xl text-muted-foreground">Dekoracyjna nawierzchnia z naturalnego kruszywa i żywicy — sprawdź, kiedy się nadaje, jakie warstwy są potrzebne i na co uważać przy remoncie.</p>
    <div className="mt-8 flex flex-wrap gap-3"><Link className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground" href="/kontakt">Zapytaj o wycenę</Link><a className="flex items-center gap-2 rounded-md border px-5 py-3" href={`tel:${SITE_PHONE}`}><PhoneCall className="h-4 w-4" /> Zadzwoń</a></div>
    <article className="mt-14 space-y-10 leading-relaxed">
      <section><h2 className="mb-3 text-3xl font-semibold">Co to jest kamienny dywan?</h2><p>To kompozyt naturalnego kruszywa (np. marmurowego lub kwarcowego) i żywicy, układany jako warstwa nawierzchniowa. Może mieć strukturę otwartoporową, w której woda przesącza się między ziarnami, albo uzyskać powierzchnię bardziej zamkniętą dzięki dodatkowemu wypełnieniu. Różnice między systemami dotyczą spoiwa, grubości, wielkości kruszywa i przeznaczenia.</p><p className="mt-3">Na powierzchniach zewnętrznych szczególnie ważny jest dobór żywicy odpornej na UV i warunki pogodowe. Nie każda żywica epoksydowa, dobra do wnętrz, nadaje się na odsłonięty taras. Należy sprawdzić dokumentację konkretnego producenta.</p></section>
      <section><h2 className="mb-3 text-3xl font-semibold">Czy kamienny dywan zastępuje hydroizolację?</h2><p><strong>Nie w typowym układzie otwartoporowym.</strong> Warstwa kruszywa jest dekoracyjna i może przepuszczać wodę. Na balkonie i tarasie pod nią trzeba przewidzieć kompatybilną membranę hydroizolacyjną, spadki oraz detale kierujące wodę poza płytę. Nawet starannie zrobiony kamienny dywan nie naprawi przecieku przy balustradzie lub progu, jeśli źle wykonano uszczelnienie.</p></section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-5"><h3 className="mb-2 text-xl font-semibold">Taras</h3><p>Spadek, dylatacje, hydroizolacja i okapniki muszą współpracować z nawierzchnią. Stan wylewki pod starymi płytkami należy ocenić przed ofertą.</p></div>
        <div className="rounded-xl border p-5"><h3 className="mb-2 text-xl font-semibold">Balkon</h3><p>Połączenie przy progu, mocowania barierki i obróbka czoła płyty bywają trudniejsze niż sama aplikacja kruszywa.</p></div>
        <div className="rounded-xl border p-5"><h3 className="mb-2 text-xl font-semibold">Schody</h3><p>Nośne krawędzie, wysokości stopni, pionowe podstopnice i właściwe profile wymagają osobnego planowania.</p></div>
      </section>
      <section><h2 className="mb-3 text-3xl font-semibold">Jak przygotować się do wyceny?</h2><ol className="list-decimal space-y-3 pl-6"><li>Zmierz powierzchnię, cokoły oraz liczbę stopni.</li><li>Prześlij zdjęcia całej płyty i detali przy drzwiach, ścianach i balustradzie.</li><li>Opisz podłoże: beton, stare płytki, spękania, zawilgocenia.</li><li>Podaj przeznaczenie: wyłącznie ruch pieszy, schody, zadaszenie albo pełna ekspozycja.</li></ol><p className="mt-3">Cena za metr bez oceny tych elementów może wprowadzać w błąd. Wstępną ofertę doprecyzowuje się po analizie podłoża i zakresu niezbędnych obróbek.</p></section>
      <section><h2 className="mb-3 text-3xl font-semibold">Pielęgnacja i ograniczenia</h2><p>Strukturalna powierzchnia wymaga usuwania piasku i zanieczyszczeń, które przyspieszają ścieranie. W otwartych porach mogą osadzać się drobne zabrudzenia. Należy stosować zasady pielęgnacji producenta i nie zakładać całkowitej antypoślizgowości przy oblodzeniu. Kamienny dywan przeznaczony na taras nie jest automatycznie rozwiązaniem do podjazdu dla samochodów.</p></section>
      <section><h2 className="mb-3 text-3xl font-semibold">Kamienny dywan – miasta Podkarpacia</h2><p className="mb-5 text-muted-foreground">Poniżej opisujemy odrębne zagadnienia wykonawcze istotne przy zleceniach w miastach powyżej 10 tys. mieszkańców. Jest to wykaz obszaru zainteresowania ofertą, a nie lista oddziałów lub zrealizowanych inwestycji.</p><ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{stoneCities.map(city => <li key={city.slug}><Link className="flex items-center justify-between gap-2 rounded-lg border p-4 hover:border-primary hover:text-primary" href={`/kamienny-dywan/${city.slug}`}>Kamienny dywan {city.name}<ArrowRight className="h-4 w-4 shrink-0" /></Link></li>)}</ul></section>
      <section className="rounded-xl bg-muted/30 p-7"><h2 className="mb-2 text-2xl font-semibold">Wybierasz nawierzchnię na balkon lub taras?</h2><p className="mb-3">Porównaj kamienny dywan z innymi <Link className="text-primary underline" href="/posadzki-zywiczne-na-balkony">systemami żywicznymi na tarasy i balkony</Link> oraz przeczytaj o <Link className="text-primary underline" href="/blog/czy-posadzka-zywiczna-nadaje-sie-na-taras">doborze żywicy na zewnątrz</Link>.</p><Link href="/kontakt" className="font-semibold text-primary underline">Poproś o ocenę podłoża i wycenę</Link></section>
    </article>
  </main>
}
