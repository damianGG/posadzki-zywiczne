import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Posadzka żywiczna do garażu – wykonanie i wycena",
  description:
    "Oferujemy trwałe i odporne posadzki żywiczne do garaży. Wytrzymałość na obciążenia i estetyczny wygląd. Sprawdź ofertę!",
  keywords: "posadzki żywiczne do garaży, garaż żywica, wytrzymałe posadzki",
  path: "/garaze",
  image: "/garaz/garaz-zywica-2.jpg",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
