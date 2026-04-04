import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Droplets,
  HeartHandshake,
  Home,
  Layers3,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const highlights = [
  "Bez fug — jedno przetarcie mopem zastępuje szorowanie szczoteczką każdego tygodnia.",
  "Wykończenie premium: mat, półmat lub wariant antypoślizgowy — dobieramy do Twojego wnętrza i trybu życia.",
  "Spójna powierzchnia przez cały dom: kuchnia, salon, łazienka, hol i garaż bez progów i wizualnych podziałów.",
  "Transparentna wycena: najczęściej około 300 zł/m² za profesjonalny system dopasowany do domu lub mieszkania.",
];

const stats = [
  { value: "~300", label: "zł/m² — najczęstszy koszt systemu do domu lub mieszkania" },
  { value: "0", label: "fug, szczelin i miejsc, w których zbiera się brud" },
  { value: "1", label: "spójna powierzchnia od salonu, przez kuchnię, po garaż" },
];

const benefits = [
  {
    title: "Koniec z szorowania fug — jedną ścierką i gotowe",
    description:
      "Brak fug to argument numer jeden, który klienci wymieniają po realizacji. Okruchy z kuchni, włosy, kurz — sprzątasz jednym ruchem mopa, bez klęczenia i szczoteczki. Szczególnie doceniają to rodziny z dziećmi, alergicy i właściciele zwierząt.",
    icon: Sparkles,
  },
  {
    title: "Design, który robi wrażenie — od pierwszego wejrzenia",
    description:
      "Podłoga nadaje ton całej przestrzeni. Dobieramy kolor, poziom połysku i charakter powierzchni tak, aby idealnie wpisywały się w wnętrza nowoczesne, minimalistyczne, loftowe, japandi i premium — i żeby efekt wyglądał dokładnie tak, jak w projekcie.",
    icon: Home,
  },
  {
    title: "Inwestujesz raz — i przez lata nie myślisz o wymianie",
    description:
      "Dobrze dobrany system żywiczny wytrzymuje codzienne użytkowanie: kuchnię, dzieci, zwierzęta i przesuwane meble. W razie potrzeby powierzchnię można po latach odświeżyć lub zrenowować — bez kucia, hałasu i tygodniowego remontu.",
    icon: ShieldCheck,
  },
  {
    title: "Jeden materiał od kuchni po łazienkę — bez progów i podziałów",
    description:
      "Koniec z kompromisem: płytki w kuchni, panele w salonie, coś innego w holu. Posadzka żywiczna tworzy jedną spójną, estetyczną przestrzeń w całym domu lub mieszkaniu — i właśnie to klienci opisują jako największą wizualną zmianę.",
    icon: Layers3,
  },
  {
    title: "Nie ślizga się — wykończenie dobieramy do każdego pomieszczenia",
    description:
      "To jedno z pierwszych pytań, które zadają klienci — i słusznie. Do salonu rekomendujemy mat lub półmat, a w łazience i strefie wejściowej stosujemy wariant antypoślizgowy. Bezpieczeństwo użytkowania jest dla nas tak samo ważne jak estetyka.",
    icon: HeartHandshake,
  },
  {
    title: "Doskonale współpracuje z ogrzewaniem podłogowym",
    description:
      "Jeśli planujesz ogrzewanie podłogowe lub już je masz, posadzka żywiczna jest jednym z najlepszych rozwiązań. Dobieramy system z myślą o konkretnym układzie grzewczym, parametrach technicznych i wymaganiach architekta lub inwestora.",
    icon: TimerReset,
  },
];

