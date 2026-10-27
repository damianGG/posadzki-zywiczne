import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Droplets, Images,
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

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#8b6941]">{children}</p>;
}

export default function StoneCarpetPage() {
  return (
    <main className="overflow-hidden bg-[#f9f7f2] text-[#192820]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(serviceSchema) }} />

      <div className="border-b border-[#dcd8cf] bg-[#f9f7f2]">
        <nav aria-label="Ścieżka nawigacji" className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-4 text-xs text-[#655f55] md:px-8">
          <Link href="/" className="hover:text-[#1d4436] hover:underline">Strona główna</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Kamienny dywan</span>
        </nav>
      </div>

      <section className="relative isolate overflow-hidden bg-[#162b23] text-[#f7f4eb]">
        <div className="absolute -left-32 -top-40 h-96 w-96 rounded-full bg-[#a2a07c]/10 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-[#b88b5f]/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
          <div>
            <span className="inline-flex rounded-full border border-[#d2bd94]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.17em] text-[#e1c9a2]">
              Naturalne kruszywo · Żywica · Precyzja
            </span>
            <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-[1.06] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Kamienny dywan.
              <span className="mt-2 block font-normal italic text-[#e0c69e]">Piękno natury</span>
              <span className="block">pod stopami.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#d6d9ce]">
              Efektowna nawierzchnia na tarasy, balkony i schody.
              Naturalny kamień połączony żywicą tworzy charakterystyczną, szlachetną strukturę —
              ale trwałość zaczyna się od tego, czego nie widać: podłoża i prawidłowych warstw.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/kontakt" className="inline-flex items-center gap-2 rounded-full bg-[#e9d0a6] px-7 py-3.5 text-sm font-bold text-[#1a2a20] transition hover:bg-white">
                Poproś o wycenę <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a href={"tel:" + SITE_PHONE} className="inline-flex items-center gap-2 rounded-full border border-[#dae0d4]/40 px-6 py-3.5 text-sm font-semibold transition hover:bg-white/10">
                <PhoneCall className="h-4 w-4" /> 507 384 619
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-5 border-t border-white/15 pt-6 text-sm text-[#c1c9bc]">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#e2c796]" /> Bez klasycznych fug</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#e2c796]" /> Naturalna struktura</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#e2c796]" /> Indywidualny dobór systemu</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[530px] lg:max-w-none" aria-label="Dekoracyjna wizualizacja struktury kruszywa; nie jest zdjęciem realizacji">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[#cab99f] p-4 shadow-2xl shadow-black/30 sm:p-7">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundColor: "#c9b89c",
                  backgroundImage: [
                    "radial-gradient(ellipse 18px 14px at 14% 19%, #8e8577 98%, transparent 100%)",
                    "radial-gradient(ellipse 19px 15px at 43% 27%, #eee2ce 98%, transparent 100%)",
                    "radial-gradient(ellipse 17px 14px at 76% 15%, #a8a38e 98%, transparent 100%)",
                    "radial-gradient(ellipse 16px 13px at 32% 69%, #dcd3c3 98%, transparent 100%)",
                    "radial-gradient(ellipse 19px 14px at 83% 74%, #7e8174 98%, transparent 100%)",
                    "radial-gradient(ellipse 18px 14px at 61% 88%, #f4ead8 98%, transparent 100%)",
                  ].join(", "),
                  backgroundSize: "82px 76px",
                  transform: "rotate(-11deg) scale(1.2)",
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#253124]/60" aria-hidden="true" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="w-fit rounded-full border border-white/50 bg-[#17291e]/70 px-4 py-2 text-xs font-medium text-white backdrop-blur">
                  Wizualizacja struktury kruszywa
                </span>
                <div className="rounded-2xl border border-white/30 bg-[#17291e]/85 p-6 text-white backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8cfa4]">Wybierz charakter wykończenia</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">Kruszywo. Kolor. Faktura.</p>
                  <div className="mt-5 flex items-center gap-3" aria-hidden="true">
                    {["#e6d8bf", "#aba38c", "#77786c", "#bead96", "#d7c4a5"].map(color => (
                      <span key={color} className="h-7 w-7 rounded-full border-2 border-white/20 shadow-inner" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden rounded-xl bg-[#eee9dd] px-5 py-4 text-[#35473a] shadow-lg sm:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#91734b]">Galeria realizacji</p>
              <p className="mt-1 text-sm font-semibold">Twoje zdjęcia dodamy tutaj</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e5dfd2] bg-[#f1ede4]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 text-sm text-[#5c6057] md:grid-cols-3 md:px-8">
          <div className="flex items-center gap-3"><Layers3 className="h-5 w-5 text-[#8b6941]" /><span>Naturalne kruszywo związane żywicą</span></div>
          <div className="flex items-center gap-3"><Sun className="h-5 w-5 text-[#8b6941]" /><span>Spoiwa zewnętrzne dobierane pod UV</span></div>
          <div className="flex items-center gap-3"><Droplets className="h-5 w-5 text-[#8b6941]" /><span>Osobna analiza hydroizolacji i odpływu wody</span></div>
        </div>
      </section>

      <section id="zastosowania" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-3xl">
          <SectionEyebrow>Gdzie się sprawdza</SectionEyebrow>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Jedna technologia. <span className="text-[#8b6941]">Wiele możliwości.</span></h2>
          <p className="mt-5 text-lg leading-relaxed text-[#5a6258]">
            Kamienny dywan jest dekoracyjną warstwą wykończeniową z kruszywa i spoiwa.
            Odpowiedni system może sprawdzić się zarówno na płaskiej powierzchni,
            jak i na schodach — po dobraniu warstw do przeznaczenia.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {applications.map(item => (
            <article key={item.number} className="group relative overflow-hidden rounded-3xl border border-[#e1d9cb] bg-white p-8 transition-colors hover:border-[#b9a17c] md:p-9">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-semibold tracking-widest text-[#9d8665]">{item.number} / {item.detail}</span>
                <span className="rounded-full bg-[#f1ede4] p-3 text-[#806c4f]"><ArrowUpRight className="h-5 w-5" /></span>
              </div>
              <h3 className="mt-10 text-3xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-[#666e64]">{item.description}</p>
              <div className="mt-9 h-[2px] w-16 bg-[#c7ab7c] transition-all group-hover:w-28" />
            </article>
          ))}
        </div>
      </section>

      <section id="zalety-i-wady" className="bg-[#ece8df] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionEyebrow>Bez marketingowych obietnic</SectionEyebrow>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Kamienny dywan — <span className="text-[#8b6941]">zalety i wady</span>
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#5a6258]">
            To rozwiązanie z charakterem, lecz nie do każdej sytuacji. Pokażemy Ci
            zarówno mocne strony, jak i ograniczenia, które warto znać przed zamówieniem.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-[#1d3b30] p-7 text-white sm:p-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="rounded-full bg-white/10 p-3"><Check className="h-6 w-6 text-[#e6c997]" /></span>
                <h3 className="text-2xl font-semibold">Co przemawia za?</h3>
              </div>
              <ul className="space-y-6">
                {advantages.map(([title, description]) => (
                  <li key={title} className="border-t border-white/15 pt-5">
                    <p className="font-semibold text-[#f9f4e9]">{title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#c7d0c5]">{description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-[#ded4c5] bg-[#f9f7f2] p-7 sm:p-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="rounded-full bg-[#ede3d5] p-3"><Minus className="h-6 w-6 text-[#8b6941]" /></span>
                <h3 className="text-2xl font-semibold">O czym trzeba pamiętać?</h3>
              </div>
              <ul className="space-y-6">
                {limitations.map(([title, description]) => (
                  <li key={title} className="border-t border-[#e1d9cd] pt-5">
                    <p className="font-semibold text-[#26372d]">{title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#60675d]">{description}</p>
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
            Otwarte pory czy <span className="text-[#8b6941]">zamknięta struktura?</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#58645a]">
            Wygląd to nie wszystko. Struktura kamiennego dywanu wpływa na sposób
            odprowadzania wody, czyszczenie i wybór miejsca zastosowania.
          </p>
          <div className="mt-8 space-y-5">
            <div className="border-l-4 border-[#b5a17e] pl-5">
              <h3 className="text-lg font-semibold">Struktura otwartoporowa</h3>
              <p className="mt-2 leading-relaxed text-[#5a6259]">
                Woda może przepływać między ziarnami, a zabrudzenia osiadać w porach.
                Na balkonie potrzebna jest zgodna z systemem izolacja pod nawierzchnią
                i właściwie zaprojektowane odprowadzenie wody.
              </p>
            </div>
            <div className="border-l-4 border-[#6d806c] pl-5">
              <h3 className="text-lg font-semibold">Pory wypełnione lub zamknięte</h3>
              <p className="mt-2 leading-relaxed text-[#5a6259]">
                Dodatkowe wypełnienie może ułatwić sprzątanie, ale zmienia
                przepuszczalność i właściwości nawierzchni. Nie każdy wypełniacz
                nadaje się na zewnątrz — trzeba sprawdzić zalecenia producenta.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] bg-[#e7dfd1] p-6 sm:p-10">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#826846]">Schemat poglądowy układu</p>
          <div className="space-y-2">
            {[
              { number: "04", title: "Kruszywo + właściwe spoiwo", detail: "Widoczna warstwa dekoracyjna", color: "bg-[#a99b80]" },
              { number: "03", title: "Warstwa sczepna / systemowy grunt", detail: "Zgodnie z instrukcją producenta", color: "bg-[#bb986b]" },
              { number: "02", title: "Hydroizolacja – gdy wymagana", detail: "Na balkonach i tarasach chroniących konstrukcję", color: "bg-[#537b78]" },
              { number: "01", title: "Ocenione i przygotowane podłoże", detail: "Nośność, wilgotność, spadki, dylatacje", color: "bg-[#737a6e]" },
            ].map(layer => (
              <div key={layer.number} className="flex items-center gap-4 rounded-xl bg-white/75 p-4">
                <span aria-hidden="true" className={"h-12 w-2 flex-none rounded-full " + layer.color} />
                <span className="w-8 text-xs font-semibold text-[#8f856f]">{layer.number}</span>
                <div>
                  <p className="font-semibold">{layer.title}</p>
                  <p className="mt-1 text-xs text-[#656d62]">{layer.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[#666a60]">
            Schemat jest uproszczeniem, nie projektem wykonawczym. Kolejność i liczba warstw zależą od dopuszczonego systemu oraz rodzaju podłoża.
          </p>
        </div>
      </section>

      <section className="bg-[#1a352b] py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionEyebrow>Realizacja krok po kroku</SectionEyebrow>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">Dobry efekt zaczyna się <span className="text-[#e1c397]">pod powierzchnią.</span></h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workStages.map(stage => (
              <div key={stage.number} className="border-t border-white/25 pt-5">
                <p className="text-sm font-semibold text-[#e0c79b]">{stage.number}</p>
                <h3 className="mt-6 text-xl font-semibold">{stage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#bfcbbf]">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="galeria" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-3xl">
            <SectionEyebrow>Galeria realizacji</SectionEyebrow>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Zobacz kamienny dywan <span className="text-[#8b6941]">w praktyce.</span></h2>
            <p className="mt-5 leading-relaxed text-[#626a60]">
              Będziemy pokazywać wyłącznie zdjęcia naszych wykonanych realizacji z opisem miejsca i zakresu prac.
            </p>
          </div>
        </div>
        {stoneCarpetGallery.length ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stoneCarpetGallery.map(photo => (
              <figure key={photo.src} className="overflow-hidden rounded-2xl border border-[#dfd9cb] bg-white">
                <div className="relative aspect-[4/3]">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                </div>
                <figcaption className="p-5 text-sm font-medium text-[#4f5a4f]">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["Tarasy", "Balkony", "Schody"].map((name, index) => (
              <div key={name} className={"flex aspect-[4/3] flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center " + (index === 1 ? "border-[#899a83] bg-[#edf0e7]" : "border-[#c6baaa] bg-[#eee9e0]")}>
                <Images className="h-9 w-9 text-[#819082]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold">{name}</h3>
                <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-[#697267]">Miejsce na zdjęcia naszych realizacji</p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-5 text-sm text-[#6e776a]">
          Zdjęcia balkonów z innych systemów żywicznych znajdziesz w <Link href="/realizacje" className="font-semibold underline underline-offset-4 hover:text-[#1d4436]">portfolio firmy</Link>.
          Nie oznaczamy ich jako realizacji kamiennego dywanu.
        </p>
      </section>

      <section id="koszt" className="border-y border-[#e1d9c8] bg-[#eee8dc] py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionEyebrow>Wycena bez niespodzianek</SectionEyebrow>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Ile kosztuje <span className="text-[#8b6941]">kamienny dywan?</span></h2>
            <p className="mt-5 leading-relaxed text-[#596359]">
              Sama cena mieszanki kruszywa z żywicą nie oddaje kosztu całej
              realizacji. Dużą część budżetu może stanowić renowacja podłoża,
              hydroizolacja oraz detale przy schodach i balustradach.
            </p>
            <Link href="/kontakt" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1d3b30] px-7 py-3.5 font-semibold text-white transition hover:bg-[#38594a]">
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
                <li key={factor} className="flex gap-3 border-b border-[#eee8db] pb-4 last:border-b-0 last:pb-0">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#82977c]" />
                  <span className="leading-relaxed text-[#4e5b4f]">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionEyebrow>Użytkowanie i pielęgnacja</SectionEyebrow>
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Naturalny efekt wymaga <span className="text-[#8b6941]">rozsądnej pielęgnacji.</span></h2>
          <p className="mt-5 leading-relaxed text-[#58645a]">
            Na otwartoporowej nawierzchni systematycznie usuwaj piasek, liście
            i zabrudzenia, zanim zalegną między ziarnami. Myj zgodnie z instrukcją
            producenta — bez agresywnej chemii i bez mechanicznego uszkadzania spoiwa.
            Zimą zachowaj ostrożność przy oblodzeniu.
          </p>
          <p className="mt-4 leading-relaxed text-[#58645a]">
            Jeśli priorytetem jest bardzo szybkie mycie gładkiej podłogi, poznaj też
            {" "}<Link href="/posadzki-zywiczne-na-balkony" className="font-semibold text-[#235542] underline underline-offset-4">inne systemy żywiczne na balkony i tarasy</Link>.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Waves, title: "Regularnie usuwaj piasek", body: "Zanieczyszczenia mogą zbierać się w porach i działać ściernie." },
            { icon: Droplets, title: "Kontroluj odpływ wody", body: "Spadki, obróbki i odwodnienie powinny pozostać drożne." },
            { icon: Sun, title: "Dobierz spoiwo do UV", body: "Odporność na słońce wynika z konkretnego produktu i systemu." },
            { icon: Sparkles, title: "Czyść delikatnie", body: "Stosuj środki i metody wskazane w dokumentacji wykonanej nawierzchni." },
          ].map(item => (
            <div key={item.title} className="rounded-2xl border border-[#e0d9ce] bg-white p-6">
              <item.icon className="h-7 w-7 text-[#9d8056]" />
              <h3 className="mt-5 font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#637064]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-[#f0ece4] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <SectionEyebrow>Najczęstsze pytania</SectionEyebrow>
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Warto wiedzieć <span className="text-[#8b6941]">przed decyzją.</span></h2>
          <div className="mt-9 divide-y divide-[#d6cfbf] border-y border-[#d6cfbf]">
            {faqs.map((faq, index) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex gap-4"><span className="text-sm text-[#96815c]">{String(index + 1).padStart(2, "0")}</span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 flex-none text-[#8b6941] transition-transform group-open:rotate-180" />
                </summary>
                <p className="ml-9 mt-4 max-w-2xl leading-relaxed text-[#5d675c]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionEyebrow>Obszar obsługi</SectionEyebrow>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">Kamienny dywan na Podkarpaciu</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-[#5a6258]">
          Obsługiwane miejscowości i poradniki o wyzwaniach wykonawczych.
          Nie jest to wykaz oddziałów ani potwierdzenie zrealizowanych inwestycji w każdym mieście.
        </p>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {stoneCities.map(city => (
            <li key={city.slug}>
              <Link href={"/kamienny-dywan/" + city.slug} className="flex items-center justify-between gap-3 rounded-xl border border-[#e0d9ce] bg-white p-4 text-sm font-semibold transition hover:border-[#8b6941]">
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#8b6941]" />{city.name}</span>
                <ArrowUpRight className="h-4 w-4 text-[#8b6941]" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#173329] px-7 py-14 text-white sm:px-12 md:py-20 lg:px-20">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[55px] border-[#b59b73]/10" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e5c99d]">Porozmawiajmy o Twojej powierzchni</p>
          <h2 className="relative mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">Masz taras, balkon lub schody do wykończenia?</h2>
          <p className="relative mt-5 max-w-2xl text-lg leading-relaxed text-[#c3cdc3]">
            Prześlij orientacyjny metraż, zdjęcia i informację o istniejących warstwach.
            Doradzimy, czy kamienny dywan ma sens w Twoim przypadku i co trzeba uwzględnić w wycenie.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link href="/kontakt" className="inline-flex items-center gap-2 rounded-full bg-[#e7cda2] px-7 py-3.5 font-bold text-[#173329] transition hover:bg-white">
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
