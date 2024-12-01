import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from 'next/image';

// Przykładowe dane
const features = [
  {
    id: 1,
    title: "Odporność na chemikalia",
    description:
      "Posadzki żywiczne są wyjątkowo odporne na deszcz, śnieg, mróz i promieniowanie UV, co sprawia, że nie pękają ani nie blakną, zapewniając trwałość przez wiele lat.",
    image: "/garaz/beton-plamy.jpg",
    alt: "Posadzka żywiczna czyszczenie",
    link: "#",
  },
  {
    id: 2,
    title: "Łatwość w czyszczeniu",
    description:
      "Powierzchnie z żywicy są łatwe w utrzymaniu, wystarczy przetrzeć wilgotną szmatką, aby usunąć zabrudzenia i zachować piękny wygląd.",
    image: "/sprzatanie-balokonu-2.jpg",
    alt: "Czyszczenie posadzki żywicznej",
    link: "#",
  },
  {
    id: 3,
    title: "Estetyka",
    description:
      "Posadzki żywiczne pozwalają na stworzenie unikalnych wzorów i kolorów, które można dostosować do stylu balkonu lub tarasu, dodając elegancji i nowoczesności.",
    image: "/garaz/garaz-hala.png",
    alt: "estetyka powierzchni balkonu",
    link: "#",
  },
  {
    id: 4,
    title: "UV odporna",
    description:
      "Posadzka nie blaknie i zachowuje kolor na lata, nawet przy intensywnym nasłonecznieniu.",
    image: "/uvprotect.jpg",
    alt: "Odporność UV",
    link: "#",
  },
  {
    id: 5,
    title: "Bezpieczeństwo",
    description:
      "Antypoślizgowa powierzchnia zapewnia bezpieczeństwo użytkowania.",
    image: "/antypolizg.jpg",
    alt: "Antypoślizg",
    link: "#",
  },
];

export const FeatureList = ({ features }) => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <h2 className="text-xl md:text-3xl lg:text-5xl tracking-tighter font-medium text-left mb-20">
        Najważniesze zalety
      </h2>
      <div className="flex flex-col gap-10">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`flex flex-col lg\:py-20 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-10 lg:items-center`}
          >
            <Image
              src={feature.image}
              width={608}
              height={342}
              alt={feature.alt}
              className="rounded-md aspect-video h-full flex-1 order-1 lg:order-none"
            />
            <div className="flex gap-4 pl-0 lg:pl-20 flex-col flex-1">
              <div className="flex gap-2 flex-col">
                <h2 className="text-xl md:text-3xl lg:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
                  {feature.title}
                </h2>
                <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
                  {feature.description}
                </p>
              </div>
              {/* <Button variant="outline" size="sm" className="gap-4 w-fit">
                Czytaj więcej<MoveRight className="w-4 h-4" />
              </Button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Feature3 = () => <FeatureList features={features} />;
