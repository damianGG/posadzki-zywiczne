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
    question: "Jak długo trwa remont balkonu lub tarasu?",
    answer: "Średni czas remontu balkonu lub tarasu wynosi od 1 do 2 tygodni, zależnie od zakresu prac i warunków pogodowych.",
    link: "/blog/jak-dlugo-trwa-remont-balkonu-lub-tarasu"
  },
  {
    question: "Czy podczas remontu tarasu mogę nadal korzystać z balkonu?",
    answer: "W zależności od zakresu prac, częściowa dostępność jest możliwa, jednak zaleca się pełne wyłączenie z użytkowania dla bezpieczeństwa.",
    link: "/blog/czy-podczas-remontu-tarasu-moge-korzystac-z-balkonu"
  },
  {
    question: "Jakie materiały są najlepsze do wykończenia tarasu?",
    answer: "Najczęściej stosowane są posadzki żywiczne, które są trwałe i odporne na warunki atmosferyczne.",
    link: "/blog/jakie-materialy-sa-najlepsze-do-wykonczenia-tarasu"
  },
  {
    question: "Czy mogę samodzielnie zabezpieczyć balkon przed zimą?",
    answer: "Tak, podstawowe zabezpieczenie, jak oczyszczenie powierzchni i zabezpieczenie uszkodzeń, może wykonać właściciel.",
    link: "/blog/czy-moge-samodzielnie-zabezpieczyc-balkon-przed-zima"
  },
  {
    question: "Czy żywica epoksydowa nadaje się na taras zewnętrzny?",
    answer: "Tak, żywice epoksydowe są odporne na warunki atmosferyczne, co czyni je idealnym wyborem na zewnątrz.",
    link: "/blog/czy-zywica-epoksydowa-nadaje-sie-na-taras-zewnetrzny"
  },
  {
    question: "Jak dbać o posadzkę żywiczną po remoncie?",
    answer: "Posadzki żywiczne wymagają regularnego czyszczenia i odpowiednich środków, aby zachować trwałość i estetykę.",
    link: "/blog/jak-dbac-o-posadzke-zywiczna-po-remoncie"
  },
  {
    question: "Jakie są koszty remontu balkonu lub tarasu?",
    answer: "Koszt remontu zależy od powierzchni, materiałów oraz zakresu prac, ale średni koszt wynosi od 500 do 1500 zł/m².",
    link: "/blog/jakie-sa-koszty-remontu-balkonu-lub-tarasu"
  },
  {
    question: "Czy posadzka żywiczna sprawdzi się w pomieszczeniach wewnętrznych?",
    answer: "Tak, posadzki żywiczne są idealne do pomieszczeń o dużej wilgotności, takich jak łazienki i kuchnie.",
    link: "/blog/czy-posadzka-zywiczna-sprawdzi-sie-w-pomieszczeniach-wewnetrznych"
  }
];
