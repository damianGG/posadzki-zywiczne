import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Podłoga Żywiczna do Kuchni, Salonu i Domu | Wycena ze Zdjęć",
  description:
    "Podłoga żywiczna bez fug do kuchni, salonu, domu i mieszkania. Sprawdź ceny, porównanie z płytkami i panelami oraz realizacje z Podkarpacia i Małopolski.",
  keywords:
    "podłoga żywiczna kuchnia, posadzka żywiczna salon, posadzka żywiczna dom, posadzka żywiczna mieszkanie, podłoga bez fug, posadzka żywiczna Rzeszów, posadzka żywiczna Kraków",
  path: "/kuchnia-salon",
  image: "/images/posadzki-kuchnia-salon.jpg",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
