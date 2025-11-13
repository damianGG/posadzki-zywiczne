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
              Najczęściej zadawane pytania dotyczące posadzki żywicznej w garażu.
            </h4>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              Odpowiadamy na najczęstsze pytania klientów dotyczące remontów posadzek żywicznych, aby pomóc w lepszym zrozumieniu procesu i naszych usług.
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
    question: "Jakie są zalety posadzek żywicznych w garażu?",
    answer: "Posadzki żywiczne są trwałe, odporne na ścieranie, chemikalia oraz łatwe w utrzymaniu czystości, co czyni je idealnym wyborem do garaży.",
    link: "/blog/zalety-posadzek-zywicznych-w-garazu"
  },
  {
    question: "Jaki rodzaj posadzki żywicznej wybrać do garażu?",
    answer: "Do garaży najczęściej polecane są posadzki epoksydowe ze względu na ich wysoką wytrzymałość mechaniczną i odporność na chemikalia.",
    link: "/blog/jaki-rodzaj-posadzki-zywicznej-wybrac-do-garazu"
  },
  {
    question: "Czy mogę samodzielnie wykonać posadzkę żywiczną w garażu?",
    answer: "Wykonanie posadzki żywicznej wymaga odpowiedniego przygotowania podłoża i precyzyjnego nałożenia materiału. Choć jest to możliwe do wykonania samodzielnie, zaleca się skorzystanie z usług profesjonalistów.",
    link: "/blog/czy-moge-samodzielnie-wykonac-posadzke-zywiczna-w-garazu"
  },
  {
    question: "Jak przygotować podłoże pod posadzkę żywiczną w garażu?",
    answer: "Podłoże powinno być suche, czyste, stabilne i odpylone. Wszelkie nierówności należy zeszlifować, a ubytki wypełnić zaprawami naprawczymi.",
    link: "/blog/jak-przygotowac-podloze-pod-posadzke-zywiczna-w-garazu"
  },
  {
    question: "Ile kosztuje wykonanie posadzki żywicznej w garażu?",
    answer: "Koszt posadzki żywicznej zależy od rodzaju użytej żywicy i metrażu, średnio wynosi od 100 do 200 zł za m².",
    link: "/blog/ile-kosztuje-wykonanie-posadzki-zywicznej-w-garazu"
  },
  {
    question: "Jak dbać o posadzkę żywiczną w garażu?",
    answer: "Regularne czyszczenie wodą z łagodnym detergentem oraz unikanie uszkodzeń mechanicznych pozwoli zachować posadzkę w dobrym stanie przez długie lata.",
    link: "/blog/jak-dbac-o-posadzke-zywiczna-w-garazu"
  },
  {
    question: "Czy posadzka żywiczna w garażu jest odporna na plamy z oleju?",
    answer: "Tak, posadzki żywiczne są odporne na plamy z oleju i innych chemikaliów, co ułatwia ich czyszczenie.",
    link: "/blog/czy-posadzka-zywiczna-w-garazu-jest-odporna-na-plamy-z-oleju"
  },
  {
    question: "Jakie są wady posadzek żywicznych w garażu?",
    answer: "Do wad posadzek żywicznych można zaliczyć ich stosunkowo wysoką cenę oraz konieczność profesjonalnego wykonania dla uzyskania optymalnych właściwości.",
    link: "/blog/jakie-sa-wady-posadzek-zywicznych-w-garazu"
  }
];

