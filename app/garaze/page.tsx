import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, ChevronRight, Images, Ruler, ShieldCheck } from "lucide-react";
import { absoluteUrl } from "@/lib/site-config";
import { getRealizacjeByCategory } from "@/lib/realizacje";
import GarageFinishPicker from "./components/garage-finish-picker";
import ProjectPhoto from "@/components/project-photo";
import ServiceSectionNav from "@/components/service-section-nav";
import GarageExecutionOptions from "@/components/garage-execution-options";
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";

const heroImage = "https://res.cloudinary.com/dvvqfkmsw/image/upload/v1793190382/realizacje/chatgpt/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski/garaz-30m2-ral7035-oryginal-b2e28c4ecd288ef1.jpg";

export const metadata: Metadata = {
  title: "Posadzka żywiczna do garażu – kolory, realizacje i wycena",
  description: "Zobacz prawdziwe realizacje posadzek żywicznych do garaży, wybierz wykończenie i kolor, poznaj detale oraz oblicz orientacyjny koszt wykonania.",
  keywords: "posadzka żywiczna do garażu, posadzki garażowe, żywica do garażu, płatki dekoracyjne, wycena garażu",
  alternates: { canonical: absoluteUrl("/garaze") },
  openGraph: {
    title: "Posadzki żywiczne do garaży – realizacje i kolory",
    description: "Garaż może wyglądać świetnie. Obejrzyj nasze realizacje, wybierz wykończenie i sprawdź koszt.",
    url: absoluteUrl("/garaze"),
    images: [{ url: heroImage, width: 1200, height: 800, alt: "Garaż z jasnoszarą posadzką żywiczną RAL 7035 w Sędziszowie Małopolskim" }],
  },
};

export const revalidate = 300;

const faqs = [
  {
    q: "Czy zdjęcie potwierdza odporność i antypoślizgowość?",
    a: "Zdjęcie pokazuje wygląd i widoczne detale. Nie potwierdza wilgotności betonu, przyczepności, grubości warstw ani klasy antypoślizgowości. Te wymagania ustalamy na podstawie oceny podłoża, doboru systemu i jego dokumentacji.",
  },
  {
    q: "Ile kosztuje posadzka żywiczna w garażu?",
    a: "Koszt zależy od metrażu, stanu betonu, wymaganych napraw, rodzaju wykończenia i zakresu cokołów. Przykładowy garaż 45 m² wykonaliśmy za 7 500 zł netto. To przykład konkretnej realizacji, nie uniwersalny cennik.",
  },
  {
    q: "Czy posadzka żywiczna jest śliska?",
    a: "Może być śliska, szczególnie gdy jest mokra. Dlatego do garażu dobieramy fakturę i ewentualną posypkę antypoślizgową do warunków użytkowania. Wykończenie gładkie i strukturalne różnią się także łatwością czyszczenia.",
  },
  {
    q: "Czy żywica może być położona na stary beton?",
    a: "Tak, jeżeli podłoże ma odpowiednią nośność i da się je prawidłowo przygotować. Przed wyceną sprawdzamy m.in. wilgotność, rysy, zanieczyszczenia i dylatacje. Nie każdy stary beton kwalifikuje się do wykonania bez dodatkowych prac.",
  },
  {
    q: "Ile trwa wykonanie posadzki i kiedy można wjechać samochodem?",
    a: "Typowy garaż realizujemy podczas trzech wizyt ekipy. Czas do wejścia pieszo i do pierwszego wjazdu autem zależy od wybranego systemu, temperatury oraz warunków utwardzania. Potwierdzamy go indywidualnie przed rozpoczęciem użytkowania.",
  },
  {
    q: "Czy kolor posadzki żywicznej zmienia się pod wpływem słońca?",
    a: "Niektóre żywice epoksydowe mogą z czasem zmieniać odcień pod wpływem UV. Jeżeli do garażu wpada dużo światła słonecznego, dobieramy warstwę wykończeniową z uwzględnieniem wymaganej odporności na promieniowanie.",
  },
];

