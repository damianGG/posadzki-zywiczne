import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Kalkulator Posadzek Żywicznych | Oblicz Koszty Online",
  description:
    "Skorzystaj z naszego kalkulatora online, aby obliczyć koszty posadzki żywicznej dla swojego pomieszczenia. Szybka i darmowa wycena.",
  keywords: "kalkulator posadzek, wycena posadzki żywicznej, koszt posadzki, oblicz cenę posadzki",
  openGraph: {
    title: "Kalkulator Posadzek Żywicznych | Oblicz Koszty Online",
    description:
      "Skorzystaj z naszego kalkulatora online, aby obliczyć koszty posadzki żywiczej dla swojego pomieszczenia. Szybka i darmowa wycena.",
    url: "https://posadzkizywiczne.com/kalkulator",
    images: [
      {
        url: "https://posadzkizywiczne.com/images/kalkulator-posadzki.jpg",
        width: 1200,
        height: 630,
        alt: "Kalkulator Posadzek Żywicznych",
      },
    ],
  },
  alternates: {
    canonical: "https://posadzkizywiczne.com/kalkulator",
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
