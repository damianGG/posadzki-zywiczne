

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Posadzki Żywiczne do Domu i Mieszkania | Kuchnia i Salon",
  description:
    "Nowoczesne posadzki żywiczne do kuchni, salonu, domu i mieszkania. Sprawdź zalety, odpowiedzi na najczęstsze pytania i inspiracje do wnętrz.",
  keywords:
    "posadzki żywiczne kuchnia, posadzki żywiczne salon, posadzki żywiczne dom, posadzki żywiczne mieszkanie, żywiczne wnętrza",
  openGraph: {
    title: "Posadzki Żywiczne do Domu i Mieszkania | Kuchnia i Salon",
    description:
      "Poznaj zalety posadzek żywicznych w domu i mieszkaniu. Kuchnia, salon i otwarte strefy dzienne w nowoczesnym wydaniu.",
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
