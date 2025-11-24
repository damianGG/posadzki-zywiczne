import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konkurs - Wygraj 5000 zł na posadzkę żywiczną | Posadzki Żywiczne",
  description:
    "Weź udział w konkursie i wygraj voucher o wartości 5000 zł na wykonanie posadzki żywicznej! Wystarczy podać imię i email. Losowanie 6 grudnia na Instagramie.",
  keywords:
    "konkurs, posadzki żywiczne, nagroda, voucher, 5000 zł, losowanie, Instagram",
  openGraph: {
    title: "Konkurs - Wygraj 5000 zł na posadzkę żywiczną",
    description:
      "Weź udział w konkursie i wygraj voucher o wartości 5000 zł na wykonanie posadzki żywicznej! Wystarczy podać imię i email.",
    url: "https://posadzkizywiczne.com/konkurs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Konkurs - Wygraj 5000 zł na posadzkę żywiczną",
    description:
      "Weź udział w konkursie i wygraj voucher o wartości 5000 zł na wykonanie posadzki żywicznej!",
  },
  alternates: {
    canonical: "https://posadzkizywiczne.com/konkurs",
  },
};

export default function KonkursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
