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
              Najczęściej zadawane pytania dotyczące posadzek w przemyśle spożywczym
            </h4>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              Odpowiadamy na najczęstsze pytania klientów z branży spożywczej dotyczące norm HACCP, certyfikatów i właściwości posadzek żywicznych.
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
    question: "Czy posadzka żywiczna spełnia wymagania systemu HACCP?",
    answer: "Tak. Posadzki żywiczne (epoksydowe i poliuretanowe) są bezszwowe, nienasiąkliwe i odporne chemicznie, co w pełni spełnia wymagania systemu HACCP dotyczące powierzchni w kontakcie pośrednim z żywnością. Eliminują fugi — główne siedlisko bakterii i grzybów.",
    link: "/blog/posadzka-zywiczna-haccp"
  },
  {
    question: "Jakie certyfikaty potwierdzają dopuszczenie posadzki do stosowania w przemyśle spożywczym?",
    answer: "Stosowane przez nas materiały posiadają atest PZH (Państwowego Zakładu Higieny) dopuszczający je do stosowania w obiektach przemysłu spożywczego. Możemy dostarczyć dokumentację wymaganą przez audyty BRC, IFS Food, ISO 22000 oraz inspekcję sanitarną.",
    link: "/blog/certyfikaty-posadzki-spozywcze"
  },
  {
    question: "Co to jest atest PZH i dlaczego jest ważny?",
    answer: "Atest PZH (Państwowego Zakładu Higieny) to polska certyfikacja potwierdzająca, że materiał jest bezpieczny higienicznie i może być stosowany w miejscach produkcji lub przetwarzania żywności. Jest wymagany przez Sanepid oraz wiele systemów audytowych.",
    link: "/blog/atest-pzh-posadzki"
  },
  {
    question: "Na jakie substancje chemiczne jest odporna posadzka w kuchni przemysłowej?",
    answer: "Posadzki poliuretanowe i epoksydowe są odporne na kwasy spożywcze (mlekowy, octowy, cytrynowy), tłuszcze zwierzęce i roślinne, oleje, zasady (NaOH, KOH), chlor i inne przemysłowe środki dezynfekujące stosowane w branży spożywczej.",
    link: "/blog/odpornosc-chemiczna-posadzki-spozywczej"
  },
  {
    question: "Czy posadzka żywiczna wytrzymuje mycie gorącą wodą i parą?",
    answer: "Tak. Posadzki poliuretanowe dedykowane do przemysłu spożywczego wytrzymują temperaturę do 80°C i działanie pary wodnej. Są odporne na gwałtowne zmiany temperatur (ang. thermal shock), co jest kluczowe przy myciu myjkami wysokociśnieniowymi na gorąco.",
    link: "/blog/posadzka-para-wodna-temperatura"
  },
  {
    question: "Jaka klasa antypoślizgowości jest wymagana w kuchniach i zakładach spożywczych?",
    answer: "W strefach stale mokrych (kuchnie przemysłowe, ubojnie, myjnie) zalecana jest klasa R11 lub wyższa (R12). Oferujemy posadzki spełniające te normy, co jest wymagane przez audyty BRC Food Safety i IFS Food oraz przepisy BHP.",
    link: "/blog/antypolizgowos-klasa-r11-r12-branza-spozywcza"
  },
  {
    question: "Jak długo trwa montaż posadzki w czynnym zakładzie produkcyjnym?",
    answer: "Czas wykonania zależy od powierzchni i stanu podłoża. Typowo dla kuchni przemysłowej lub hali produkcyjnej do 500 m² prace trwają 3–5 dni roboczych (frezowanie, gruntowanie, właściwa posadzka, lakierowanie). Możliwa realizacja etapowa, aby nie wstrzymywać produkcji.",
    link: "/blog/czas-montazu-posadzki-zaklad"
  },
  {
    question: "Jak utrzymywać czystość posadzki żywicznej w zakładzie spożywczym?",
    answer: "Posadzkę można myć codziennie myjkami ciśnieniowymi, automatami szorującymi i wszelkimi środkami myjąco-dezynfekującymi dopuszczonymi do kontaktu z żywnością. Nie wymaga specjalnych konserwantów ani wosków — wystarczy standardowy protokół CIP/COP stosowany w zakładach.",
    link: "/blog/czyszczenie-posadzki-zaklad-spozywczy"
  }
];

