import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircuitBoard, Factory, FlaskConical, ShieldCheck, Zap } from "lucide-react";
import { absoluteUrl, SITE_PHONE, SITE_URL } from "@/lib/site-config";
import { generatePageMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = generatePageMetadata({
  title: "Posadzki elektrostatyczne ESD | Przewodzące i antystatyczne",
  description: "Specjalistyczne posadzki elektrostatyczne ESD do hal, elektroniki i laboratoriów. Systemy przewodzące i rozpraszające, uziemienie, pomiary i wycena.",
  path: "/posadzki-elektrostatyczne",
  keywords: "posadzki elektrostatyczne, posadzki ESD, posadzki antyelektrostatyczne, posadzki antystatyczne, posadzki przewodzące",
});

const applications = [
  {
    title: "Elektronika i strefy EPA",
    text: "Stanowiska produkcji i montażu elektroniki, obszary ochrony elementów wrażliwych na wyładowania ESD.",
    icon: CircuitBoard,
  },
  {
    title: "Hale i zakłady przemysłowe",
    text: "Procesy technologiczne, w których wymagane jest kontrolowane odprowadzanie ładunków oraz odpowiednia odporność mechaniczna.",
    icon: Factory,
  },
  {
    title: "Laboratoria i pomieszczenia kontrolowane",
    text: "Powierzchnie o wymaganiach dotyczących czystości, utrzymania i parametrów elektrostatycznych całego systemu.",
    icon: FlaskConical,
  },
];

const steps = [
  ["01", "Analiza wymagań", "Ustalamy przeznaczenie obiektu, oczekiwany zakres rezystancji, wymagania inwestora i sposób weryfikacji."],
  ["02", "Ocena i przygotowanie podłoża", "Sprawdzamy stan, wilgotność i nośność betonu, a także dylatacje oraz istniejące powłoki."],
  ["03", "Dobór i wykonanie systemu", "Dobieramy kompatybilny grunt, warstwę przewodzącą, połączenia uziemiające i warstwę użytkową."],
  ["04", "Kontrola parametrów", "Zakres pomiarów rezystancji i odbioru ustalamy względem specyfikacji projektu i odpowiedniej metody badawczej."],
];

const questions = [
  {
    question: "Czym różni się posadzka ESD od zwykłej posadzki epoksydowej?",
    answer: "Posadzka ESD jest elementem zaprojektowanego systemu ochrony przed wyładowaniami elektrostatycznymi. Sam standardowy epoksyd nie zapewnia wymaganych właściwości. Potrzebne są odpowiednio dobrane warstwy, połączenia do uziemienia oraz ocena parametrów gotowej posadzki.",
  },
  {
    question: "Czy posadzka przewodząca i rozpraszająca to to samo?",
    answer: "Nie. Systemy przewodzące i rozpraszające mają inne charakterystyki rezystancji. Wybór wynika z zastosowania oraz wymagań projektu, a nie wyłącznie z nazwy produktu.",
  },
  {
    question: "Czy sama posadzka ESD wystarczy do spełnienia wymagań strefy EPA?",
    answer: "Nie zawsze. W obszarach EPA istotna jest także kompatybilność obuwia, stanowisk pracy, połączeń wyrównawczych oraz procedur kontroli ESD. Posadzkę należy oceniać w kontekście całego systemu ochrony.",
  },
  {
    question: "Czy posadzka elektrostatyczna jest automatycznie odpowiednia do stref ATEX?",
    answer: "Nie. Przy zagrożeniu wybuchem obowiązują wymagania wynikające z oceny ryzyka i projektu instalacji. Dobór posadzki musi uwzględniać konkretną strefę, warunki eksploatacji i wymagane badania.",
  },
];

export default function PosadzkiElektrostatycznePage() {
  const url = absoluteUrl("/posadzki-elektrostatyczne");
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": url + "#service",
    name: "Posadzki elektrostatyczne i posadzki ESD",
    serviceType: "Wykonanie posadzek elektrostatycznych ESD",
    description: "Projektowy dobór i wykonanie posadzek żywicznych o kontrolowanych parametrach elektrostatycznych.",
    url,
    provider: { "@id": SITE_URL + "/#organization" },
    areaServed: { "@type": "Country", name: "Polska" },
  };
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Strona główna", url: SITE_URL },
    { name: "Posadzki elektrostatyczne", url },
  ]);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <div className="border-b bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4 py-4 text-sm">
          <nav aria-label="Ścieżka nawigacji" className="text-muted-foreground">
            <Link href="/" className="hover:underline">Strona główna</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span aria-current="page">Posadzki elektrostatyczne</span>
          </nav>
        </div>
      </div>

      <header className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-800 py-16 text-white md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm text-slate-200">
            <Zap className="h-4 w-4" aria-hidden="true" />
            Specjalistyczne systemy ESD
          </div>
          <h1 className="mt-7 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Posadzki elektrostatyczne ESD
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-200 md:text-xl">
            Posadzki żywiczne przewodzące i rozpraszające ładunki elektrostatyczne
            dla przemysłu, elektroniki i pomieszczeń o szczególnych wymaganiach.
            Dobieramy rozwiązanie do parametrów projektu, warunków pracy i sposobu odbioru.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kontakt" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-zinc-950 hover:bg-slate-200">
              Zapytaj o wycenę ESD <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={"tel:" + SITE_PHONE} className="inline-flex items-center rounded-lg border border-white/50 px-6 py-3 font-semibold hover:bg-white/10">
              Porozmawiaj z wykonawcą
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-300">
            Zakres rezystancji i wymagania dotyczące badań potwierdzamy indywidualnie dla każdego projektu.
          </p>
        </div>
      </header>

      <section className="container mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Zastosowania</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold">Gdzie stosuje się posadzki antyelektrostatyczne?</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {applications.map((item) => (
            <article key={item.title} className="rounded-2xl border bg-background p-7">
              <item.icon className="h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Technologia</p>
          <h2 className="mt-3 text-3xl font-bold">Przewodzące, rozpraszające i ESD – właściwy dobór ma znaczenie</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-background p-7">
              <h3 className="text-xl font-semibold">Posadzki przewodzące (ECF)</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Systemy o obniżonej rezystancji, zaprojektowane do odprowadzania ładunków.
                Ich parametry muszą odpowiadać wymaganiom technicznym obiektu i właściwej metodzie badania.
              </p>
            </div>
            <div className="rounded-xl border bg-background p-7">
              <h3 className="text-xl font-semibold">Posadzki rozpraszające (DIF/ESD)</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Systemy umożliwiające kontrolowane rozpraszanie ładunków.
                Przy ochronie personelu należy uwzględnić również układ człowiek–obuwie–posadzka,
                a nie tylko wynik pomiaru samej nawierzchni.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border bg-background p-7">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-semibold">Normy i kontrola jakości</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Przy projektowaniu i odbiorze analizujemy wymagania PN-EN IEC 61340-5-1
                  oraz metody badań z rodziny IEC 61340, w tym IEC 61340-4-1 i IEC 61340-4-5.
                  Dokładny zestaw badań, wartości granicznych i dokumentów ustala specyfikacja inwestycji.
                  Nie deklarujemy zgodności jedynie na podstawie nazwy żywicy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Jak realizujemy posadzki ESD?</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {steps.map(([number, title, description]) => (
            <div key={number} className="flex gap-5 rounded-xl border p-6">
              <span className="text-2xl font-bold text-primary">{number}</span>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl border-l-4 border-primary bg-muted/40 p-6">
          <p className="leading-relaxed">
            <strong>Ważne:</strong> system ESD to nie tylko warstwa wierzchnia. O skuteczności
            decydują także przygotowanie podłoża, prawidłowe uziemienie i kompatybilność
            wszystkich elementów systemu. W strefach ATEX wymagania weryfikujemy odrębnie.
          </p>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">Najczęstsze pytania o posadzki elektrostatyczne</h2>
          <dl className="mt-8 grid max-w-4xl gap-5">
            {questions.map((item) => (
              <div key={item.question} className="rounded-xl border bg-background p-6">
                <dt className="font-semibold">{item.question}</dt>
                <dd className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl bg-zinc-900 px-7 py-10 text-white md:px-12 md:py-14">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">Potrzebujesz posadzki z określoną rezystancją?</h2>
            <p className="mt-4 leading-relaxed text-slate-200">
              Prześlij wymagania projektowe, oczekiwaną rezystancję, powierzchnię,
              lokalizację oraz informacje o podłożu. Przeanalizujemy możliwy system
              i przygotujemy indywidualną ofertę.
            </p>
            <Link href="/kontakt" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-zinc-900 hover:bg-slate-200">
              Wyślij zapytanie techniczne <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-6 text-sm">
          <Link href="/blog/posadzki-zywiczne-antystatyczne" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Poradnik o posadzkach antystatycznych
          </Link>
          <Link href="/pomieszczenia-czyste" className="font-medium text-primary hover:underline">
            Posadzki do pomieszczeń czystych
          </Link>
          <Link href="/realizacje" className="font-medium text-primary hover:underline">
            Zobacz nasze realizacje
          </Link>
        </div>
      </section>
    </main>
  );
}
