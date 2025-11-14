

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Posadzki Żywiczne na Balkony i Tarasy | Wodoodporne i Estetyczne",
  description:
    "Posadzki żywiczne na balkony i tarasy. Wodoodporne, odporne na warunki atmosferyczne i estetyczne rozwiązanie. Sprawdź naszą ofertę!",
  keywords:
    "posadzki żywiczne balkony, tarasy, posadzki zewnętrzne, wodoodporne posadzki",
  openGraph: {
    title: "Posadzki Żywiczne na Balkony i Tarasy | Wodoodporne i Estetyczne",
    description:
      "Posadzki żywiczne na balkony i tarasy. Wodoodporne, odporne na warunki atmosferyczne i estetyczne rozwiązanie. Sprawdź naszą ofertę!",
    url: "https://posadzkizywiczne.com/posadzki-zywiczne-na-balkony",
    images: [
      {
        url: "https://posadzkizywiczne.com/images/posadzki-balkony-tarasy.jpg",
        width: 1200,
        height: 630,
        alt: "Posadzki Żywiczne na Balkony i Tarasy",
      },
    ],
  },
  alternates: {
    canonical: "https://posadzkizywiczne.com/posadzki-zywiczne-na-balkony",
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
