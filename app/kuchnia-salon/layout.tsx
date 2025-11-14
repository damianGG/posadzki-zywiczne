

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Posadzki Żywiczne w Kuchni i Salonie | Styl i Funkcjonalność",
  description:
    "Stylowe posadzki żywiczne do kuchni i salonu. Estetyczne, łatwe w utrzymaniu i trwałe rozwiązanie. Zamów u nas!",
  keywords:
    "posadzki żywiczne kuchnia, salon, posadzki dekoracyjne, żywiczne wnętrza",
  openGraph: {
    title: "Posadzki Żywiczne w Kuchni i Salonie | Styl i Funkcjonalność",
    description:
      "Stylowe posadzki żywiczne do kuchni i salonu. Estetyczne, łatwe w utrzymaniu i trwałe rozwiązanie. Zamów u nas!",
    url: "https://posadzkizywiczne.com/kuchnia-salon",
    images: [
      {
        url: "https://posadzkizywiczne.com/images/posadzki-kuchnia-salon.jpg",
        width: 1200,
        height: 630,
        alt: "Posadzki Żywiczne w Kuchni i Salonie",
      },
    ],
  },
  alternates: {
    canonical: "https://posadzkizywiczne.com/kuchnia-salon",
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
