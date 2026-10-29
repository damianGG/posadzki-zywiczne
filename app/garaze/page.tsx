

import HeroMainPage from "@/app/garaze/components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";
import { CTA2 } from "@/blocks/cta/cta2";
import { FAQ2 } from "./components/faq2";
import { Contact1 } from "@/blocks/contact/contact1";
import { Feature3 } from "./components/feature3";
import ProblemSolutionSection from "./components/issuse-solution";
import BenefitsSection from "./components/BenefitsSection";
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";

import type { Metadata } from 'next'
import { absoluteUrl } from "@/lib/site-config";
import ScrollDrivenRenovationTimeline from "@/components/blocks/scroll-driven-renovation-timeline";
import BlogPreviewSection from "@/components/blog-preview-section";
import RelatedRealizations from "@/components/related-realizations";
import Link from "next/link";

import { getLatestBlogPosts, getBlogPostsByCategories } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Posadzka żywiczna do garażu – wykonanie i wycena",
  description:
    "Oferujemy trwałe i odporne posadzki żywiczne do garaży. Wytrzymałość na obciążenia i estetyczny wygląd. Sprawdź ofertę!",
  keywords: "posadzki żywiczne do garaży, garaż żywica, wytrzymałe posadzki",
  openGraph: {
    title: "Posadzka żywiczna do garażu – wykonanie i wycena",
    description:
      "Oferujemy trwałe i odporne posadzki żywiczne do garaży. Wytrzymałość na obciążenia i estetyczny wygląd. Sprawdź ofertę!",
    url: absoluteUrl("/garaze"),
    images: [
      {
        url: absoluteUrl("/garaz/garaz-zywica-2.jpg"),
        width: 1200,
        height: 630,
        alt: "Posadzki Żywiczne do Garaży",
      },
    ],
  },
  alternates: {
    canonical: absoluteUrl("/garaze"),
  },
};

export const revalidate = 300

export default function Home() {
    const latestPosts = getLatestBlogPosts(3)
    const postsByCategory = getBlogPostsByCategories()

    return (
        <>
<HeroMainPage variant="garage" />
            <section className="mx-auto max-w-6xl px-4 py-12 md:py-16" aria-labelledby="garaz-zywica-informacje">
              <h2 id="garaz-zywica-informacje" className="text-2xl font-bold md:text-3xl">
                Posadzka żywiczna w garażu – co wpływa na trwałość i koszt?
              </h2>
              <p className="mt-4 max-w-4xl leading-relaxed text-muted-foreground">
                Przy wykonaniu posadzki do garażu najważniejszy jest stan podłoża:
                jego nośność, wilgotność, rysy i dylatacje. Dobieramy układ warstw
                do sposobu użytkowania, a nie wyłącznie do metrażu. Inne wymagania
                ma nowy garaż w domu, a inne intensywnie użytkowany warsztat.
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border p-6">
                  <h3 className="text-xl font-semibold">Epoksyd do garażu</h3>
                  <p className="mt-3 text-muted-foreground">
                    Rozwiązanie do wielu garaży wewnętrznych. Rodzaj gruntu, grubość
                    powłoki i wykończenie ustala się po sprawdzeniu betonu.
                    W zależności od potrzeb możliwe są powierzchnie gładkie
                    oraz warianty z posypką dekoracyjną lub kwarcową.
                  </p>
                </div>
                <div className="rounded-xl border p-6">
                  <h3 className="text-xl font-semibold">Poliuretan i warstwy wykończeniowe</h3>
                  <p className="mt-3 text-muted-foreground">
                    Przy ekspozycji na słońce i wahania temperatur sprawdzamy
                    rozwiązania przewidziane przez producenta do takich warunków.
                    Odporność na UV, ścieranie i poślizg musi wynikać z parametrów
                    wybranego systemu, a nie jedynie z nazwy żywicy.
                  </p>
                </div>
              </div>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Cena za m² zależy od metrażu, napraw podłoża, liczby warstw, cokołów
                i rodzaju wykończenia. Sprawdź{" "}
                <Link href="/blog/ile-kosztuje-posadzka-zywiczna-w-garazu" className="font-medium text-primary underline-offset-4 hover:underline">
                  co wpływa na koszt posadzki żywicznej w garażu
                </Link>
                {" "}lub{" "}
                <Link href="/kontakt" className="font-medium text-primary underline-offset-4 hover:underline">
                  prześlij zdjęcia i metraż do wyceny
                </Link>.
                Sprawdź też ofertę w{" "}
                <Link href="/posadzki-zywiczne/rzeszow" className="font-medium text-primary underline-offset-4 hover:underline">posadzkach żywicznych w Rzeszowie</Link>
                {" "}oraz{" "}
                <Link href="/posadzki-zywiczne/krakow" className="font-medium text-primary underline-offset-4 hover:underline">posadzkach żywicznych w Krakowie</Link>.
              </p>
              <p className="mt-4 max-w-4xl leading-relaxed text-muted-foreground">
                Planując użytkowanie garażu po wykonaniu prac, sprawdź też{" "}
                <Link href="/blog/ile-trwa-schniecie-posadzki-zywicznej" className="font-medium text-primary underline-offset-4 hover:underline">
                  kiedy można wjechać samochodem na nową posadzkę
                </Link>.
              </p>
            </section>
            <ProblemSolutionSection />
            <ScrollDrivenRenovationTimeline />
            <BenefitsSection />
            <FAQ2 />
            <RelatedRealizations category="garaze" title="Nasze posadzki w garażach — zdjęcia realizacji" />
            <BlogPreviewSection
                posts={latestPosts}
                title="Najnowsze Artykuły o Posadzkach"
                subtitle="Poznaj najnowsze trendy, porady ekspertów i praktyczne rozwiązania w świecie posadzek żywicznych"
            />
            <CTA2 />
            <SocialProofSection />
            <Feature5 />
            <Contact1 />
        </>
    );
}
