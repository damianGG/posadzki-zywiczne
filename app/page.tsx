import { Suspense } from "react";
import Link from "next/link";
import { Contact1 } from "@/blocks/contact/contact1";
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";
import BlogPreviewSection from "@/components/blog-preview-section";
import HomeHero from "@/components/home-hero";
import OrderFlow from "@/components/order-flow";
import PhotoWall from "@/components/photo-wall";
import RelatedRealizations from "@/components/related-realizations";
import { getLatestBlogPosts } from "@/lib/blog";
import { localServicePages } from "@/lib/local-service-pages";

export const revalidate = 300;

export default function Home() {
  const latestPosts = getLatestBlogPosts(3);

  return (
    <>
      <HomeHero />
      <Suspense fallback={<section className="bg-zinc-50 px-4 py-16 text-zinc-600">Ładuję wybór posadzki…</section>}>
        <OrderFlow />
      </Suspense>
      <PhotoWall />
      <SocialProofSection />
      <RelatedRealizations title="Kolejne udokumentowane realizacje" limit={6} />
      <section className="container mx-auto max-w-6xl px-4 py-12" aria-labelledby="service-areas-heading">
        <h2 id="service-areas-heading" className="text-2xl font-bold md:text-3xl">Posadzki żywiczne w Twoim mieście</h2>
        <p className="mt-3 max-w-3xl text-zinc-600">Ten sam sposób wyceny. Wybierz miasto, jeśli chcesz zobaczyć lokalny zakres dojazdu.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {Object.values(localServicePages).map((page) => (
            <Link key={page.slug} href={"/posadzki-zywiczne/" + page.slug} className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:border-zinc-950">
              {page.city}
            </Link>
          ))}
        </div>
      </section>
      <BlogPreviewSection
        posts={latestPosts}
        title="Krótkie odpowiedzi, zanim zapytasz"
        subtitle="Koszt, żółknięcie od słońca i czas, po którym można wjechać autem."
      />
      <Contact1 />
    </>
  );
}