const spaces = [
  {
    title: "Kuchnia otwarta na salon — jeden materiał, efekt wow",
    description:
      "Jedna spójna powierzchnia bez fugi między kuchnią a salonem wizualnie powiększa przestrzeń i nadaje jej premium charakter. Klienci opisują to jako zmianę, która zrobiła największą różnicę w odbiorze całego wnętrza.",
  },
  {
    title: "Cały dom lub całe mieszkanie bez progów",
    description:
      "Największą różnicę widać i czuć, gdy żywica łączy salon, kuchnię, łazienkę, hol i garaż w jedną harmonijną przestrzeń. Żadnych progów, żadnych wizualnych podziałów — tylko czysta estetyka od progu do ostatniego pokoju.",
  },
  {
    title: "Mieszkania premium i apartamenty",
    description:
      "Dla klientów, którzy chcą wyróżniającego się wnętrza na rynku nieruchomości lub po prostu pragną żyć w przestrzeni klasy premium — posadzka żywiczna to wybór, który przemawia do każdego, kto przestępuje próg.",
  },
  {
    title: "Projekt z architektem wnętrz",
    description:
      "Dostarczamy rozwiązanie, które łatwo wpisać w każdy spójny projekt. Możemy bezpośrednio skonsultować się z Twoim architektem w sprawie kolorystyki, wykończenia i technicznych wymagań — żeby efekt końcowy był dokładnie taki, jak na wizualizacji.",
  },
];

const process = [
  "Powiedz nam o swoim wnętrzu: orientacyjny metraż, zakres prac i preferencje wykończenia (mat, półmat lub mocniejszy efekt dekoracyjny) — to wystarczy do pierwszej rozmowy.",
  "Ocenimy stan podłoża, zakres prac i dobierzemy system idealny dla Twojego domu lub mieszkania — tak, aby spełniał zarówno Twoje oczekiwania estetyczne, jak i wymagania praktyczne.",
  "Dostajesz konkretną wycenę bez ukrytych kosztów, realny harmonogram i jasną informację, jak przygotować wnętrze przed realizacją — żeby wszystko przebiegło sprawnie.",
  "Wykonujemy posadzkę w ustalonym kolorze i strukturze. Po odbiorze przekazujemy szczegółową instrukcję pielęgnacji i użytkowania — dzięki której Twoja podłoga będzie wyglądać pięknie przez wiele lat.",
];

const questions = [
  {
    question: "Czy podłoga żywiczna w domu się rysuje?",
    answer:
      "Odpowiednio dobrany system żywiczny jest odporny na typowe codzienne użytkowanie — zarysowania od mebli, butów czy zwierząt. Co ważne, brak fug oznacza brak najsłabszych punktów każdej podłogi płytkowej. Jeśli po latach pojawią się drobne ślady użytkowania, powierzchnię można odświeżyć lub zrenowować bez konieczności kucia i generalnego remontu.",
  },
  {
    question: "Czy posadzka żywiczna jest śliska?",
    answer:
      "Nie musi być — i właśnie dlatego dobór wykończenia jest tak ważny. Do salonu i kuchni rekomendujemy mat lub półmat, które dają komfortowy, nieformalny charakter. Do łazienki, strefy wejściowej lub klatki schodowej stosujemy wariant antypoślizgowy. Każde pomieszczenie traktujemy indywidualnie.",
  },
  {
    question: "Ile kosztuje posadzka żywiczna do domu lub mieszkania?",
    answer:
      "Najczęściej trzeba liczyć około 300 zł/m². To dobry punkt odniesienia, który pozwala od razu porównać żywicę z płytkami, panelami czy mikrocementem. Finalna cena zależy od metrażu, stanu podłoża, wybranego systemu, koloru oraz tego, czy realizujemy jedną strefę, czy cały dom lub mieszkanie. Wycenę dostajesz bezpłatnie i bez zobowiązań.",
  },
  {
    question: "Czy można ją wykonać na ogrzewaniu podłogowym?",
    answer:
      "Tak — i to jest jedno z częstszych zastosowań w nowych, dobrze zaprojektowanych domach. Posadzka żywiczna dobrze przewodzi ciepło i sprawdza się zarówno w systemach wodnych, jak i elektrycznych. System dobieramy zawsze z uwzględnieniem konkretnego układu grzewczego, aby mieć pewność, że wszystko współpracuje prawidłowo.",
  },
  {
    question: "Ile trwa realizacja?",
    answer:
      "Najczęściej od 3 do 7 dni roboczych, zależnie od metrażu, stanu podłoża i wybranego systemu. Zanim zaczniemy, dostajesz realny harmonogram z podaniem daty, kiedy możesz wrócić do normalnego użytkowania. Staramy się, żeby remont był jak najmniej uciążliwy dla domowników.",
  },
  {
    question: "Czy można dobrać kolor i efekt pod konkretny styl wnętrza?",
    answer:
      "Tak — i to jest jedna z największych przewag posadzki żywicznej nad innymi materiałami. Kolor, struktura i poziom połysku dobieramy indywidualnie, dzięki czemu podłoga może być dokładnie taka, jaka jest na wizualizacji od architekta. Sprawdza się w wnętrzach nowoczesnych, minimalistycznych, loftowych, industrialnych, japandi i premium.",
  },
];

