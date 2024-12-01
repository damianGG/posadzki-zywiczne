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
              Najczęściej zadawane pytania dotyczące remontu balkonów i tarasów
            </h4>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              Odpowiadamy na najczęstsze pytania klientów dotyczące remontów balkonów, tarasów i posadzek, aby pomóc w lepszym zrozumieniu procesu i naszych usług.
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
    question: "Jakie są zalety posadzek żywicznych w mieszkaniach?",
    answer: "Posadzki żywiczne w mieszkaniach są trwałe, estetyczne, odporne na plamy i łatwe w utrzymaniu czystości. Idealnie nadają się do nowoczesnych wnętrz.",
    link: "/blog/zalety-posadzek-zywicznych-w-mieszkaniach"
  },
  {
    question: "Czy posadzka żywiczna jest odpowiednia do kuchni i salonu?",
    answer: "Tak, posadzki żywiczne są idealne do kuchni i salonów dzięki swojej trwałości, łatwości w czyszczeniu oraz możliwości stworzenia gładkiej, jednolitej powierzchni.",
    link: "/blog/czy-posadzka-zywiczna-jest-odpowiednia-do-kuchni-i-salonu"
  },
  {
    question: "Jakie rodzaje posadzek żywicznych są najlepsze do wnętrz?",
    answer: "Do wnętrz najczęściej stosuje się posadzki poliuretanowe lub epoksydowe. Poliuretanowe są bardziej elastyczne i przyjemne w dotyku, co sprawdza się w salonach i sypialniach.",
    link: "/blog/jakie-rodzaje-posadzek-zywicznych-sa-najlepsze-do-wnetrz"
  },
  {
    question: "Jak dbać o posadzkę żywiczną w mieszkaniu?",
    answer: "Posadzki żywiczne są łatwe w pielęgnacji – wystarczy regularne mycie wodą z delikatnym detergentem. Unikaj używania ostrych środków chemicznych.",
    link: "/blog/jak-dbac-o-posadzke-zywiczna-w-mieszkaniu"
  },
  {
    question: "Ile kosztuje wykonanie posadzki żywicznej w mieszkaniu?",
    answer: "Koszt zależy od rodzaju żywicy i powierzchni, ale średnio wynosi od 150 do 300 zł za m². Cena obejmuje materiały i wykonanie.",
    link: "/blog/ile-kosztuje-wykonanie-posadzki-zywicznej-w-mieszkaniu"
  },
  {
    question: "Czy posadzka żywiczna nadaje się do łazienek?",
    answer: "Tak, posadzki żywiczne są odporne na wilgoć, plamy i łatwe w czyszczeniu, co czyni je doskonałym wyborem do łazienek.",
    link: "/blog/czy-posadzka-zywiczna-nadaje-sie-do-lazienek"
  },
  {
    question: "Jakie są wady posadzek żywicznych w mieszkaniach?",
    answer: "Wadą może być ich stosunkowo wysoka cena oraz konieczność profesjonalnego wykonania. Dla niektórych osób powierzchnia może być zbyt jednolita.",
    link: "/blog/jakie-sa-wady-posadzek-zywicznych-w-mieszkaniach"
  },
  {
    question: "Czy mogę samodzielnie wykonać posadzkę żywiczną w domu?",
    answer: "Chociaż wykonanie posadzki żywicznej jest możliwe samodzielnie, wymaga precyzyjnego przygotowania podłoża i wiedzy o aplikacji. Zaleca się skorzystanie z usług profesjonalistów.",
    link: "/blog/czy-moge-samodzielnie-wykonac-posadzke-zywiczna-w-domu"
  }
];


