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
  "Bez fug, progów i trudnych miejsc do czyszczenia",
  "Wykończenie dopasowane do stylu kuchni, salonu i całego domu",
  "Odporność na codzienne użytkowanie, plamy i wilgoć",
];

const stats = [
  { value: "1", label: "spójna posadzka w całej strefie dziennej" },
  { value: "0", label: "fug i miejsc gromadzących brud" },
  { value: "100%", label: "projektu dopasowanego do wnętrza" },
];

const benefits = [
  {
    title: "Łatwe sprzątanie na co dzień",
    description:
      "Gładka powierzchnia bez fug sprawia, że okruchy, kurz i zabrudzenia z kuchni nie zatrzymują się między płytkami.",
    icon: Sparkles,
  },
  {
    title: "Komfort w salonie i kuchni",
    description:
      "System dobieramy do pomieszczenia tak, aby podłoga była przyjemna w odbiorze i dobrze pracowała w przestrzeni mieszkalnej.",
    icon: Home,
  },
  {
    title: "Odporność na domowe wyzwania",
    description:
      "Rozlana kawa, woda przy zlewie, przesuwane krzesła czy intensywne użytkowanie nie muszą oznaczać szybkiego zużycia podłogi.",
    icon: ShieldCheck,
  },
  {
    title: "Nowoczesny efekt premium",
    description:
      "Mat, satyna lub delikatny połysk pozwalają uzyskać elegancki efekt dopasowany do mebli, ścian i światła we wnętrzu.",
    icon: Layers3,
  },
  {
    title: "Bezpieczne rozwiązanie dla rodziny",
    description:
      "Dobieramy parametry antypoślizgowe i sposób wykończenia tak, aby dom był wygodny dla dzieci, dorosłych i zwierząt.",
    icon: HeartHandshake,
  },
  {
    title: "Remont zaplanowany krok po kroku",
    description:
      "Klient od początku wie, jak wygląda przygotowanie podłoża, harmonogram prac, czas schnięcia i moment pełnego użytkowania.",
    icon: TimerReset,
  },
];

const spaces = [
  {
    title: "Kuchnia otwarta na salon",
    description:
      "Jedna powierzchnia wizualnie powiększa wnętrze i buduje spokojny, uporządkowany efekt.",
  },
  {
    title: "Mieszkania premium i apartamenty",
    description:
      "To świetny wybór tam, gdzie liczy się detal, nowoczesna estetyka i łatwe utrzymanie czystości.",
  },
  {
    title: "Domy jednorodzinne",
    description:
      "Rozwiązanie sprawdza się w intensywnie używanej strefie dziennej, łącząc design z trwałością.",
  },
  {
    title: "Wnętrza po generalnym remoncie",
    description:
      "Posadzka żywiczna dobrze wpisuje się w projekty, w których chcesz uniknąć podziałów między pomieszczeniami.",
  },
];

const process = [
  "Rozmowa o wnętrzu, stylu życia domowników i oczekiwanym efekcie.",
  "Ocena podłoża oraz dobór systemu odpowiedniego do domu lub mieszkania.",
  "Przygotowanie powierzchni, naprawy i wykonanie warstw roboczych.",
  "Wykończenie w ustalonym kolorze i strukturze oraz przekazanie zasad pielęgnacji.",
];

