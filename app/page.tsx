import HeroMainPage from "@/app/garaze/components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";
import { CTA2 } from "@/blocks/cta/cta2";
import { Contact1 } from "@/blocks/contact/contact1";
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";
import BlogPreviewSection from "@/components/blog-preview-section";
import { getLatestBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default function Home() {
  const latestPosts = getLatestBlogPosts(3);

  return (
    <>
      <HeroMainPage variant="home" />
      <Feature5 />
      <SocialProofSection />
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