export default async function GaragePage() {
  const allGarageProjects = (await getRealizacjeByCategory("garaze"))
    .filter((project) => Boolean(project.slug && project.images.main));
  // Keep documented case studies visible even when newer database entries arrive.
  const featuredSlugs = [
    "posadzka-zywiczna-garaz-100m2-przemysl-ral7035",
    "posadzka-zywiczna-garaz-30m2-sedziszow-malopolski",
  ];
  const projects = [
    ...featuredSlugs.flatMap((slug) => allGarageProjects.filter((project) => project.slug === slug)),
    ...allGarageProjects.filter((project) => !featuredSlugs.includes(project.slug)),
  ].slice(0, 6);
  const photoRoot = "/chatgpt-realizacje/posadzka-zywiczna-garaz-100m2-przemysl-ral7035/";
  const detailPhotos = [
    { url: photoRoot + "przemysl-garaz-100m2-wykonczenie-cokolu.jpg", alt: "Cokół i faktura szarej posadzki z płatkami w narożniku garażu w Przemyślu", caption: "Cokół i narożnik · Przemyśl", question: "Jak wykończymy styk ze ścianą?", answer: "Na zdjęciu widać cokół dopasowany do posadzki. Jego wysokość, przygotowanie ściany i uszczelnienie połączenia ustalamy w zakresie wyceny." },
    { url: photoRoot + "przemysl-garaz-100m2-polaczenie-pomieszczen.jpg", alt: "Posadzka z płatkami w garażu oraz przejście do sąsiedniego pomieszczenia", caption: "Przejście między pomieszczeniami · Przemyśl", question: "Co z przejściami i dylatacjami?", answer: "Obejrzyj przebieg podłogi w przejściu. Przy Twoim zleceniu sprawdzimy różnice poziomów, progi i istniejące dylatacje. Wykończenie nie usuwa ruchu konstrukcji." },
    { url: photoRoot + "przemysl-garaz-100m2-strefa-boczna.jpg", alt: "Jasnoszara posadzka z płatkami i odbiciem światła w bocznym pomieszczeniu garażu", caption: "Faktura i odbicie światła · Przemyśl", question: "Czy tak będzie wyglądać w moim świetle?", answer: "Kolor i połysk zmieniają odbiór wraz z oświetleniem. Zdjęcie pomaga wybrać kierunek, a odcień i fakturę potwierdzamy próbką. Ręcznie wykonana powierzchnia ma drobne różnice w układzie płatków." },
  ];

  return (
    <main className="min-w-0">
      {/* Hero — authentic client project, not a stock image. */}
      <section className="brand-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-5 px-4 pb-8 pt-5 sm:px-6 md:py-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:py-20">
          <div className="max-w-xl">
            <nav aria-label="Ścieżka nawigacji" className="mb-3 flex items-center gap-2 text-xs text-zinc-500">
              <Link href="/" className="hover:text-zinc-900">Strona główna</Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <span aria-current="page">Posadzki do garażu</span>
            </nav>
            <p className="brand-eyebrow">Posadzki żywiczne do garaży</p>
            <h1 className="mt-2 text-3xl font-semibold leading-[1.08] tracking-tight text-zinc-950 sm:text-5xl xl:text-6xl">
              Posadzka do garażu, którą możesz obejrzeć z bliska.
            </h1>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-zinc-600 sm:text-lg">
              Piękne, trwałe posadzki żywiczne dopasowane do Twojego garażu. Zobacz wykonane przez nas realizacje, wybierz kolor i strukturę, a następnie poznaj orientacyjny koszt.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/kalkulator?typ=garaz" className="inline-flex items-center justify-center gap-2 rounded-full brand-button px-6 py-3.5 text-sm font-semibold">
                Sprawdź cenę garażu <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#wykonczenia" className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-6 py-3.5 text-sm font-semibold text-zinc-900 transition-colors hover:border-zinc-900">
                Porównaj wykończenia <Images className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-zinc-900" /> Prace z cokołami</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-zinc-900" /> Gwarancja zgodnie z ofertą</span>
              <span className="inline-flex items-center gap-2"><Ruler className="h-4 w-4 text-zinc-900" /> Dobór do podłoża</span>
            </div>
          </div>
          <figure className="order-first lg:order-none">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-zinc-100 lg:aspect-[4/3]">
              <Image src={heroImage} alt="Posadzka żywiczna z płatkami dekoracyjnymi RAL 7035 w garażu 30 m² w Sędziszowie Małopolskim" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
              <span>Nasza realizacja · Sędziszów Małopolski · 30 m² · RAL 7035</span>
              <Link href="/realizacje/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski" className="font-semibold text-zinc-900 underline underline-offset-4 hover:no-underline">
                Zobacz projekt
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>

      <ServiceSectionNav items={[{"href":"#cena","label":"Cena"},{"href":"#wykonczenia","label":"Wykończenia"},{"href":"#realizacje","label":"Zdjęcia"},{"href":"#garaz-detale","label":"Detale"},{"href":"#garaz-przebieg","label":"Przebieg"},{"href":"#garaz-faq","label":"Wady i pytania"},{"href":"#garaz-opinie","label":"Opinie"}]} quoteHref="/kalkulator?typ=garaz" quoteLabel="Oblicz koszt" />
      <section id="cena" aria-labelledby="garaz-cena" className="scroll-mt-40 mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Cena i zakres</p>
          <h2 id="garaz-cena" className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Ile kosztuje posadzka żywiczna w garażu?</h2>
          <p className="mt-4 leading-relaxed text-zinc-600">
            Każdy beton jest inny. Cena zależy od przygotowania podłoża, metrażu, cokołów i wybranego wykończenia. Poniżej znajdziesz potwierdzony koszt i zakres jednego z naszych zleceń.
          </p>
          <Link href="/kalkulator?typ=garaz" className="mt-7 inline-flex items-center gap-2 rounded-full brand-button px-6 py-3 text-sm font-semibold">
            Oblicz koszt mojego garażu <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="rounded-2xl bg-zinc-100 p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Przykład wykonanego zlecenia</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">7 500 zł <span className="text-lg font-medium text-zinc-600">netto</span></p>
          <p className="mt-2 text-zinc-600">Garaż 45 m² · około 167 zł netto/m²</p>
          <div className="mt-7 border-t border-zinc-300 pt-6">
            <p className="font-semibold text-zinc-950">W cenie tej realizacji:</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700">
              {[
                "Przygotowanie betonu: szlifowanie, szpachlowanie i gruntowanie",
                "Obsadzenie kratki odpływowej",
                "Warstwa zasadnicza z wykończeniem dekoracyjnym lub kwarcowym",
                "Cokoły i uszczelnienie styku ściany z posadzką",
              ].map((item) => (
                <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-900" aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-xs text-zinc-600">To historyczna cena pojedynczej realizacji. Fotografie garaży 30 i 100 m² na tej stronie przedstawiają inne zlecenia i nie są ilustracją tej ceny. Końcowy zakres i koszt potwierdzamy po ocenie podłoża.</p>
        </div>
      </section>

      <GarageFinishPicker />

      <section id="realizacje" aria-labelledby="garage-realizacje" className="scroll-mt-40 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Portfolio</p>
            <h2 id="garage-realizacje" className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Zobacz nasze wykonane garaże.
            </h2>
            <p className="mt-4 text-zinc-600">Otwórz realizację, aby obejrzeć więcej zdjęć i poznać zastosowane rozwiązanie.</p>
          </div>
          <Link href="/realizacje" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-zinc-900 underline underline-offset-4">
            Wszystkie realizacje <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {projects.length > 0 ? (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link href={"/realizacje/" + project.slug} key={project.slug} className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                  <Image src={project.images.main} alt={project.title + " – " + project.location} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{project.location}{project.details.surface ? " · " + project.details.surface : ""}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-zinc-950">{project.title}</h3>
                  {project.details.color && <p className="mt-2 text-sm text-zinc-600">{project.details.color}</p>}
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900">Zobacz zdjęcia <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-9 rounded-2xl bg-zinc-100 p-8 text-zinc-700">
            Zobacz nasze zdjęcia w <Link href="/realizacje" className="font-semibold underline">galerii realizacji</Link>.
          </div>
        )}
      </section>

      {detailPhotos.length > 0 && (
        <section aria-labelledby="garaz-detale" className="brand-surface py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="brand-eyebrow">Jakość w zbliżeniu</p>
              <h2 id="garaz-detale" className="scroll-mt-40 mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">O jakości świadczą szczegóły.</h2>
              <p className="mt-4 leading-relaxed text-zinc-600">Powiększ zdjęcia cokołu, przejścia i faktury. Wszystkie trzy kadry pochodzą z garażu 100 m² w Przemyślu.</p>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {detailPhotos.map((photo) => (
                <article key={photo.url} className="min-w-0 rounded-2xl bg-white p-4 text-zinc-950 sm:p-5">
                  <ProjectPhoto src={photo.url} alt={photo.alt} caption={photo.caption} sizes="(max-width: 768px) 100vw, 33vw" />
                  <h3 className="mt-5 text-xl font-semibold">{photo.question}</h3>
                  <p className="mt-3 leading-relaxed text-zinc-600">{photo.answer}</p>
                </article>
              ))}
            </div>
            <Link href="/realizacje/posadzka-zywiczna-garaz-100m2-przemysl-ral7035" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#007A3D] underline underline-offset-4">
              Zobacz całą realizację z Przemyśla <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      <section aria-labelledby="garaz-przebieg" className="border-y border-zinc-200 bg-zinc-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="garaz-przebieg" className="scroll-mt-40 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Od oceny betonu do gotowej posadzki.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { number: "01", title: "Oględziny i dobór", content: "Sprawdzamy nośność, wilgotność, pęknięcia oraz dylatacje. Ustalamy wykończenie, kolor i zakres napraw.", shot: "Zbliżenie rysy, dylatacji lub oględzin betonu" },
              { number: "02", title: "Przygotowanie podłoża", content: "Szlifujemy i naprawiamy beton, wykonujemy gruntowanie oraz wymagane warstwy systemu.", shot: "Praca szlifierki na betonie lub etap gruntowania" },
              { number: "03", title: "Detale i odbiór", content: "Wykańczamy posadzkę i cokoły. Informujemy, kiedy można bezpiecznie wejść i wjechać samochodem.", shot: "Detal gotowego cokołu, narożnika i powierzchni posadzki" },
            ].map((step) => (
              <div key={step.number} className="border-t border-zinc-300 pt-5">
                <p className="text-sm font-semibold text-zinc-500">{step.number}</p>
                <h3 className="mt-4 text-xl font-semibold text-zinc-950">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-600">{step.content}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-zinc-600">Typowy garaż wykonujemy podczas trzech wizyt. Termin dopuszczenia ruchu pieszych i pojazdów podajemy osobno, zgodnie z wybranym systemem i warunkami utwardzania.</p>
        </div>
      </section>

      <section aria-labelledby="garaz-dobor" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Technologia, która ma znaczenie</p>
          <h2 id="garaz-dobor" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Kiedy trzeba najpierw zająć się podłożem?</h2>
          <p className="mt-4 leading-relaxed text-zinc-600">
            Do wielu garaży wewnętrznych dobieramy systemy epoksydowe, a przy nasłonecznieniu i innych wymaganiach również odpowiednie warstwy wykończeniowe. Nośność i wilgotność betonu, przyczepność powierzchni oraz odporność na UV zawsze oceniamy dla konkretnego systemu.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold">Trwałość zaczyna się pod żywicą</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">Rysy, wilgoć, dylatacje i słaba warstwa betonu mogą zniweczyć nawet estetyczne wykończenie. Dlatego dobieramy przygotowanie podłoża do jego faktycznego stanu.</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold">Dobór systemu zamiast przypadkowego produktu</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">Rodzaj gruntu, warstwy zasadniczej, posypki i lakieru wykończeniowego zależy od warunków. Karty techniczne producentów pomagają potwierdzić parametry.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/systemy/sika-posadzki-garazowe" className="rounded-full border px-5 py-3 hover:border-zinc-900">Systemy Sika</Link>
          <Link href="/systemy/sicon-posadzki-garazowe" className="rounded-full border px-5 py-3 hover:border-zinc-900">Systemy Sicon</Link>
          <Link href="/systemy/epovio-garaz" className="rounded-full border px-5 py-3 hover:border-zinc-900">EPOVIO · w opracowaniu</Link>
          <Link href="/systemy" className="rounded-full border px-5 py-3 hover:border-zinc-900">Wszystkie systemy</Link>
        </div>
      </section>

      <section aria-labelledby="garaz-faq" className="bg-zinc-50 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">FAQ</p>
            <h2 id="garaz-faq" className="scroll-mt-40 mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Pytania przed wykonaniem posadzki.</h2>
            <p className="mt-4 text-zinc-600">Wycena, antypoślizgowość, wilgotność podłoża i czas utwardzania — warto znać odpowiedzi przed wyborem.</p>
          </div>
          <div className="divide-y divide-zinc-300 border-t border-zinc-300">
            {faqs.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-950 marker:hidden">
                  {item.q}
                  <span aria-hidden="true" className="shrink-0 text-xl font-normal text-zinc-500 group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-relaxed text-zinc-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div id="garaz-opinie" className="scroll-mt-40"><SocialProofSection /></div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><GarageExecutionOptions /></div>
      <section className="brand-surface px-4 py-16 text-center sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Twój garaż może wyglądać tak samo dobrze.</h2>
          <p className="mt-5 text-zinc-600">Oblicz orientacyjny koszt bez podawania danych kontaktowych, a następnie wybierz wykonanie przez nas lub samodzielną pracę z naszym wsparciem.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/kalkulator?typ=garaz" className="inline-flex items-center justify-center gap-2 rounded-full brand-button px-7 py-3.5 text-sm font-semibold">
              Oblicz koszt garażu <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="#garaz-dwie-opcje" className="inline-flex items-center justify-center rounded-full border border-zinc-400 px-7 py-3.5 text-sm font-semibold text-zinc-900 hover:bg-white">
              Zobacz obie możliwości
            </Link>
          </div>
          <p className="mt-8 text-sm text-zinc-600">
            Zobacz również: <Link href="/blog/ile-kosztuje-posadzka-zywiczna-w-garazu" className="underline underline-offset-4">co wpływa na koszt</Link> i <Link href="/blog/ile-trwa-schniecie-posadzki-zywicznej" className="underline underline-offset-4">kiedy można parkować</Link>.
          </p>
          <p className="mt-3 text-sm text-zinc-600">Realizujemy zlecenia m.in. w <Link href="/posadzki-zywiczne/rzeszow" className="underline underline-offset-4">Rzeszowie</Link> i <Link href="/posadzki-zywiczne/krakow" className="underline underline-offset-4">Krakowie</Link>.</p>
        </div>
      </section>
    </main>
  );
}
