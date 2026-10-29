import HeroMainPage from "@/app/garaze/components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";
import { CTA2 } from "@/blocks/cta/cta2";
import { Contact1 } from "@/blocks/contact/contact1";
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";
import BlogPreviewSection from "@/components/blog-preview-section";
import { getLatestBlogPosts } from "@/lib/blog";
import StoneCarpetTeaser from "@/components/stone-carpet-teaser";
import RelatedRealizations from "@/components/related-realizations";
import Link from "next/link";
import { localServicePages } from "@/lib/local-service-pages";

export const revalidate = 300;

export default function Home() {
  const latestPosts = getLatestBlogPosts(3);

  return (
    <>
      <HeroMainPage variant="home" />
      <Feature5 />
      <SocialProofSection />
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
      <RelatedRealizations title="Zobacz efekty naszych prac" />
      <BlogPreviewSection
        posts={latestPosts}
        title="Poradniki o posadzkach żywicznych"
        subtitle="Poznaj systemy epoksydowe i poliuretanowe, zasady przygotowania podłoża oraz praktyczne wskazówki dotyczące wyboru posadzki."
      />
      <CTA2 />
      <Contact1 />
    </>
  );
}
