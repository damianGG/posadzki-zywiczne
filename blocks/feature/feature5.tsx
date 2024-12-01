import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import Link from "next/link";

const featuresData = [
  {
    title: "Posadzki żywiczne na balkony",
    description: "Trwałe i odporne na warunki atmosferyczne rozwiązanie, które doda estetyki i funkcjonalności każdemu balkonowi.",
    imageSrc: "/IMG_2966.jpg",
    altText: "Posadzki żywiczne na balkony",
    href: "/posadzki-zywiczne-na-balkony"
  },
  {
    title: "Posadzki żywiczne na tarasy",
    description: "Eleganckie, odporne na wilgoć i promienie UV posadzki, idealne na tarasy. Twój taras stanie się trwałą i przyjemną przestrzenią do odpoczynku.",
    imageSrc: "/IMG_2538_422.jpg",
    altText: "Posadzki żywiczne na tarasy",
    href: "/posadzki-zywiczne-na-balkony"
  },
  {
    title: "Posadzki żywiczne do garaży",
    description: "Wytrzymałe i odporne na obciążenia posadzki, które zniosą codzienne użytkowanie i ochronią powierzchnię Twojego garażu.",
    imageSrc: "/garage.jpg",
    altText: "Posadzki żywiczne do garaży",
    href: "/garaze"
  },
  {
    title: "Posadzki żywiczne w halach produkcyjnych",
    description: "Specjalistyczne posadzki odporne na chemikalia, idealne do pomieszczeń technicznych takich jak kotłownie oraz hale produkcyjne",
    imageSrc: "/produkcja.jpg",
    altText: "Posadzki żywiczne do hal",
    href: "/pomieszczenia-czyste"
  },
  {
    title: "Posadzki żywiczne w gastronomi",
    description: "Higieniczne i łatwe w utrzymaniu posadzki, które sprawdzą się w kuchniach, zapewniając trwałość i bezpieczeństwo.",
    imageSrc: "/gastronomia.jpg",
    altText: "Posadzki żywiczne do kuchni",
    href: "/pomieszczenia-czyste"
  },
  {
    title: "Posadzki żywiczne do przestrzeni mieszkalnych",
    description: "Nowoczesne i designerskie posadzki, które nadadzą stylu i elegancji wnętrzom mieszkalnym.",
    imageSrc: "/kuchnia.jpg",
    altText: "Posadzki żywiczne do przestrzeni mieszkalnych",
    href: "/kuchnia-salon"
  },
];

export const Feature5 = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge>Działamy</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
              W tych obszarach możemy Ci pomóc
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
              Sprawdź czym się zajmujemy.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Link href={feature.href}>
                <Image
                  src={feature.imageSrc}
                  width={424}
                  height={238}
                  alt={feature.altText}
                  className="rounded-md aspect-video mb-2"
                />
                <h3 className="text-xl tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground text-base">
                  {feature.description}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