const questions = [
  {
    question: "Czy posadzka żywiczna nadaje się do kuchni?",
    answer:
      "Tak. W kuchni ceniona jest za łatwe czyszczenie, brak fug, odporność na wilgoć oraz elegancki wygląd w codziennym użytkowaniu.",
  },
  {
    question: "Czy taka podłoga pasuje również do salonu?",
    answer:
      "Tak, szczególnie w nowoczesnych i minimalistycznych wnętrzach. Jednolita powierzchnia porządkuje przestrzeń i dobrze łączy kuchnię z częścią wypoczynkową.",
  },
  {
    question: "Czy posadzka żywiczna jest zimna i twarda?",
    answer:
      "Odbiór zależy od wybranego systemu oraz podłoża. Przy doborze rozwiązania bierzemy pod uwagę komfort użytkowania, ogrzewanie podłogowe i charakter wnętrza.",
  },
  {
    question: "Jak wygląda pielęgnacja w domu lub mieszkaniu?",
    answer:
      "Na co dzień wystarcza odkurzanie i mycie delikatnym środkiem. Brak fug znacząco ogranicza miejsca, w których zwykle gromadzi się brud.",
  },
  {
    question: "Czy można dobrać kolor do aranżacji wnętrza?",
    answer:
      "Tak. Dobieramy odcień, poziom połysku i finalny charakter powierzchni tak, aby współgrały z meblami, światłem i stylem całego wnętrza.",
  },
  {
    question: "Ile trwa realizacja?",
    answer:
      "Termin zależy od stanu podłoża, metrażu i wybranego systemu, ale klient jeszcze przed startem prac otrzymuje czytelny plan kolejnych etapów.",
  },
];

const gallery = [
  {
    title: "Strefa dzienna bez podziałów",
    description:
      "Jedna powierzchnia od kuchni po salon daje spójny i spokojny efekt wizualny.",
    image: "/mieszkanie.jpg",
    alt: "Posadzka żywiczna w nowoczesnym mieszkaniu",
  },
  {
    title: "Kuchnia gotowa na codzienność",
    description:
      "Powierzchnia łatwa do utrzymania w czystości i odporna na typowe zabrudzenia.",
    image: "/kuchnia.jpg",
    alt: "Posadzka żywiczna w kuchni",
  },
  {
    title: "Inspiracja do Twojej realizacji",
    description:
      "Tutaj możemy pokazać kolejne zdjęcie Twojej kuchni, salonu lub całej strefy dziennej.",
    image: "/mieszkanie/DeWatermark.ai_1732886162387.png",
    alt: "Nowoczesne wnętrze domu z posadzką żywiczną",
  },
];

const visualSlots = [
  "Zdjęcie detalu przy wyspie kuchennej",
  "Zdjęcie szerokiego planu salonu",
  "Zdjęcie zbliżenia struktury i koloru",
];

