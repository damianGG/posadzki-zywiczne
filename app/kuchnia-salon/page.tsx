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
  "Bez fug — mniej sprzątania, więcej czystej i higienicznej powierzchni.",
  "Wykończenie premium: mat, półmat lub wariant antypoślizgowy dopasowany do wnętrza.",
  "Podłoga żywiczna do kuchni, salonu i całego domu, także na ogrzewanie podłogowe.",
  "Transparentna wycena: najczęściej około 300 zł/m² za system do domu lub mieszkania.",
];

const stats = [
  { value: "300", label: "zł/m² najczęściej za system do domu lub mieszkania" },
  { value: "0", label: "fug i miejsc gromadzących brud" },
  { value: "1", label: "spójna powierzchnia od salonu po łazienkę i garaż" },
];

const benefits = [
  {
    title: "Bez fug, więc sprzątanie naprawdę jest prostsze",
    description:
      "Okruchy, kurz i zabrudzenia z kuchni nie wchodzą w szczeliny między płytkami. To jeden z najmocniejszych argumentów dla rodzin, alergików i właścicieli zwierząt.",
    icon: Sparkles,
  },
  {
    title: "Efekt premium, który robi wrażenie od wejścia",
    description:
      "Dobieramy kolor, stopień połysku i charakter powierzchni do wnętrz nowoczesnych, minimalistycznych, loft, japandi i premium, tak aby całość wyglądała jak z dobrze dopracowanego projektu.",
    icon: Home,
  },
  {
    title: "Trwałość na lata zamiast wymiany co kilka sezonów",
    description:
      "System do domu dobieramy pod codzienne użytkowanie: kuchnię, salon, dzieci, zwierzęta i przesuwane meble. W razie potrzeby powierzchnię można też odświeżyć lub zrenowować.",
    icon: ShieldCheck,
  },
  {
    title: "Jedna podłoga w całym domu lub mieszkaniu",
    description:
      "Salon, kuchnia, łazienka, korytarz, a nawet garaż mogą tworzyć jedną spójną powierzchnię bez progów i wizualnych podziałów.",
    icon: Layers3,
  },
  {
    title: "Bezpieczne wykończenie do konkretnego pomieszczenia",
    description:
      "Obawę o śliskość zamykamy doborem wykończenia: mat, półmat albo wariant antypoślizgowy tam, gdzie jest to potrzebne — np. w łazience lub przy wejściu.",
    icon: HeartHandshake,
  },
  {
    title: "Działa z ogrzewaniem podłogowym i nowoczesnym projektem",
    description:
      "Posadzka żywiczna bardzo dobrze współpracuje z ogrzewaniem podłogowym i wpisuje się w projekty prowadzone wspólnie z inwestorem lub architektem wnętrz.",
    icon: TimerReset,
  },
];

const spaces = [
  {
    title: "Kuchnia otwarta na salon",
    description:
      "Jedna powierzchnia wizualnie powiększa wnętrze, porządkuje strefę dzienną i daje mocniejszy efekt premium niż klasyczny podział: płytki plus panele.",
  },
  {
    title: "Cały dom lub całe mieszkanie",
    description:
      "Największą przewagę widać wtedy, gdy żywica łączy salon, kuchnię, łazienkę, hol i garaż w jedną spójną powierzchnię.",
  },
  {
    title: "Mieszkania premium i apartamenty",
    description:
      "To wybór dla klientów, którzy kupują oczami, ale chcą też realnej wygody w codziennym utrzymaniu wnętrza.",
  },
  {
    title: "Współpraca z architektem wnętrz",
    description:
      "Dostarczamy rozwiązanie, które łatwo wpisać w spójny projekt nowoczesnego, loftowego, industrialnego lub japandi wnętrza.",
  },
];

const process = [
  "Podajesz orientacyjny metraż, zakres prac i informację, czy zależy Ci na macie, półmacie czy mocniejszym efekcie dekoracyjnym.",
  "Ocenimy podłoże, zakres prac i dobierzemy system do domu, mieszkania lub całej inwestycji prowadzonej z architektem.",
  "Dostajesz konkretną wycenę, orientacyjny harmonogram oraz informację, jak przygotować wnętrze do realizacji.",
  "Wykonujemy posadzkę w ustalonym kolorze i strukturze, a po odbiorze przekazujemy zasady pielęgnacji oraz użytkowania.",
];

