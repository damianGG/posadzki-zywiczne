import HeroMainPage from "@/app/garaze/components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";


import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";
import BlogPreviewSection from "@/components/blog-preview-section";
import { getLatestBlogPosts } from "@/lib/blog";
import { getAllRealizacje } from "@/lib/realizacje";
import CustomerPhotoAnswers from "@/components/customer-photo-answers";
import StoneCarpetTeaser from "@/components/stone-carpet-teaser";
import RelatedRealizations from "@/components/related-realizations";
import Link from "next/link";
import { localServicePages } from "@/lib/local-service-pages";

export const revalidate = 300;

export default async function Home() {
  const latestPosts = getLatestBlogPosts(3);
  const serviceProjects = await getAllRealizacje();

  return (
    <main>
      <HeroMainPage variant="home" />
      <Feature5 projects={serviceProjects} />
      <section className="mx-auto grid max-w-7xl gap-6 scroll-mt-28 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1fr] md:items-center" id="home-price-section" aria-labelledby="home-price">
        <div>
          <h2 id="home-price" className="text-3xl font-semibold tracking-tight">Ile kosztuje posadzka żywiczna?</h2>
          <p className="mt-3 max-w-xl text-zinc-600">Sprawdź orientacyjny koszt garażu bez podawania danych kontaktowych. Dla innych zastosowań dobierzemy zakres indywidualnie.</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link href="/kalkulator?typ=garaz" className="rounded-full brand-button px-6 py-3 font-semibold">Oblicz koszt garażu</Link>
            <Link href="/zamow" className="rounded-full border px-6 py-3 font-semibold">Zapytaj o inną posadzkę</Link>
          </div>
        </div>
        <div className="rounded-2xl brand-surface p-6 sm:p-8">
          <p className="text-sm font-medium text-zinc-600">Przykład wykonanego garażu · 45 m²</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">7 500 zł <span className="text-lg">netto</span></p>
          <p className="mt-3 text-sm text-zinc-600">Przygotowanie podłoża, żywica, kratka, cokoły i uszczelnienie. Historyczna cena konkretnego zlecenia, nie cennik.</p>
          <Link href="/garaze#cena" className="mt-4 inline-block font-semibold underline underline-offset-4">Zobacz dokładny zakres</Link>
        </div>
      </section>
      <div id="home-realizations" className="scroll-mt-28"><RelatedRealizations title="Zobacz efekty naszych prac" /></div>
      <SocialProofSection />
      <CustomerPhotoAnswers />
      <StoneCarpetTeaser />
      <section className="container mx-auto max-w-6xl px-4 py-12" aria-labelledby="service-areas-heading">
        <h2 id="service-areas-heading" className="text-2xl font-bold md:text-3xl">Posadzki żywiczne w Twoim mieście</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Realizujemy posadzki żywiczne dla klientów indywidualnych i przemysłowych.
          Sprawdź zakres usług oraz informacje potrzebne do wyceny w wybranym mieście.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(localServicePages).map((page) => (
            <Link key={page.slug} href={"/posadzki-zywiczne/" + page.slug} className="group rounded-xl border p-6 hover:border-primary">
              <h3 className="text-xl font-semibold group-hover:text-primary">Posadzki żywiczne {page.city}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{page.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <BlogPreviewSection
        posts={latestPosts}
        title="Poradniki o posadzkach żywicznych"
        subtitle="Poznaj systemy epoksydowe i poliuretanowe, zasady przygotowania podłoża oraz praktyczne wskazówki dotyczące wyboru posadzki."
      />
      <section className="brand-surface px-4 py-14 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Dobierzmy posadzkę do Twojego obiektu</h2>
        <p className="mx-auto mt-3 max-w-xl text-stone-600">Podaj metraż i lokalizację. Możesz wybrać wygląd lub poprosić nas o pomoc w doborze.</p>
        <Link href="/zamow" className="mt-6 inline-block rounded-full brand-button px-7 py-3.5 font-semibold">Poproś o indywidualną wycenę</Link>
      </section>
    </main>
  );
}
