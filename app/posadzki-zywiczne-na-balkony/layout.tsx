import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Posadzki Żywiczne na Balkony i Tarasy | Wodoodporne i Estetyczne",
  description:
    "Posadzki żywiczne na balkony i tarasy. Wodoodporne, odporne na warunki atmosferyczne i estetyczne rozwiązanie. Sprawdź naszą ofertę!",
  keywords: "posadzki żywiczne balkony, tarasy, posadzki zewnętrzne, wodoodporne posadzki",
  path: "/posadzki-zywiczne-na-balkony",
  image: "/images/posadzki-balkony-tarasy.jpg",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
