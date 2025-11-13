import { Check, MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const FAQ2 = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <Badge variant="outline">FAQ</Badge>
          <div className="flex gap-2 flex-col">
            <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
              Najczęściej zadawane pytania dotyczące posadzki żywicznej w garażu
            </h4>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              Odpowiadamy na najczęstsze pytania klientów dotyczące posadzek żywicznych w garażu aby pomóc w lepszym zrozumieniu procesu i naszych usług.
            </p>
          </div>
        </div>

        <div className="max-w-3xl w-full mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={"index-" + index}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p>{item.answer}</p>
                  {/* <Link className="mt-10 mb-8" href={item.link}>
                    Przeczytaj całą odpowiedź na blogu <MoveRight className="w-4 h-4 inline-block " />
                  </Link> */}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div>
            <p className="pt-10 font-medium">Jeśli są jakieś pytania na które szukasz odpowiedzi a tutaj ich nie ma, daj nam znać! </p>
            {/* <Button className="gap-4 mt-8" variant="outline">
              Masz inne pytania? Zadzwoń: 123 123 123 <PhoneCall className="w-4 h-4" />
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Przykładowe pytania i odpowiedzi FAQ
const faqItems = [
  {
    question: "Ile kosztuje posadzka żywiczna w garażu?",
    answer: "Cena posadzki żywicznej w garażu zależy od rodzaju żywicy oraz technologii wykonania. Posadzka epoksydowa cienkowarstwowa to koszt od 150 do 200 zł/m², natomiast żywica poliuretanowa z dodatkiem piasku kwarcowego lub w wersji grubowarstwowej może kosztować od 300 do 400 zł/m². W cenę wlicza się przygotowanie podłoża, gruntowanie, aplikację warstw i ewentualne wykończenie dekoracyjne. Posadzka żywiczna jest inwestycją w trwałość, estetykę i łatwe utrzymanie czystości w garażu.",
    link: "/blog/ile-kosztuje-posadzka-zywiczna-w-garazu"
  },
  {
    question: "Czy można wykonać posadzkę żywiczną w garażu samodzielnie?",
    answer: "Posadzkę żywiczną w garażu można wykonać samodzielnie, jednak wymaga to odpowiedniego przygotowania podłoża, znajomości technologii i użycia profesjonalnych narzędzi. Cienkowarstwowe systemy epoksydowe są dostępne w zestawach DIY, natomiast posadzki grubowarstwowe lub z kruszywem kwarcowym najlepiej powierzyć doświadczonej firmie. Profesjonalne wykonanie zapewnia większą trwałość i odporność na uszkodzenia mechaniczne oraz chemiczne.",
    link: "/blog/czy-mozna-wykonac-posadzke-zywiczna-samodzielnie"
  },
  {
    question: "Czy można zrobić cokoły z żywicy w garażu?",
    answer: "Tak, wykonanie cokołów z żywicy w garażu jest możliwe i zalecane, szczególnie jeśli zależy nam na łatwym utrzymaniu czystości i dodatkowej ochronie ścian. Standardowa wysokość cokołu to około 10 cm, a jego wykonanie polega na wyciągnięciu masy żywicznej na ścianę w formie zaokrąglonej lub prostokątnej listwy. Dzięki temu unikamy gromadzenia się brudu i wody w narożnikach.",
    link: "/blog/czy-mozna-zrobic-cokoly-z-zywicy-w-garazu"
  },
  {
    question: "Czy posadzka żywiczna nadaje się na zewnątrz, np. na taras?",
    answer: "Posadzka żywiczna może być stosowana na zewnątrz, ale wymaga wyboru odpowiedniego systemu. Do tarasów i balkonów zaleca się żywice poliuretanowe, które są odporne na promieniowanie UV i zmienne warunki atmosferyczne. Żywice epoksydowe, choć bardzo trwałe, mogą żółknąć pod wpływem słońca i wymagają dodatkowego zabezpieczenia lakierem UV.",
    link: "/blog/czy-posadzka-zywiczna-nadaje-sie-na-taras"
  },
  {
    question: "Czy żywica epoksydowa w garażu żółknie od słońca?",
    answer: "Żywica epoksydowa w garażu może żółknąć pod wpływem promieniowania UV, zwłaszcza jeśli garaż ma duże przeszklenia lub jest często otwarty. Aby tego uniknąć, można zastosować system poliuretanowy lub pokryć epoksyd lakierem odpornym na UV. W przypadku miejsc narażonych na intensywne nasłonecznienie wybór żywicy poliuretanowej jest bezpieczniejszy.",
    link: "/blog/czy-zywica-epoksydowa-zolknie-od-slonca"
  },
  {
    question: "Czy posadzka żywiczna sprawdzi się z ogrzewaniem podłogowym?",
    answer: "Tak, posadzka żywiczna w garażu jest w pełni kompatybilna z ogrzewaniem podłogowym. Jej cienka warstwa i doskonała przewodność cieplna pozwalają na szybkie przenikanie ciepła, co poprawia komfort użytkowania. Dodatkowo, brak fug i szczelin sprawia, że powierzchnia jest łatwa w utrzymaniu czystości.",
    link: "/blog/posadzka-zywiczna-a-ogrzewanie-podlogowe"
  },
  {
    question: "Czy posadzka żywiczna w garażu wytrzyma ruch samochodu?",
    answer: "Posadzka żywiczna w garażu, wykonana w odpowiednim systemie, jest bardzo odporna na obciążenia mechaniczne i codzienny ruch samochodów. Przy prawidłowym przygotowaniu podłoża i zastosowaniu żywic przemysłowych z kruszywem kwarcowym, nawierzchnia jest odporna na ścieranie, pęknięcia i odkształcenia.",
    link: "/blog/czy-posadzka-zywiczna-wytrzyma-ruch-samochodu"
  },
  {
    question: "Jak czyścić posadzkę żywiczną w garażu?",
    answer: "Posadzkę żywiczną w garażu najlepiej czyścić przy użyciu miękkiego mopa lub szczotki oraz łagodnych detergentów. Należy unikać agresywnych środków chemicznych, które mogą uszkodzić powłokę. Plamy z oleju lub smaru warto usuwać jak najszybciej, aby nie wniknęły w powierzchnię. Regularne mycie i ewentualne odświeżanie lakieru ochronnego wydłużają żywotność posadzki.",
    link: "/blog/jak-czyscic-posadzke-zywiczna-w-garazu"
  },
  {
    question: "Czy posadzka żywiczna jest odporna na wysokie temperatury i chemikalia?",
    answer: "Tak, wysokiej jakości posadzki żywiczne do garażu są odporne na temperatury generowane przez koła pojazdu oraz na większość substancji chemicznych, takich jak oleje, paliwa czy sól drogowa. Warto jednak sprawdzić kartę techniczną danego produktu, ponieważ odporność może się różnić w zależności od rodzaju żywicy i producenta.",
    link: "/blog/posadzka-zywiczna-a-wysoka-temperatura-i-chemikalia"
  },
  {
    question: "Czym różni się żywica epoksydowa od poliuretanowej?",
    answer: "Żywica epoksydowa jest twarda, odporna na ścieranie i stosunkowo tańsza, ale nie jest odporna na promieniowanie UV. Żywica poliuretanowa jest bardziej elastyczna, odporna na UV i zmienne temperatury, jednak kosztuje więcej. W garażu zamkniętym można stosować epoksyd, a w miejscach narażonych na słońce — poliuretan.",
    link: "/blog/zywica-epoksydowa-vs-poliuretanowa"
  },
  {
    question: "Czy posadzka żywiczna jest bezpieczna dla zdrowia?",
    answer: "Po pełnym utwardzeniu posadzka żywiczna jest całkowicie bezpieczna dla zdrowia. Nie emituje szkodliwych oparów, jest antybakteryjna, antystatyczna i przyjazna alergikom. W trakcie aplikacji należy jednak stosować odpowiednie środki ochrony osobistej ze względu na emisję oparów w procesie wiązania.",
    link: "/blog/czy-posadzka-zywiczna-jest-bezpieczna-dla-zdrowia"
  },
  {
    question: "Czy posadzka żywiczna pochłania olej i smary?",
    answer: "Posadzka żywiczna w garażu jest odporna na wnikanie olejów, smarów i innych płynów eksploatacyjnych. Jej gładka, nieporowata powierzchnia ułatwia czyszczenie i zapobiega trwałym zabrudzeniom. W przypadku kontaktu z substancjami ropopochodnymi zaleca się szybkie usunięcie plamy.",
    link: "/blog/czy-posadzka-zywiczna-pochlania-olej"
  },
  {
    question: "Czy opony samochodowe mogą odbarwiać posadzkę żywiczną?",
    answer: "Niektóre opony, szczególnie nowe lub sportowe, mogą powodować miejscowe odbarwienia posadzki żywicznej w garażu. Wynika to z migracji związków chemicznych zawartych w gumie. Aby uniknąć tego problemu, warto stosować maty ochronne lub wybierać systemy żywic odporne na tego typu reakcje.",
    link: "/blog/czy-opony-odbarwiaja-posadzke-zywiczna"
  },
  {
    question: "Jak przygotować podłoże pod posadzkę żywiczną?",
    answer: "Podłoże pod posadzkę żywiczną w garażu musi być czyste, suche i nośne. Należy usunąć stare powłoki, uzupełnić ubytki, odkurzyć powierzchnię i zastosować odpowiedni grunt. Prawidłowe przygotowanie jest kluczowe dla trwałości i odporności całej powłoki.",
    link: "/blog/jak-przygotowac-podloze-pod-posadzke-zywiczna"
  },
  {
    question: "Jak dobrać odpowiednią żywicę do garażu?",
    answer: "Wybierając żywicę do garażu, należy zwrócić uwagę na odporność mechaniczną, chemiczną, odporność na UV oraz warunki eksploatacji. Do garaży zamkniętych dobrze sprawdzi się żywica epoksydowa, a do garaży otwartych lub częściowo nasłonecznionych — poliuretanowa.",
    link: "/blog/jak-dobrac-zywice-do-garazu"
  }
];

