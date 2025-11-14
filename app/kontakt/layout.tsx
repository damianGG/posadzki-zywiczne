

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Skontaktuj się z Nami | PosadzkiŻywiczne.com",
  description:
    "Skontaktuj się z PosadzkiŻywiczne.com, aby uzyskać darmową wycenę i szczegóły oferty. Zadzwoń lub napisz do nas już dziś!",
  keywords: "kontakt posadzki żywiczne, zapytania, wycena posadzek żywicznych",
  openGraph: {
    title: "Skontaktuj się z Nami | PosadzkiŻywiczne.com",
    description:
      "Skontaktuj się z PosadzkiŻywiczne.com, aby uzyskać darmową wycenę i szczegóły oferty. Zadzwoń lub napisz do nas już dziś!",
    url: "https://posadzkizywiczne.com/kontakt",
    images: [
      {
        url: "https://posadzkizywiczne.com/images/kontakt.jpg",
        width: 1200,
        height: 630,
        alt: "Kontakt - Posadzki Żywiczne",
      },
    ],
  },
  alternates: {
    canonical: "https://posadzkizywiczne.com/kontakt",
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
