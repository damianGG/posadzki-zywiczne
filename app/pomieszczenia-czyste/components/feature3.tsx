

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from 'next/image';

// Przykładowe dane
const features = [
  {
    id: 1,
    title: "Spełnia wymagania HACCP",
    description:
      "Bezszwowa powierzchnia bez fug i porów eliminuje miejsca, w których gromadzą się bakterie, pleśnie i resztki jedzenia. Posadzka żywiczna spełnia wszystkie wymagania systemu HACCP — kluczowego standardu bezpieczeństwa żywności.",
    image: "/gastronomia.jpg",
    alt: "Higieniczna posadzka żywiczna w kuchni przemysłowej zgodna z HACCP",
    link: "#",
  },
  {
    id: 2,
    title: "Odporność na środki myjące i dezynfekujące",
    description:
      "Posadzki poliuretanowe i epoksydowe wytrzymują działanie stężonych środków dezynfekujących, zasad, kwasów spożywczych (mlekowego, octowego, cytrynowego) oraz tłuszczów zwierzęcych i roślinnych bez utraty właściwości.",
    image: "/produkcja.jpg",
    alt: "Posadzka żywiczna w zakładzie produkcji spożywczej",
    link: "#",
  },
  {
    id: 3,
    title: "Bezszwowa powierzchnia — zero bakterii",
    description:
      "W przeciwieństwie do płytek ceramicznych, posadzka żywiczna nie ma fug — najbardziej newralgicznego miejsca dla rozwoju mikroorganizmów. Monolityczna powierzchnia jest w pełni szczelna i łatwa do codziennej dezynfekcji.",
    image: "/kuchnia.jpg",
    alt: "Bezszwowa posadzka żywiczna — czyste pomieszczenie produkcyjne",
    link: "#",
  },
  {
    id: 4,
    title: "Odporność termiczna i na parę wodną",
    description:
      "Posadzka wytrzymuje mycie gorącą wodą do 80°C i działanie pary wodnej, co jest niezbędne w kuchniach przemysłowych, browarach, mleczarniach i zakładach mięsnych. Brak ryzyka odwarstwienia ani pęknięć.",
    image: "/garaz/garaz-hala.png",
    alt: "Posadzka odporna na parę i wysoką temperaturę",
    link: "#",
  },
  {
    id: 5,
    title: "Antypoślizgowość R11 / R12",
    description:
      "Specjalna struktura powierzchni antypoślizgowej klasy R11 lub R12 zapewnia bezpieczeństwo pracowników nawet przy stałym zawilgoceniu i zabrudzeniu tłuszczem. Wymóg wielu audytów BRC i IFS Food.",
    image: "/antypolizg.jpg",
    alt: "Antypoślizgowa posadzka żywiczna R11 R12 dla branży spożywczej",
    link: "#",
  },
];

export const FeatureList = ({ features }) => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <h2 className="text-xl md:text-3xl lg:text-5xl tracking-tighter font-medium text-left mb-20">
        Kluczowe właściwości dla branży spożywczej
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
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Feature3 = () => <FeatureList features={features} />;
