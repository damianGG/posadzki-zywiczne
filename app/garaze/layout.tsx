import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Posadzki Żywiczne do Garaży | Wytrzymałe i Odporne",
  description:
    "Oferujemy trwałe i odporne posadzki żywiczne do garaży. Wytrzymałość na obciążenia i estetyczny wygląd. Sprawdź ofertę!",
  keywords: "posadzki żywiczne do garaży, garaż żywica, wytrzymałe posadzki",
  path: "/garaze",
  image: "/images/posadzki-garaz.jpg",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