export default function KitchenLivingPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.08),_transparent_35%)]" />
        <div className="container relative grid gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div className="space-y-8">
            <Badge variant="outline" className="rounded-full px-4 py-1 text-sm">
              Kuchnia • salon • domy i mieszkania
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Posadzki żywiczne do domu i mieszkania, które robią efekt
                <span className="text-primary"> od pierwszego wejścia</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Jeśli chcesz wiedzieć więcej niż tylko „czy to ładnie wygląda”,
                tutaj znajdziesz odpowiedzi. Pokazujemy, jak posadzka żywiczna
                sprawdza się w kuchni, salonie i otwartej strefie dziennej —
                od estetyki, przez trwałość, aż po codzienne użytkowanie.
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
                  Spójna podłoga od kuchni po salon bez fug i wizualnych podziałów
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border bg-card p-6 shadow-sm">
                <p className="text-sm font-medium text-primary">Co interesuje klientów?</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>Czy podłoga będzie praktyczna przy dzieciach i zwierzętach?</li>
                  <li>Czy łatwo utrzymać ją w czystości przy otwartej kuchni?</li>
                  <li>Jak będzie wyglądać po kilku latach użytkowania?</li>
                </ul>
              </div>
              <div className="rounded-[24px] border bg-card p-6 shadow-sm">
                <p className="text-sm font-medium text-primary">Jak pomagamy?</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Tłumaczymy różnice między systemami, dobieramy wykończenie do
                  wnętrza i pokazujemy, na co zwrócić uwagę przed podjęciem
                  decyzji.
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
            Nie tylko ładna podłoga. To rozwiązanie, które odpowiada na realne
            potrzeby domowników.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Klienci wybierający posadzkę do domu pytają o codzienność: sprzątanie,
            trwałość, bezpieczeństwo i wygląd po czasie. Dlatego ta strona
            prowadzi przez wszystkie najważniejsze zagadnienia.
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
              Posadzka żywiczna w kuchni i salonie szczególnie dobrze wypada tam,
              gdzie chcesz uzyskać efekt spójnego wnętrza.
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              To rozwiązanie dla osób, które myślą o domu całościowo i nie chcą
              walczyć z łączeniami materiałów, fugami oraz wizualnym chaosem
              między pomieszczeniami.
            </p>
            <div className="rounded-[24px] border bg-background p-6 shadow-sm">
              <p className="flex items-center gap-2 text-base font-medium">
                <Droplets className="h-5 w-5 text-primary" />
                Kuchnia i salon to miejsce, w którym estetyka musi iść w parze z
                praktycznością.
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Właśnie dlatego klienci coraz częściej wybierają posadzki
                żywiczne zamiast klasycznych podziałów: płytki w kuchni, panele
                w salonie.
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
              Zdjęcia i inspiracje
            </Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Miejsce na realizacje, inspiracje i zdjęcia, które pomagają podjąć
              decyzję.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Poniżej pokazujemy przykładowe ujęcia oraz gotowe sloty pod kolejne
              fotografie wnętrz. Dzięki temu sekcja może rosnąć razem z nowymi
              realizacjami.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-6 md:grid-cols-2">
            {gallery.slice(0, 2).map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-[28px] border bg-card shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[28px] border bg-card shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src={gallery[2].image}
                  alt={gallery[2].alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{gallery[2].title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {gallery[2].description}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {visualSlots.map((slot) => (
                <div
                  key={slot}
                  className="rounded-[24px] border border-dashed bg-muted/40 p-5"
                >
                  <p className="text-sm font-medium">{slot}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Rezerwowe miejsce na kolejne zdjęcie realizacji lub render,
                    jeśli będziemy rozbudowywać landing page o nową galerię.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-slate-950 text-white">
        <div className="container grid gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:py-24">
          <div className="space-y-5">
            <Badge className="rounded-full border-white/20 bg-white/10 px-4 py-1 text-sm text-white hover:bg-white/10">
              Jak wygląda współpraca
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Klient nie zostaje sam z pytaniami — od pierwszej rozmowy wie, co
              wydarzy się dalej.
            </h2>
            <p className="text-lg leading-8 text-slate-300">
              Dobra strona sprzedażowa nie tylko inspiruje, ale też porządkuje
              proces. To ważne zwłaszcza przy inwestycjach w domach i
              mieszkaniach, gdzie liczy się harmonogram, czystość prac i
              bezpieczeństwo decyzji.
            </p>
          </div>

          <div className="grid gap-4">
            {process.map((step, index) => (
              <div
                key={step}
                className="rounded-[24px] border border-white/10 bg-white/5 p-6"
              >
                <p className="text-sm font-medium text-slate-300">
                  Krok {index + 1}
                </p>
                <p className="mt-2 text-base leading-7 text-white">{step}</p>
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
            Najczęstsze pytania o posadzki żywiczne w domach i mieszkaniach
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Ta sekcja powstała z myślą o kliencie, który przed decyzją chce znać
            odpowiedzi na konkretne pytania — praktyczne, techniczne i estetyczne.
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
                Chcesz sprawdzić, czy posadzka żywiczna będzie dobrym wyborem do
                Twojej kuchni lub salonu?
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                Porozmawiajmy o wnętrzu, stylu życia domowników, oczekiwaniach i
                budżecie. Doradzimy uczciwie, czy to rozwiązanie pasuje do Twojego
                domu lub mieszkania.
              </p>
            </div>

            <div className="rounded-[28px] border bg-background/90 p-6 shadow-sm">
              <p className="text-lg font-semibold">Co możesz zrobić teraz?</p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Wyślij zdjęcia wnętrza i planowany metraż.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Opowiedz, czy zależy Ci bardziej na macie, satynie czy połysku.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  Zapytaj o wariant najlepiej dopasowany do domu lub mieszkania.
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="gap-2">
                  <Link href="/kontakt">
                    Skontaktuj się z nami
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
