import type { Metadata } from "next";
import { Contact1 } from "@/blocks/contact/contact1";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kontakt i wycena posadzki żywicznej | Rzeszów, Kraków",
  description: "Zapytaj o wycenę posadzki żywicznej do garażu, domu lub na balkon. Podaj miejscowość, powierzchnię i wyślij zdjęcia podłoża.",
  alternates: { canonical: absoluteUrl("/kontakt") },
};

export default function KontaktPage() {
  return (
    <main>
      <header className="container mx-auto px-4 pt-12 pb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Kontakt i wycena posadzki żywicznej
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          Podaj miejscowość, orientacyjny metraż, przeznaczenie posadzki i stan podłoża.
          Zdjęcia garażu lub tarasu pomogą nam przygotować wstępną propozycję.
          Ostateczny dobór systemu wymaga sprawdzenia warunków na miejscu.
        </p>
      </header>
      <Contact1 />
    </main>
  );
}
