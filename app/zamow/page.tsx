import type { Metadata } from "next";
import { Suspense } from "react";
import OrderFlow from "@/components/order-flow";
import PhotoWall from "@/components/photo-wall";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Wycena posadzki żywicznej — wybierz miejsce i wygląd",
  description: "Zamów wycenę posadzki do garażu, na taras, do domu albo do firmy. Najpierw zdjęcia wykonanych prac, potem metraż i telefon.",
  alternates: { canonical: absoluteUrl("/zamow") },
};

export default function OrderPage() {
  return (
    <main>
      <Suspense fallback={<section className="bg-zinc-50 px-4 py-24 text-center text-zinc-600">Ładuję wybór posadzki…</section>}>
        <OrderFlow heading="h1" />
      </Suspense>
      <PhotoWall />
    </main>
  );
}