const caseStudies = [
  {
    title: "Mieszkanie, salon z kuchnią",
    location: "Rzeszów",
    surface: "45 m²",
    challenge: "Klient chciał jasną, nowoczesną podłogę bez fug do otwartej strefy dziennej i na ogrzewanie podłogowe.",
    effect: "Powstała bezspoinowa powierzchnia w białym połysku, łatwa w sprzątaniu i spójna dla całej części dziennej.",
    image: "/mieszkanie/DeWatermark.ai_1732886162387.png",
    alt: "Podłoga żywiczna w mieszkaniu w Rzeszowie",
  },
  {
    title: "Dom jednorodzinny, cała strefa mieszkalna",
    location: "Kraków",
    surface: "120 m²",
    challenge: "Inwestorowi zależało na jednej spójnej posadzce w całym domu zamiast łączenia kilku materiałów.",
    effect: "Szary system samopoziomujący połączył salon, kuchnię i kolejne pomieszczenia w nowoczesną, minimalistyczną całość.",
    image: "/kuchnia.jpg",
    alt: "Posadzka żywiczna w domu jednorodzinnym w Krakowie",
  },
];

const comparisonRows = [
  {
    label: "Wygląd premium i spójna powierzchnia",
    resin: "Jedna powierzchnia bez fug i progów",
    tiles: "Dobra trwałość, ale widoczne podziały i fugi",
    panels: "Przyjemne wizualnie, ale mniej odporne w kuchni",
    microcement: "Ładny efekt, zwykle mniej odporny systemowo",
  },
  {
    label: "Sprzątanie i higiena",
    resin: "Najłatwiejsze: brak fug i szczelin",
    tiles: "Fugi łapią brud i wymagają czyszczenia",
    panels: "Łatwe na sucho, słabsze przy wilgoci",
    microcement: "Bez fug, ale wymaga pilnowania zabezpieczenia",
  },
  {
    label: "Odporność w codziennym użytkowaniu",
    resin: "Wysoka przy systemie dobranym do domu",
    tiles: "Trwałe, ale fuga i spoiny są słabym punktem",
    panels: "Szybciej widać zużycie i ślady eksploatacji",
    microcement: "Mocno zależy od wykonania i pielęgnacji",
  },
  {
    label: "Ogrzewanie podłogowe",
    resin: "Tak",
    tiles: "Tak",
    panels: "Zależnie od rodzaju paneli",
    microcement: "Tak",
  },
];

const serviceAreas = [
  "Podkarpackie — Rzeszów i okolice",
  "Małopolskie — Kraków, Wieliczka, Nowy Sącz",
  "Lubelskie — realizacje i wyceny po wcześniejszym ustaleniu zakresu",
];

