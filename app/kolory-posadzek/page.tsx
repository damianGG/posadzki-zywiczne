import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { fallbackShopConfiguratorConfig } from "@/data/shop-configurator-fallback"
import { getAllRealizacje } from "@/lib/realizacje"

export const metadata: Metadata = {
  title: "Kolory posadzek żywicznych | Wzornik i inspiracje",
  description: "Zobacz dostępne kolory posadzek żywicznych, płatki dekoracyjne i realizacje. Dobierz odcień do garażu, domu lub balkonu.",
  alternates: { canonical: "/kolory-posadzek" },
}

const colorUses: Record<string, string> = {
  "light-gray": "Jasne garaże, piwnice i pomieszczenia, w których zależy Ci na optycznym rozjaśnieniu.",
  "medium-gray": "Uniwersalny wybór do garażu i kotłowni — praktyczny na co dzień.",
  graphite: "Nowoczesne garaże i wnętrza; dobrze podkreśla architekturę, ale częściej pokazuje jasny kurz.",
  beige: "Domy, kuchnie i salony, gdy posadzka ma tworzyć cieplejsze, spokojniejsze tło.",
  custom: "Kolor spoza standardowego wzornika — ustalimy go indywidualnie przed realizacją.",
}

export default async function ColorsPage() {
  const projects = await getAllRealizacje()
  const projectImages = projects
    .filter((project) => project.images.main)
    .slice(0, 4)

  return (
    <main>
      <section className="bg-zinc-950 py-20 text-white md:py-28">
        <div className="container mx-auto max-w-5xl px-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-300">Wzornik kolorów</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">Kolory posadzek żywicznych</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Wybierz bazowy odcień, płatki dekoracyjne i wykończenie dopasowane do garażu, domu lub balkonu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="#wzornik">Zobacz wzornik</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-zinc-950">
              <Link href="/kontakt?temat=prosba-o-wzornik-kolorow">Poproś o wzornik</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="wzornik" className="py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Standardowe kolory bazowe</h2>
            <p className="mt-3 leading-7 text-zinc-600">Kolor na ekranie ma charakter orientacyjny. Przed zamówieniem potwierdzimy wybór na fizycznej próbce lub wzorniku.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackShopConfiguratorConfig.floor_colors.map((color) => (
              <article key={color.id} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
                <div className="h-32" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{color.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{colorUses[color.id]}</p>
                  <Button asChild variant="link" className="mt-4 h-auto px-0">
                    <Link href={`/sklep?kolor=${color.id}`}>Wybierz w konfiguratorze</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Płatki dekoracyjne</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-600">Płatki tworzą bardziej dekoracyjny efekt, pomagają maskować drobne zabrudzenia i są dostępne w kilku zestawieniach kolorystycznych.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackShopConfiguratorConfig.flake_colors.map((color) => (
              <div key={color.id} className="rounded-2xl border border-zinc-200 bg-white p-5">
                <div className="flex h-12 overflow-hidden rounded-xl">
                  {color.swatch_colors.map((swatch) => <span key={swatch} className="flex-1" style={{ backgroundColor: swatch }} />)}
                </div>
                <h3 className="mt-4 font-semibold">{color.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {projectImages.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Kolory w naszych realizacjach</h2>
            <p className="mt-3 leading-7 text-zinc-600">Zobacz rzeczywisty efekt w różnych pomieszczeniach i warunkach oświetlenia.</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {projectImages.map((project) => (
                <Link key={project.slug} href={`/realizacje/${project.slug}`} className="group overflow-hidden rounded-2xl border border-zinc-200">
                  <div className="relative aspect-square"><Image src={project.images.main} alt={project.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" /></div>
                  <div className="p-4"><p className="font-medium">{project.details.color || project.title}</p></div>
                </Link>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-8"><Link href="/galeria">Przejdź do galerii z filtrami</Link></Button>
          </div>
        </section>
      )}

      <section className="bg-zinc-950 py-16 text-white md:py-24">
        <div className="container mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-2">
          <div><h2 className="text-3xl font-bold">Jak wybrać kolor?</h2><p className="mt-4 leading-7 text-zinc-300">Jasne odcienie rozświetlają wnętrze, grafit daje wyrazisty efekt, ale mocniej pokazuje jasny pył. W garażu warto rozważyć płatki lub chropowate wykończenie, jeśli zależy Ci na maskowaniu śladów i lepszej antypoślizgowości.</p></div>
          <div className="space-y-4 text-zinc-300"><p><strong className="text-white">UV i balkony:</strong> do miejsc nasłonecznionych dobieramy system odporny na promieniowanie UV.</p><p><strong className="text-white">Nietypowy odcień:</strong> sprawdzimy dostępność i termin po konsultacji.</p><p><strong className="text-white">Próbka:</strong> fizyczny wzornik pozwala ocenić kolor w świetle docelowego pomieszczenia.</p></div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold">Pytania o kolory</h2>
          <div className="mt-8 space-y-4">
            {[
              ["Czy mogę zamówić niestandardowy kolor?", "Tak. Wyślij nam preferowany odcień, a potwierdzimy dostępność systemu i termin."],
              ["Czy kolor ze zdjęcia będzie identyczny?", "Nie zawsze — ekran, światło i wykończenie wpływają na odbiór. Dlatego przed decyzją polecamy próbkę."],
              ["Czy posadzka może żółknąć?", "W miejscach narażonych na słońce stosujemy odpowiedni system i warstwę odporną na UV."],
            ].map(([question, answer]) => <details key={question} className="rounded-2xl border border-zinc-200 p-5"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 leading-7 text-zinc-600">{answer}</p></details>)}
          </div>
          <Button asChild size="lg" className="mt-10"><Link href="/kontakt?temat=prosba-o-wzornik-kolorow">Zamów próbkę lub poproś o wzornik</Link></Button>
        </div>
      </section>
    </main>
  )
}
