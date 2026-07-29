
import HeroMainPage from "@/app/garaze/components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";
import { Feature4 } from "@/blocks/feature/feature4";
import { CTA2 } from "@/blocks/cta/cta2";


import { Stats2 } from "@/blocks/stats/stats2";
import { FAQ2 } from "@/blocks/faq/faq2-garaz";
import { Contact1 } from "@/blocks/contact/contact1";

import { Feature3 } from "@/blocks/feature/feature3";
import { NextSeo } from 'next-seo';
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";
import ProblemSolutionSection from "./garaze/components/issuse-solution";
import ScrollDrivenRenovationTimeline from "@/components/blocks/scroll-driven-renovation-timeline";
import BenefitsSection from "./garaze/components/BenefitsSection";
import BlogPreviewSection from "@/components/blog-preview-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLatestBlogPosts, getBlogPostsByCategories } from "@/lib/blog"

export const dynamic = "force-static"

export default function Home() {
  const latestPosts = getLatestBlogPosts(3)

  return (
    <>
      <HeroMainPage />
      <ProblemSolutionSection />
      <ScrollDrivenRenovationTimeline />
      <BenefitsSection />
      <section className="bg-zinc-50 py-16">
        <div className="container mx-auto flex max-w-5xl flex-col items-start gap-5 px-4 md:flex-row md:items-center md:justify-between">
          <div><h2 className="text-3xl font-bold tracking-tight">Zobacz dostępne kolory posadzek</h2><p className="mt-2 text-zinc-600">Wzornik, płatki dekoracyjne i zdjęcia rzeczywistych realizacji.</p></div>
          <Button asChild size="lg"><Link href="/kolory-posadzek">Przejdź do wzornika</Link></Button>
        </div>
      </section>
      <FAQ2 />
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
