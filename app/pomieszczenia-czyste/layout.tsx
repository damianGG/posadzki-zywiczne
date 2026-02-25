

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Posadzki Żywiczne do Kuchni Przemysłowych i Produkcji Spożywczej | HACCP, ISO 22000",
  description:
    "Higieniczne posadzki żywiczne zgodne z normami HACCP i ISO 22000 do kuchni przemysłowych, produkcji spożywczej i pomieszczeń sterylnych. Bezszwowe, odporne chemicznie, łatwe w dezynfekcji. Certyfikowane rozwiązania dla branży spożywczej.",
  keywords:
    "posadzki żywiczne HACCP, posadzki do kuchni przemysłowej, posadzki produkcja spożywcza, higieniczne posadzki ISO 22000, posadzki pomieszczenia czyste, posadzki epoksydowe kuchnia, certyfikat HACCP posadzka",
  openGraph: {
    title: "Posadzki Żywiczne do Kuchni Przemysłowych i Produkcji Spożywczej | HACCP",
    description:
      "Higieniczne posadzki żywiczne zgodne z HACCP i ISO 22000. Idealne do kuchni przemysłowych, zakładów produkcji spożywczej i pomieszczeń sterylnych. Skontaktuj się z nami!",
    url: "https://posadzkizywiczne.com/pomieszczenia-czyste",
    images: [
      {
        url: "https://posadzkizywiczne.com/gastronomia.jpg",
        width: 1200,
        height: 630,
        alt: "Posadzki Żywiczne do Kuchni Przemysłowych i Produkcji Spożywczej",
      },
    ],
  },
  alternates: {
    canonical: "https://posadzkizywiczne.com/pomieszczenia-czyste",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>


  );
}
