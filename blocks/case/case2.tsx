"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

const logosData = [
  {
    src: "/firmy-wspolpraca/renoplast-logo.png",
    alt: "renoplast",
  },
  {
    src: "/firmy-wspolpraca/sicon-logo.png",
    alt: "sicon logo",
  },
  {
    src: "/firmy-wspolpraca/sika-logo.webp",
    alt: "sicon-logo3",
  },
  {
    src: "/firmy-wspolpraca/sopro-logo.png",
    alt: "Logo firmy 4",
  },
  {
    src: "/firmy-wspolpraca/weber-logo.webp",
    alt: "Logo firmy 5",
  },
  {
    src: "/firmy-wspolpraca/weber-logo.webp",
    alt: "Logo firmy 5",
  },
  {
    src: "/firmy-wspolpraca/weber-logo.webp",
    alt: "Logo firmy 5",
  },
  {
    src: "/firmy-wspolpraca/weber-logo.webp",
    alt: "Logo firmy 5",
  },
  {
    src: "/firmy-wspolpraca/weber-logo.webp",
    alt: "Logo firmy 5",
  },
  {
    src: "/firmy-wspolpraca/weber-logo.webp",
    alt: "Logo firmy 5",
  },
  {
    src: "/firmy-wspolpraca/weber-logo.webp",
    alt: "Logo firmy 5",
  },
  // Dodaj więcej logotypów tutaj
];

export const Case2 = () => {
  const [api, setApi] = useState<CarouselApi>();

  // Konfiguracja opcji karuzeli
  const carouselOptions = {
    loop: true,  // Pętla do nieskończonego przewijania
    stopOnInteraction: true,
    jump: true   // Możesz ustawić prędkość dla płynności
  };

  return (
    <div className="w-full py-20 lg:py-10">
      <div className="container mx-auto">
        <h3 className="text-xl tracking-tighter lg:max-w-xl font-regular text-left mb-5">
          Współpracujemy z najlepszymi
        </h3>
        <div className="grid grid-cols-1 gap-10 items-center">
          <div className="relative w-full col-span-4">
            <div className="bg-gradient-to-r from-background via-white/0 to-background z-10 absolute left-0 top-0 right-0 bottom-0 w-full h-full"></div>
            <Carousel setApi={setApi} opts={carouselOptions} className="w-full">
              <CarouselContent>
                {logosData.map((logo, index) => (
                  <CarouselItem className="basis-1/4 lg:basis-1/6" key={index}>
                    <div className="flex rounded-md aspect-square bg-muted items-center justify-center p-2">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};
