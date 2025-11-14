

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Posadzki Żywiczne do Garaży | Wytrzymałe i Odporne",
  description:
    "Oferujemy trwałe i odporne posadzki żywiczne do garaży. Wytrzymałość na obciążenia i estetyczny wygląd. Sprawdź ofertę!",
  keywords: "posadzki żywiczne do garaży, garaż żywica, wytrzymałe posadzki",
  openGraph: {
    title: "Posadzki Żywiczne do Garaży | Wytrzymałe i Odporne",
    description:
      "Oferujemy trwałe i odporne posadzki żywiczne do garaży. Wytrzymałość na obciążenia i estetyczny wygląd. Sprawdź ofertę!",
    url: "https://posadzkizywiczne.com/garaze",
    images: [
      {
        url: "https://posadzkizywiczne.com/images/posadzki-garaz.jpg",
        width: 1200,
        height: 630,
        alt: "Posadzki Żywiczne do Garaży",
      },
    ],
  },
  alternates: {
    canonical: "https://posadzkizywiczne.com/garaze",
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
