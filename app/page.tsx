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
        <h2 id="service-areas-heading" className="text-2xl font-bold md:text-3xl">Gdzie wykonujemy posadzki żywiczne?</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Sprawdź ofertę dla Rzeszowa i Krakowa. Zobacz dokumentację rzeczywistych realizacji,
          zakres usług i informacje potrzebne do wyceny.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link href="/posadzki-zywiczne/rzeszow" className="group rounded-xl border p-6 hover:border-primary">
            <h3 className="text-xl font-semibold group-hover:text-primary">Posadzki żywiczne Rzeszów</h3>
            <p className="mt-2 text-sm text-muted-foreground">Garaże, domy, obiekty usługowe i tarasy – zdjęcia realizacji i wycena.</p>
          </Link>
          <Link href="/posadzki-zywiczne/krakow" className="group rounded-xl border p-6 hover:border-primary">
            <h3 className="text-xl font-semibold group-hover:text-primary">Posadzki żywiczne Kraków</h3>
            <p className="mt-2 text-sm text-muted-foreground">Garaże, renowacje balkonów i pomieszczenia techniczne – zobacz ofertę.</p>
          </Link>
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