const questions = [
  {
    question: "Czy podłoga żywiczna w domu się rysuje?",
    answer:
      "Każda podłoga pracuje w codziennym użytkowaniu, ale dobrze dobrany system żywiczny jest odporny na typowe użytkowanie domowe. Dodatkowo brak fug eliminuje miejsca najszybszej degradacji, a powierzchnię można po latach odświeżyć lub zrenowować.",
  },
  {
    question: "Czy posadzka żywiczna jest śliska?",
    answer:
      "Nie musi być. Do wnętrza dobieramy odpowiednie wykończenie: mat, półmat lub wariant antypoślizgowy. Inny system rekomendujemy do salonu, a inny do łazienki czy strefy wejściowej.",
  },
  {
    question: "Ile kosztuje posadzka żywiczna do domu lub mieszkania?",
    answer:
      "Najczęściej trzeba liczyć około 300 zł/m². Finalna cena zależy od metrażu, stanu podłoża, wybranego systemu, koloru oraz tego, czy realizujemy jedną strefę czy cały dom lub mieszkanie.",
  },
  {
    question: "Czy można ją wykonać na ogrzewaniu podłogowym?",
    answer:
      "Tak. To jedno z często wybieranych rozwiązań do nowoczesnych domów i mieszkań. System dobieramy tak, aby dobrze współpracował z ogrzewaniem podłogowym i charakterem pomieszczenia.",
  },
  {
    question: "Ile trwa realizacja?",
    answer:
      "Najczęściej od 3 do 7 dni roboczych, zależnie od metrażu, stanu podłoża i wybranego systemu. Już przed startem prac dostajesz realny harmonogram oraz informację, kiedy można wrócić do normalnego użytkowania.",
  },
  {
    question: "Czy można dobrać kolor i efekt pod konkretny styl wnętrza?",
    answer:
      "Tak. To jeden z powodów, dla których architekci i inwestorzy wybierają żywicę do wnętrz nowoczesnych, minimalistycznych, loftowych, industrialnych, japandi i premium. Kolor, struktura i poziom połysku są dobierane indywidualnie.",
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
                Podłoga żywiczna bez fug, która wygląda
                <span className="text-primary"> jak z katalogu i sprawdza się na co dzień</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                To strona dla właścicieli domów i mieszkań oraz architektów
                wnętrz, którzy szukają efektu premium bez kompromisu w
                praktyczności. Pokazujemy, jak posadzka żywiczna sprawdza się w
                kuchni, salonie i całym domu — od designu, przez trwałość, aż po
                realny koszt i codzienne użytkowanie.
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
                  Orientacyjna cena: około 300 zł/m²
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
                  Spójna podłoga od kuchni po salon bez fug i wizualnych podziałów
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border bg-card p-6 shadow-sm">
                <p className="text-sm font-medium text-primary">Co interesuje klientów?</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>Czy podłoga nie będzie się szybko rysować lub niszczyć?</li>
                  <li>Czy w kuchni i salonie nie okaże się zbyt śliska?</li>
                  <li>Czy cena rzeczywiście ma sens wobec trwałości i efektu?</li>
                </ul>
              </div>
              <div className="rounded-[24px] border bg-card p-6 shadow-sm">
                <p className="text-sm font-medium text-primary">Jak odpowiadamy?</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Dobieramy system do użytkowania domowego, rekomendujemy mat,
                  półmat lub antypoślizg i pokazujemy, kiedy żywica jest lepszym
                  wyborem niż płytki, panele lub mikrocement.
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
            Najpierw kupujesz oczami. Potem doceniasz, że ta podłoga naprawdę
            ułatwia codzienne życie.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Najmocniejsze argumenty klientów indywidualnych są zawsze te same:
            brak fug, efekt premium i spokój na lata. Właśnie na tych trzech
            przewagach budujemy realizacje do domów i mieszkań.
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
              Największą przewagę widać wtedy, gdy myślisz o wnętrzu całościowo,
              a nie tylko o jednym pomieszczeniu.
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Podłoga żywiczna najlepiej wypada w domach i mieszkaniach, w
              których chcesz zachować jedną estetykę od kuchni, przez salon, po
              kolejne strefy. To mocny argument także dla architektów wnętrz.
            </p>
            <div className="rounded-[24px] border bg-background p-6 shadow-sm">
              <p className="flex items-center gap-2 text-base font-medium">
                <Droplets className="h-5 w-5 text-primary" />
                Tu design odpowiada za decyzję, a praktyczność zamyka sprzedaż.
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Dlatego coraz częściej żywica wygrywa z zestawem „płytki w
                kuchni i panele w salonie”, zwłaszcza gdy inwestor chce spójnej,
                nowoczesnej powierzchni bez fug.
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
              Ta sekcja ma zamknąć najczęstszy dylemat inwestora: który materiał
              da najlepszy efekt wizualny, będzie najłatwiejszy w utrzymaniu i
              nie rozbije wnętrza na kilka różnych powierzchni.
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
              Konkretne realizacje sprzedają lepiej niż ogólne obietnice.
            </h2>
            <p className="text-lg leading-8 text-slate-300">
              Obsługujemy inwestycje w województwie podkarpackim, małopolskim i
              lubelskim. Poniżej pokazujemy przykładowe realizacje oraz typy
              projektów, o które klienci pytają najczęściej.
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
              Najprostszy komunikat działa najlepiej: najczęściej to około 300
              zł/m² i od razu wiadomo, o jakim budżecie mówimy.
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Taki punkt odniesienia ułatwia pierwszą rozmowę i pozwala szybciej
              ocenić, czy szukasz rozwiązania do samej kuchni z salonem, czy od
              razu do całego domu lub mieszkania. To wygodne także dla
              architekta, który chce od razu sprawdzić zakres, budżet i
              możliwości kolorystyczne.
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
            Ta sekcja łączy sprzedaż z techniką: zamyka obawy o trwałość,
            śliskość, koszt, ogrzewanie podłogowe i czas realizacji.
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
                Najczęściej to około 300 zł/m² — sprawdź, czy posadzka żywiczna
                będzie dobrym wyborem do Twojego domu lub mieszkania.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                To prosty punkt odniesienia, który pomaga od razu ocenić budżet
                i porównać żywicę z innymi materiałami. Podpowiemy, jaki system
                sprawdzi się najlepiej, jaki efekt wizualny możesz osiągnąć i
                czy warto prowadzić jedną powierzchnię przez kuchnię, salon i
                kolejne pomieszczenia.
              </p>
            </div>

            <div className="rounded-[28px] border bg-background/90 p-6 shadow-sm">
              <p className="text-lg font-semibold">Co możesz zrobić teraz?</p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Podaj planowany metraż i miejscowość.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Napisz, czy chodzi o kuchnię z salonem, czy o cały dom.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Określ, czy zależy Ci na macie, półmacie, połysku lub antypoślizgu.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Zapytaj o wariant do kuchni z salonem albo o spójną posadzkę do całego domu.
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="gap-2">
                  <Link href="/kontakt">
                    Orientacyjna cena: około 300 zł/m²
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
