

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Posadzki Żywiczne do Pomieszczeń Czystych | Higieniczne i Trwałe",
  description:
    "Higieniczne posadzki żywiczne do pomieszczeń czystych. Idealne do laboratoriów, szpitali i zakładów przemysłowych. Skontaktuj się z nami!",
  keywords:
    "posadzki żywiczne pomieszczenia czyste, higieniczne posadzki, laboratoria",
  openGraph: {
    title: "Posadzki Żywiczne do Pomieszczeń Czystych | Higieniczne i Trwałe",
    description:
      "Higieniczne posadzki żywiczne do pomieszczeń czystych. Idealne do laboratoriów, szpitali i zakładów przemysłowych. Skontaktuj się z nami!",
    url: "https://posadzkizywiczne.com/pomieszczenia-czyste",
    images: [
      {
        url: "https://posadzkizywiczne.com/images/posadzki-pomieszczenia-czyste.jpg",
        width: 1200,
        height: 630,
        alt: "Posadzki Żywiczne do Pomieszczeń Czystych",
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
