import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { garageCalculatorHref } from "@/lib/garage-calculator-flow";
import OrderFlow from "@/components/order-flow";

import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Wycena posadzki żywicznej — wybierz miejsce i wygląd",
  description: "Zamów wycenę posadzki do garażu, na taras, do domu albo do firmy. Dla garażu oblicz koszt online bez podawania danych kontaktowych.",
  alternates: { canonical: absoluteUrl("/zamow") },
};

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ miejsce?: string; wyglad?: string; metraz?: string }> }) {
  const params = await searchParams;
  if (params.miejsce === "garaz") redirect(garageCalculatorHref(typeof params.wyglad === "string" ? params.wyglad : undefined, typeof params.metraz === "string" ? params.metraz : undefined));
  return (
    <main>
      <Suspense fallback={<section className="bg-zinc-50 px-4 py-24 text-center text-zinc-600">Ładuję wybór posadzki…</section>}>
        <OrderFlow heading="h1" />
      </Suspense>

    </main>
  );
}
