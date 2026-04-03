

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Podłoga Żywiczna do Kuchni, Salonu i Domu | Wycena ze Zdjęć",
  description:
    "Podłoga żywiczna bez fug do kuchni, salonu, domu i mieszkania. Sprawdź ceny, porównanie z płytkami i panelami oraz realizacje z Podkarpacia i Małopolski.",
  keywords:
    "podłoga żywiczna kuchnia, posadzka żywiczna salon, posadzka żywiczna dom, posadzka żywiczna mieszkanie, podłoga bez fug, posadzka żywiczna Rzeszów, posadzka żywiczna Kraków",
  openGraph: {
    title: "Podłoga Żywiczna do Kuchni, Salonu i Domu | Wycena ze Zdjęć",
    description:
      "Sprawdź, czy podłoga żywiczna pasuje do kuchni, salonu i całego domu. Ceny, FAQ, porównanie materiałów i realizacje z regionu.",
    url: "https://posadzkizywiczne.com/kuchnia-salon",
    images: [
      {
        url: "https://posadzkizywiczne.com/images/posadzki-kuchnia-salon.jpg",
        width: 1200,
        height: 630,
        alt: "Posadzki żywiczne do domu i mieszkania",
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
  return <>{children}</>;
}
