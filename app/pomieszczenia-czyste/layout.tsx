import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Posadzki Żywiczne do Kuchni Przemysłowych i Produkcji Spożywczej | HACCP, ISO 22000",
  description:
    "Higieniczne posadzki żywiczne zgodne z normami HACCP i ISO 22000 do kuchni przemysłowych, produkcji spożywczej i pomieszczeń sterylnych. Bezszwowe, odporne chemicznie, łatwe w dezynfekcji. Certyfikowane rozwiązania dla branży spożywczej.",
  keywords:
    "posadzki żywiczne HACCP, posadzki do kuchni przemysłowej, posadzki produkcja spożywcza, higieniczne posadzki ISO 22000, posadzki pomieszczenia czyste, posadzki epoksydowe kuchnia, certyfikat HACCP posadzka",
  path: "/pomieszczenia-czyste",
  image: "/gastronomia.jpg",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