export default function KitchenLivingPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.08),_transparent_35%)]" />
        <div className="container relative grid gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div className="space-y-8">
            <Badge variant="outline" className="rounded-full px-4 py-1 text-sm">
              Podłoga żywiczna, kuchnia, salon, cały dom i mieszkanie
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Podłoga żywiczna, która zmienia kuchnię i salon
                <span className="text-primary"> w przestrzeń, gdzie naprawdę chce się żyć</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Bez fug, bez kompromisów i bez wybierania między pięknym
                designem a wygodą w codziennym użytkowaniu. Pokazujemy,
                dlaczego właściciele domów i mieszkań coraz częściej wybierają
                posadzkę żywiczną — i jak to wygląda w praktyce, od pierwszej
                rozmowy po odbiór gotowej realizacji.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border bg-background/80 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-1">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/kontakt">
                  Zapytaj o wycenę
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="tel:+48507384619">Zadzwoń: +48 507 384 619</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:pl-8">
            <div className="relative overflow-hidden rounded-[28px] border bg-slate-100 shadow-2xl">
              <Image
                src="/mieszkanie.jpg"
                alt="Posadzka żywiczna w domu i mieszkaniu"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-white/80">
                  Realizacja
                </p>
                <p className="mt-2 max-w-md text-2xl font-medium">
                  Jedna spójna posadzka — kuchnia, salon, łazienka, bez jednej fugi
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border bg-card p-6 shadow-sm">
                <p className="text-sm font-medium text-primary">Co interesuje klientów?</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>Czy posadzka żywiczna naprawdę wytrzyma codzienne użytkowanie przez lata?</li>
                  <li>Czy w kuchni i salonie nie będzie śliska — szczególnie przy dzieciach?</li>
                  <li>Czy warto wydać więcej i co dokładnie zyskuję w zamian za tę cenę?</li>
                </ul>
              </div>
              <div className="rounded-[24px] border bg-card p-6 shadow-sm">
                <p className="text-sm font-medium text-primary">Jak odpowiadamy?</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Dobieramy system stworzony pod użytkowanie domowe i wyjaśniamy,
                  kiedy żywica jest po prostu lepszym wyborem niż płytki, panele
                  czy mikrocement — a kiedy warto rozważyć inne rozwiązanie.
                  Żadnego nacisku, tylko rzetelna informacja.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 py-16 md:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="rounded-full px-4 py-1 text-sm">
            Dlaczego to działa we wnętrzach
          </Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Najpierw kupujesz oczami. Potem odkrywasz, że ta podłoga
            naprawdę ułatwia codzienne życie.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Klienci mówią to samo: brak fug zmienił ich podejście do
            sprzątania, efekt premium sprawia, że goście pytają o podłogę, a
            trwałość daje spokój na lata. To trzy argumenty, które decydują
            o wyborze żywicy zamiast klasycznych rozwiązań.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-[24px] border bg-card p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container grid gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
          <div className="space-y-5">
            <Badge variant="outline" className="rounded-full px-4 py-1 text-sm">
              Gdzie sprawdza się najlepiej
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Największą różnicę widać wtedy, gdy traktujesz dom jako całość —
              nie jako zbiór oddzielnych pomieszczeń.
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Posadzka żywiczna sprawdza się najlepiej wszędzie tam, gdzie
              zależy Ci na jednej estetyce od kuchni, przez salon, po kolejne
              strefy. To wybór, który doceniają zarówno inwestorzy
              indywidualni, jak i architekci wnętrz planujący spójne projekty.
            </p>
            <div className="rounded-[24px] border bg-background p-6 shadow-sm">
              <p className="flex items-center gap-2 text-base font-medium">
                <Droplets className="h-5 w-5 text-primary" />
                Design przekonuje — praktyczność ostatecznie zamyka decyzję.
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Właśnie dlatego żywica coraz częściej wyprzedza zestaw „płytki
                w kuchni i panele w salonie” — zwłaszcza gdy inwestor chce
                jednolitej, nowoczesnej powierzchni bez fug i wizualnych cięć.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {spaces.map((space) => (
              <div
                key={space.title}
                className="rounded-[24px] border bg-background p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{space.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {space.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container px-4 py-16 md:px-6 lg:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge variant="outline" className="rounded-full px-4 py-1 text-sm">
              Porównanie materiałów
            </Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Żywica kontra płytki, panele i mikrocement — szybkie porównanie
              przed decyzją.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Sprawdź, w czym posadzka żywiczna wypada lepiej, a w czym inne
              materiały mogą być wystarczające. Rzetelne zestawienie — bez
              ukrytych wad. Podejmij decyzję z pełną wiedzą.
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[28px] border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-4 font-semibold">Kryterium</th>
                  <th className="p-4 font-semibold">Żywica</th>
                  <th className="p-4 font-semibold">Płytki</th>
                  <th className="p-4 font-semibold">Panele</th>
                  <th className="p-4 font-semibold">Mikrocement</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-t align-top">
                    <th scope="row" className="bg-background p-4 font-medium">
                      {row.label}
                    </th>
                    <td className="bg-background p-4 text-muted-foreground">{row.resin}</td>
                    <td className="bg-background p-4 text-muted-foreground">{row.tiles}</td>
                    <td className="bg-background p-4 text-muted-foreground">{row.panels}</td>
                    <td className="bg-background p-4 text-muted-foreground">
                      {row.microcement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-y bg-slate-950 text-white">
        <div className="container grid gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:py-24">
          <div className="space-y-5">
            <Badge className="rounded-full border-white/20 bg-white/10 px-4 py-1 text-sm text-white hover:bg-white/10">
              Realizacje i obszar działania
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Efekty mówią więcej niż opisy — zobacz, jak wygląda to w praktyce.
            </h2>
            <p className="text-lg leading-8 text-slate-300">
              Obsługujemy inwestycje w województwie podkarpackim, małopolskim i
              lubelskim. Poniżej pokazujemy przykładowe realizacje, żebyś
              mógł zobaczyć, co oznacza posadzka żywiczna w domu w
              konkretnych metrażach i efekcie końcowym.
            </p>
            <div className="grid gap-3">
              {serviceAreas.map((area) => (
                <div
                  key={area}
                  className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  {area}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {caseStudies.map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={item.image} alt={item.alt} fill className="object-cover" />
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {item.location} • {item.surface}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Problem klienta</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.challenge}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Efekt końcowy</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.effect}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30">
        <div className="container grid gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:py-24">
          <div className="space-y-5">
            <Badge variant="outline" className="rounded-full px-4 py-1 text-sm">
              Jak wygląda współpraca
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Prosta i przejrzysta współpraca — od pierwszego pytania do
              gotowej podłogi.
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Staramy się, żeby każdy etap był zrozumiały i przewidywalny.
              Już na wstępie wiesz, o jakim budżecie mówimy — najczęściej
              około 300 zł/m² — dzięki czemu możesz od razu ocenić, czy
              szukasz rozwiązania dla kuchni z salonem, czy dla całego domu.
            </p>
          </div>

          <div className="grid gap-4">
            {process.map((step, index) => (
              <div
                key={step}
                className="rounded-[24px] border bg-background p-6 shadow-sm"
              >
                <p className="text-sm font-medium text-primary">
                  Krok {index + 1}
                </p>
                <p className="mt-2 text-base leading-7 text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container px-4 py-16 md:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="rounded-full px-4 py-1 text-sm">
            FAQ
          </Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Najczęstsze pytania o podłogi i posadzki żywiczne w domach i mieszkaniach
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Zebraliśmy pytania, które słyszymy najczęściej. Odpowiadamy
            szczerze — o trwałości, śliskości, kosztach, ogrzewaniu
            podłogowym i czasie realizacji. Bez owijania w bawełnę.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-[28px] border bg-card p-6 shadow-sm md:p-8">
          <Accordion type="single" collapsible className="w-full">
            {questions.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-7 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="container px-4 pb-16 md:px-6 lg:pb-24">
        <div className="overflow-hidden rounded-[32px] border bg-gradient-to-br from-primary/10 via-background to-slate-100 p-8 shadow-sm md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Badge variant="outline" className="rounded-full px-4 py-1 text-sm">
                Ostatni krok
              </Badge>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Zrób pierwszy krok — dowiedz się, ile kosztuje posadzka
                żywiczna w Twoim domu lub mieszkaniu.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                Najczęściej to około 300 zł/m² — dobry punkt wyjścia, żeby
                ocenić budżet i porównać żywicę z innymi materiałami. Powiedz
                nam, co planujesz, a pomożemy dobrać system, kolor i wykończenie
                dopasowane do Twojego wnętrza i stylu życia.
              </p>
            </div>

            <div className="rounded-[28px] border bg-background/90 p-6 shadow-sm">
              <p className="text-lg font-semibold">Zacznij od trzech prostych kroków:</p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Podaj planowany metraż i miejscowość — to wystarczy do pierwszej rozmowy.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Napisz, czy chodzi o kuchnię z salonem, o cały dom, czy o pojedyncze pomieszczenie.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Powiedz, jaki efekt Cię interesuje: mat, półmat, połysk, antypoślizg — lub zapytaj, co polecamy.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Dostaniesz bezpłatną wycenę bez zobowiązań i realną odpowiedź, czy żywica to dobry wybór dla Ciebie.
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="gap-2">
                  <Link href="/kontakt">
                    Zapytaj o wycenę
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="mailto:biuro@posadzkizywiczne.com">
                    biuro@posadzkizywiczne.com
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
