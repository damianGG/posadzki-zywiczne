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
import HomeCraftSection from "@/components/home-craft-section";
import { localServicePages } from "@/lib/local-service-pages";

export const revalidate = 300;

export default async function Home() {
  const latestPosts = getLatestBlogPosts(3);
  const serviceProjects = await getAllRealizacje();

  return (
    <main className="premium-home">
      <HeroMainPage variant="home" />
      <HomeCraftSection />
      <Feature5 projects={serviceProjects} />
      <section className="mx-auto grid max-w-7xl gap-8 scroll-mt-28 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-[1fr_1fr] md:items-center" id="home-price-section" aria-labelledby="home-price">
        <div>
          <p className="brand-eyebrow mb-3">Jasne zasady</p>
          <h2 id="home-price" className="premium-display text-3xl font-medium sm:text-4xl">Ile kosztuje posadzka żywiczna?</h2>
          <p className="mt-3 max-w-xl text-zinc-600">Sprawdź orientacyjny koszt garażu bez podawania danych kontaktowych. Dla innych zastosowań dobierzemy zakres indywidualnie.</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link href="/kalkulator?typ=garaz" className="rounded-full brand-button px-6 py-3 font-semibold">Oblicz koszt garażu</Link>
            <Link href="/zamow" className="rounded-full border px-6 py-3 font-semibold">Zapytaj o inną posadzkę</Link>
          </div>
        </div>
        <div className="rounded-xl border border-[#DADBD3] brand-surface p-6 sm:p-9">
          <p className="text-sm font-medium text-zinc-600">Przykład wykonanego garażu · 45 m²</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">7 500 zł <span className="text-lg">netto</span></p>
          <p className="mt-3 text-sm text-zinc-600">Przygotowanie podłoża, żywica, kratka, cokoły i uszczelnienie. Historyczna cena konkretnego zlecenia, nie cennik.</p>
          <Link href="/garaze#cena" className="mt-4 inline-block font-semibold underline underline-offset-4">Zobacz dokładny zakres</Link>
        </div>
      </section>
      <div id="home-realizations" className="scroll-mt-28"><RelatedRealizations title="Przestrzenie, które już wykonaliśmy" projects={serviceProjects} /></div>
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
            <Link key={page.slug} prefetch={false} href={"/posadzki-zywiczne/" + page.slug} className="group rounded-xl border p-6 hover:border-primary">
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
      <section className="bg-[#273B2E] px-4 py-16 text-center text-[#F8F7F1] sm:py-24">
        <h2 className="premium-display text-3xl font-medium sm:text-5xl">Porozmawiajmy o Twojej przestrzeni</h2>
        <p className="mx-auto mt-4 max-w-xl text-[#E1E5DC]">Opowiedz nam, czego potrzebujesz. Podpowiemy, jakie wykończenie i rozwiązanie techniczne będzie odpowiednie, oraz przygotujemy indywidualną wycenę.</p>
        <Link href="/zamow" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#F8F7F1] px-7 py-3.5 font-semibold text-[#273B2E] hover:bg-white">Poproś o indywidualną wycenę</Link>
        <p className="mt-4 text-sm text-[#E1E5DC]">Lub zadzwoń: <a href="tel:+48507384619" className="font-semibold underline underline-offset-4">507 384 619</a></p>
      </section>
    </main>
  );
}
