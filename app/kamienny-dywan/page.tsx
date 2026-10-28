import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Droplets,
  Layers3, MapPin, Minus, PhoneCall, ShieldCheck, Sparkles, Sun, Waves,
} from "lucide-react";
import { stoneCities } from "@/lib/stone-cities";
import { absoluteUrl, SITE_PHONE, SITE_URL } from "@/lib/site-config";
import { generatePageMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { stoneCarpetGallery } from "@/lib/stone-carpet-gallery";

export const revalidate = 300;

export const metadata: Metadata = generatePageMetadata({
  title: "Kamienny dywan – taras, balkon i schody | Wykonanie",
  description:
    "Kamienny dywan z naturalnego kruszywa i żywicy: zalety, wady, pielęgnacja, hydroizolacja i cena. Wykonanie tarasów, balkonów i schodów. Poproś o wycenę.",
  path: "/kamienny-dywan",
});

const applications = [
  {
    number: "01", title: "Tarasy",
    description: "Naturalny wygląd i spójna nawierzchnia. Kluczowe są spadki, szczelna izolacja i wykończenie krawędzi.",
    detail: "Tarasy odsłonięte i zadaszone",
  },
  {
    number: "02", title: "Balkony",
    description: "Estetyka bez klasycznych fug. Detale przy progach, balustradach i okapnikach wymagają szczególnej uwagi.",
    detail: "Balkony i loggie",
  },
  {
    number: "03", title: "Schody zewnętrzne",
    description: "Ciągłość wizualna na stopniach i podstopnicach. Istotne są profile narożne oraz system do aplikacji pionowej.",
    detail: "Stopnie i podesty",
  },
  {
    number: "04", title: "Strefy wejściowe",
    description: "Wyrazista struktura i możliwość dopasowania barwy kamienia do elewacji oraz otoczenia budynku.",
    detail: "Wejścia i ciągi piesze",
  },
];

const advantages = [
  ["Naturalny, ponadczasowy wygląd", "Różne frakcje i odcienie kruszywa pozwalają dobrać wykończenie do architektury."],
  ["Powierzchnia bez klasycznych fug", "Jednolity wizualnie efekt bez siatki spoin charakterystycznej dla płytek."],
  ["Wyraźna faktura", "Struktura może poprawiać przyczepność w porównaniu z gładką nawierzchnią; jej parametry zależą od systemu."],
  ["Możliwość układania na detalach", "Dobrane spoiwo i technologia pozwalają wykańczać również stopnie, podesty i pionowe elementy."],
  ["Rozwiązania na zewnątrz", "Istnieją systemy z odpornym na UV spoiwem poliuretanowym, przeznaczone na tarasy i balkony."],
];

const limitations = [
  ["Pory mogą zbierać zabrudzenia", "Otwarta struktura utrudnia dokładne usuwanie piasku, pyłu i plam. Nie jest tak łatwa w myciu jak gładka powłoka."],
  ["Warstwa dekoracyjna to nie izolacja", "Na tarasie nad pomieszczeniem i na balkonie zwykle potrzebna jest osobna, kompatybilna hydroizolacja."],
  ["Podłoże decyduje o trwałości", "Wilgoć, rysy, słaba wylewka lub błędne dylatacje mogą doprowadzić do uszkodzeń."],
  ["Nie każda żywica znosi słońce", "Trzeba potwierdzić odporność UV spoiwa, a także dopuszczalną temperaturę i warunki aplikacji."],
  ["Krawędzie i naprawy wymagają precyzji", "Miejscowe poprawki mogą pozostać widoczne; schody, cokoły i obróbki zwiększają pracochłonność."],
];

const workStages = [
  {
    number: "01", title: "Diagnoza podłoża",
    description: "Ocena nośności, wilgotności, pęknięć, spadków i detali. Nie zamykamy wilgoci pod nową nawierzchnią.",
  },
  {
    number: "02", title: "Przygotowanie i zabezpieczenia",
    description: "Naprawy, przygotowanie mechaniczne, gruntowanie i — tam, gdzie wymagane — kompatybilna hydroizolacja.",
  },
  {
    number: "03", title: "Wykonanie kamiennego dywanu",
    description: "Dobór kruszywa oraz spoiwa, mieszanie zgodnie z kartą techniczną i równomierne rozprowadzenie masy.",
  },
  {
    number: "04", title: "Detale i odbiór",
    description: "Krawędzie, dylatacje i wykończenie połączeń. Termin użytkowania zależy od utwardzenia danego systemu.",
  },
];

const faqs = [
  {
    q: "Czy kamienny dywan przepuszcza wodę?",
    a: "Wersja otwartoporowa przepuszcza wodę przez przestrzenie między ziarnami. To nie oznacza, że można zrezygnować z hydroizolacji balkonu lub tarasu. Woda musi zostać bezpiecznie odprowadzona po zaprojektowanym układzie warstw.",
  },
  {
    q: "Czy kamienny dywan jest antypoślizgowy?",
    a: "Kruszywo nadaje powierzchni fakturę, ale o klasie antypoślizgowości decyduje konkretny przebadany system. Podczas mrozu i oblodzenia żadna faktura nie gwarantuje ochrony przed poślizgiem.",
  },
  {
    q: "Czy kamienny dywan można położyć na starych płytkach?",
    a: "Zależy od ich przyczepności, stabilności, wilgotności warstw pod spodem i stanu hydroizolacji. Płytki odspojone lub przykrywające mokrą wylewkę wymagają wcześniejszego usunięcia i napraw.",
  },
  {
    q: "Kamienny dywan czy płytki — co wybrać?",
    a: "Kamienny dywan daje wygląd kruszywa bez tradycyjnych fug i dobrze komponuje się z detalami architektonicznymi. Płytki zwykle łatwiej czyścić. W obu rozwiązaniach na balkonie kluczowa pozostaje prawidłowa hydroizolacja i odprowadzenie wody.",
  },
  {
    q: "Czy nawierzchnia nadaje się na podjazd?",
    a: "Nie należy zakładać tego na podstawie samej nazwy. Niektóre systemy są przewidziane do ruchu pojazdów, inne wyłącznie do ruchu pieszego. Konieczny jest dobór na podstawie deklarowanych obciążeń i dokumentacji systemu.",
  },
  {
    q: "Ile kosztuje kamienny dywan za m²?",
    a: "Nie ma jednej uczciwej ceny dla każdej powierzchni. Znaczenie mają wielkość i geometria, przygotowanie podłoża, hydroizolacja, rodzaj kruszywa i spoiwa, liczba stopni oraz detale. Najlepiej przesłać metraż i zdjęcia do wstępnej wyceny.",
  },
];

const crumbs = getBreadcrumbSchema([
  { name: "Strona główna", url: SITE_URL },
  { name: "Kamienny dywan", url: absoluteUrl("/kamienny-dywan") },
]);

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": absoluteUrl("/kamienny-dywan#service"),
  name: "Wykonanie kamiennego dywanu",
  serviceType: "Kamienny dywan na taras, balkon i schody",
  description:
    "Wykonanie kamiennego dywanu z naturalnego kruszywa i żywicy po doborze systemu, ocenie podłoża i hydroizolacji.",
  provider: { "@id": SITE_URL + "/#organization" },
  url: absoluteUrl("/kamienny-dywan"),
  areaServed: [
    { "@type": "AdministrativeArea", name: "Podkarpackie" },
    { "@type": "City", name: "Kraków" },
  ],
};

function structuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function SectionEyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={"mb-4 text-xs font-bold uppercase tracking-[0.25em] " + (light ? "text-zinc-300" : "text-muted-foreground")}>{children}</p>;
}

export default function StoneCarpetPage() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(serviceSchema) }} />

      <div className="border-b border-border bg-background">
        <nav aria-label="Ścieżka nawigacji" className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-4 text-xs text-muted-foreground md:px-8">
          <Link href="/" className="hover:text-foreground hover:underline">Strona główna</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Kamienny dywan</span>
        </nav>
      </div>

      <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
        <div className="absolute -left-32 -top-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
          <div>
            <span className="inline-flex rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.17em] text-zinc-300">
              Naturalne kruszywo · Żywica · Precyzja
            </span>
            <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-[1.06] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Kamienny dywan.{" "}
              <span className="mt-2 block font-normal italic text-zinc-300">Piękno natury</span>{" "}
              <span className="block">pod stopami.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-300">
              Efektowna nawierzchnia na tarasy, balkony i schody.
              Naturalny kamień połączony żywicą tworzy charakterystyczną, szlachetną strukturę —
              ale trwałość zaczyna się od tego, czego nie widać: podłoża i prawidłowych warstw.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/kontakt" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200">
                Poproś o wycenę <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a href={"tel:" + SITE_PHONE} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold transition hover:bg-white/10">
                <PhoneCall className="h-4 w-4" /> 507 384 619
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-5 border-t border-white/15 pt-6 text-sm text-zinc-300">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-zinc-300" /> Bez klasycznych fug</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-zinc-300" /> Naturalna struktura</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-zinc-300" /> Indywidualny dobór systemu</span>
            </div>
          </div>


          <div className="relative mx-auto w-full max-w-[530px] lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-800 shadow-2xl shadow-black/30">
              <Image
                src="/kamienny-dywan/schody-kamienny-dywan-realizacja.webp"
                alt="Schody wejściowe wykończone ciemnoszarą dekoracyjną nawierzchnią z kruszywa i żywicy"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/35 to-transparent p-6 pt-28 text-white sm:p-8 sm:pt-32">
                <p className="text-xs font-semibold uppercase tracking-[0.17em] text-zinc-200">Zdjęcie realizacji</p>
                <p className="mt-2 text-2xl font-semibold">Schody wejściowe</p>
                <p className="mt-2 max-w-sm text-sm text-zinc-200">Ciemnoszara nawierzchnia z kruszywa i żywicy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 text-sm text-muted-foreground md:grid-cols-3 md:px-8">
          <div className="flex items-center gap-3"><Layers3 className="h-5 w-5 text-muted-foreground" /><span>Naturalne kruszywo związane żywicą</span></div>
          <div className="flex items-center gap-3"><Sun className="h-5 w-5 text-muted-foreground" /><span>Spoiwa zewnętrzne dobierane pod UV</span></div>
          <div className="flex items-center gap-3"><Droplets className="h-5 w-5 text-muted-foreground" /><span>Osobna analiza hydroizolacji i odpływu wody</span></div>
        </div>
      </section>

      <section id="zastosowania" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-3xl">
          <SectionEyebrow>Gdzie się sprawdza</SectionEyebrow>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Jedna technologia. <span className="text-muted-foreground">Wiele możliwości.</span></h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Kamienny dywan jest dekoracyjną warstwą wykończeniową z kruszywa i spoiwa.
            Odpowiedni system może sprawdzić się zarówno na płaskiej powierzchni,
            jak i na schodach — po dobraniu warstw do przeznaczenia.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {applications.map(item => (
            <article key={item.number} className="group relative overflow-hidden rounded-3xl border border-border bg-white p-8 transition-colors hover:border-foreground/40 md:p-9">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-semibold tracking-widest text-muted-foreground">{item.number} / {item.detail}</span>
                <span className="rounded-full bg-muted/60 p-3 text-muted-foreground"><ArrowUpRight className="h-5 w-5" /></span>
              </div>
              <h3 className="mt-10 text-3xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{item.description}</p>
              <div className="mt-9 h-[2px] w-16 bg-zinc-400 transition-all group-hover:w-28" />
            </article>
          ))}
        </div>
      </section>

      <section id="zalety-i-wady" className="bg-muted/70 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionEyebrow>Bez marketingowych obietnic</SectionEyebrow>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Kamienny dywan — <span className="text-muted-foreground">zalety i wady</span>
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            To rozwiązanie z charakterem, lecz nie do każdej sytuacji. Pokażemy Ci
            zarówno mocne strony, jak i ograniczenia, które warto znać przed zamówieniem.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-zinc-950 p-7 text-white sm:p-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="rounded-full bg-white/10 p-3"><Check className="h-6 w-6 text-zinc-300" /></span>
                <h3 className="text-2xl font-semibold">Co przemawia za?</h3>
              </div>
              <ul className="space-y-6">
                {advantages.map(([title, description]) => (
                  <li key={title} className="border-t border-white/15 pt-5">
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">{description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-border bg-background p-7 sm:p-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="rounded-full bg-muted p-3"><Minus className="h-6 w-6 text-muted-foreground" /></span>
                <h3 className="text-2xl font-semibold">O czym trzeba pamiętać?</h3>
              </div>
              <ul className="space-y-6">
                {limitations.map(([title, description]) => (
                  <li key={title} className="border-t border-border pt-5">
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionEyebrow>Wybór systemu</SectionEyebrow>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Otwarte pory czy <span className="text-muted-foreground">zamknięta struktura?</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Wygląd to nie wszystko. Struktura kamiennego dywanu wpływa na sposób
            odprowadzania wody, czyszczenie i wybór miejsca zastosowania.
          </p>
          <div className="mt-8 space-y-5">
            <div className="border-l-4 border-zinc-500 pl-5">
              <h3 className="text-lg font-semibold">Struktura otwartoporowa</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Woda może przepływać między ziarnami, a zabrudzenia osiadać w porach.
                Na balkonie potrzebna jest zgodna z systemem izolacja pod nawierzchnią
                i właściwie zaprojektowane odprowadzenie wody.
              </p>
            </div>
            <div className="border-l-4 border-zinc-300 pl-5">
              <h3 className="text-lg font-semibold">Pory wypełnione lub zamknięte</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Dodatkowe wypełnienie może ułatwić sprzątanie, ale zmienia
                przepuszczalność i właściwości nawierzchni. Nie każdy wypełniacz
                nadaje się na zewnątrz — trzeba sprawdzić zalecenia producenta.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] bg-muted p-6 sm:p-10">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Schemat poglądowy układu</p>
          <div className="space-y-2">
            {[
              { number: "04", title: "Kruszywo + właściwe spoiwo", detail: "Widoczna warstwa dekoracyjna", color: "bg-zinc-400" },
              { number: "03", title: "Warstwa sczepna / systemowy grunt", detail: "Zgodnie z instrukcją producenta", color: "bg-zinc-400" },
              { number: "02", title: "Hydroizolacja – gdy wymagana", detail: "Na balkonach i tarasach chroniących konstrukcję", color: "bg-zinc-600" },
              { number: "01", title: "Ocenione i przygotowane podłoże", detail: "Nośność, wilgotność, spadki, dylatacje", color: "bg-zinc-700" },
            ].map(layer => (
              <div key={layer.number} className="flex items-center gap-4 rounded-xl bg-white/75 p-4">
                <span aria-hidden="true" className={"h-12 w-2 flex-none rounded-full " + layer.color} />
                <span className="w-8 text-xs font-semibold text-muted-foreground">{layer.number}</span>
                <div>
                  <p className="font-semibold">{layer.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{layer.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            Schemat jest uproszczeniem, nie projektem wykonawczym. Kolejność i liczba warstw zależą od dopuszczonego systemu oraz rodzaju podłoża.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionEyebrow light>Realizacja krok po kroku</SectionEyebrow>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">Dobry efekt zaczyna się <span className="text-zinc-300">pod powierzchnią.</span></h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workStages.map(stage => (
              <div key={stage.number} className="border-t border-white/25 pt-5">
                <p className="text-sm font-semibold text-zinc-300">{stage.number}</p>
                <h3 className="mt-6 text-xl font-semibold">{stage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="galeria" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-3xl">
            <SectionEyebrow>Galeria realizacji</SectionEyebrow>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Zobacz kamienny dywan <span className="text-muted-foreground">w praktyce.</span></h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Każde zdjęcie prezentujemy jako osobną kartę portfolio. Kadry mogą pochodzić z tej samej inwestycji. Poniżej pokazujemy schody, wejścia i tarasy z Rzeszowa i okolic.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stoneCarpetGallery.map((photo, index) => (
            <figure key={photo.id} className="group overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md">
              <a
                href={photo.src}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Powiększ zdjęcie: ${photo.title}`}
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.035]"
                    priority={index === 0}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                    Realizacja {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </a>
              <figcaption className="p-5">
                <h3 className="text-base font-semibold leading-snug text-foreground">{photo.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{photo.caption}</p>
                {photo.location && (
                  <p className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {photo.location}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          Zdjęcia balkonów z innych systemów żywicznych znajdziesz w <Link href="/realizacje" className="font-semibold underline underline-offset-4 hover:text-foreground">portfolio firmy</Link>.
          Nie oznaczamy ich jako realizacji kamiennego dywanu.
        </p>
      </section>

      <section id="koszt" className="border-y border-border bg-muted/70 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionEyebrow>Wycena bez niespodzianek</SectionEyebrow>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Ile kosztuje <span className="text-muted-foreground">kamienny dywan?</span></h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Sama cena mieszanki kruszywa z żywicą nie oddaje kosztu całej
              realizacji. Dużą część budżetu może stanowić renowacja podłoża,
              hydroizolacja oraz detale przy schodach i balustradach.
            </p>
            <Link href="/kontakt" className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 font-semibold text-white transition hover:bg-zinc-800">
              Wyślij zdjęcia do wyceny <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-9">
            <h3 className="text-xl font-semibold">Co wpływa na wycenę?</h3>
            <ul className="mt-6 space-y-4">
              {[
                "Powierzchnia, geometria i liczba stopni",
                "Stan betonu, stare powłoki i zakres napraw",
                "Hydroizolacja, spadki i odwodnienie",
                "Rodzaj kruszywa oraz spoiwa odpornego na warunki użytkowania",
                "Cokoły, progi, okapniki i dylatacje",
              ].map(factor => (
                <li key={factor} className="flex gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-muted-foreground" />
                  <span className="leading-relaxed text-muted-foreground">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionEyebrow>Użytkowanie i pielęgnacja</SectionEyebrow>
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Naturalny efekt wymaga <span className="text-muted-foreground">rozsądnej pielęgnacji.</span></h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Na otwartoporowej nawierzchni systematycznie usuwaj piasek, liście
            i zabrudzenia, zanim zalegną między ziarnami. Myj zgodnie z instrukcją
            producenta — bez agresywnej chemii i bez mechanicznego uszkadzania spoiwa.
            Zimą zachowaj ostrożność przy oblodzeniu.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Jeśli priorytetem jest bardzo szybkie mycie gładkiej podłogi, poznaj też
            {" "}<Link href="/posadzki-zywiczne-na-balkony" className="font-semibold text-foreground underline underline-offset-4">inne systemy żywiczne na balkony i tarasy</Link>.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Waves, title: "Regularnie usuwaj piasek", body: "Zanieczyszczenia mogą zbierać się w porach i działać ściernie." },
            { icon: Droplets, title: "Kontroluj odpływ wody", body: "Spadki, obróbki i odwodnienie powinny pozostać drożne." },
            { icon: Sun, title: "Dobierz spoiwo do UV", body: "Odporność na słońce wynika z konkretnego produktu i systemu." },
            { icon: Sparkles, title: "Czyść delikatnie", body: "Stosuj środki i metody wskazane w dokumentacji wykonanej nawierzchni." },
          ].map(item => (
            <div key={item.title} className="rounded-2xl border border-border bg-white p-6">
              <item.icon className="h-7 w-7 text-muted-foreground" />
              <h3 className="mt-5 font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-muted/60 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <SectionEyebrow>Najczęstsze pytania</SectionEyebrow>
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Warto wiedzieć <span className="text-muted-foreground">przed decyzją.</span></h2>
          <div className="mt-9 divide-y divide-border border-y border-border">
            {faqs.map((faq, index) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex gap-4"><span className="text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 flex-none text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="ml-9 mt-4 max-w-2xl leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionEyebrow>Obszar obsługi</SectionEyebrow>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">Kamienny dywan na Podkarpaciu</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          Obsługiwane miejscowości i poradniki o wyzwaniach wykonawczych.
          Nie jest to wykaz oddziałów ani potwierdzenie zrealizowanych inwestycji w każdym mieście.
        </p>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {stoneCities.map(city => (
            <li key={city.slug}>
              <Link href={"/kamienny-dywan/" + city.slug} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white p-4 text-sm font-semibold transition hover:border-foreground/40">
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{city.name}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-zinc-950 px-7 py-14 text-white sm:px-12 md:py-20 lg:px-20">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[55px] border-white/10" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-300">Porozmawiajmy o Twojej powierzchni</p>
          <h2 className="relative mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">Masz taras, balkon lub schody do wykończenia?</h2>
          <p className="relative mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Prześlij orientacyjny metraż, zdjęcia i informację o istniejących warstwach.
            Doradzimy, czy kamienny dywan ma sens w Twoim przypadku i co trzeba uwzględnić w wycenie.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link href="/kontakt" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-zinc-950 transition hover:bg-zinc-200">
              Poproś o wycenę <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a href={"tel:" + SITE_PHONE} className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 font-semibold hover:bg-white/10">
              <PhoneCall className="h-4 w-4" /> Zadzwoń
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
