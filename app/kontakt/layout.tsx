import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Skontaktuj się z Nami | PosadzkiŻywiczne.com",
  description:
    "Skontaktuj się z PosadzkiŻywiczne.com, aby uzyskać darmową wycenę i szczegóły oferty. Zadzwoń lub napisz do nas już dziś!",
  keywords: "kontakt posadzki żywiczne, zapytania, wycena posadzek żywicznych",
  path: "/kontakt",
  image: "/images/kontakt.jpg",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
