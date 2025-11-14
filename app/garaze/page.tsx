

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
import ScrollDrivenRenovationTimeline from "@/components/blocks/scroll-driven-renovation-timeline";
import BlogPreviewSection from "@/components/blog-preview-section";

import { getLatestBlogPosts, getBlogPostsByCategories } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Posadzki Żywiczne do Garaży | Wytrzymałe i Odporne",
  description:
    "Oferujemy trwałe i odporne posadzki żywiczne do garaży. Wytrzymałość na obciążenia i estetyczny wygląd. Sprawdź ofertę!",
  keywords: "posadzki żywiczne do garaży, garaż żywica, wytrzymałe posadzki",
  openGraph: {
    title: "Posadzki Żywiczne do Garaży | Wytrzymałe i Odporne",
    description:
      "Oferujemy trwałe i odporne posadzki żywiczne do garaży. Wytrzymałość na obciążenia i estetyczny wygląd. Sprawdź ofertę!",
    url: "https://posadzkizywiczne.com/garaze",
    images: [
      {
        url: "https://posadzkizywiczne.com/images/posadzki-garaz.jpg",
        width: 1200,
        height: 630,
        alt: "Posadzki Żywiczne do Garaży",
      },
    ],
  },
  alternates: {
    canonical: "https://posadzkizywiczne.com/garaze",
  },
};

export const dynamic = "force-static"

export default function Home() {
    const latestPosts = getLatestBlogPosts(3)
    const postsByCategory = getBlogPostsByCategories()

    return (
        <>
            <HeroMainPage />
            <ProblemSolutionSection />
            <ScrollDrivenRenovationTimeline />
            <BenefitsSection />
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
