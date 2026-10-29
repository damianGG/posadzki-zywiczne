
import HeroMainPage from "@/app/posadzki-zywiczne-na-balkony/components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";

import { CTA2 } from "@/blocks/cta/cta2";

import { FAQ2 } from "@/blocks/faq/faq2";
import { Contact1 } from "@/blocks/contact/contact1";
import StoneCarpetTeaser from "@/components/stone-carpet-teaser";
import RelatedRealizations from "@/components/related-realizations";
import Link from "next/link";

export const revalidate = 300;

import { Feature3 } from "@/blocks/feature/feature3";

import ProblemSolutionSection from "./components/issuse-solution";
import BenefitsSection from "./components/BenefitsSection";
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";


export default function Home() {


    return (
        <>
            <HeroMainPage />
            <ProblemSolutionSection />
            <BenefitsSection />
            <StoneCarpetTeaser />
            <section className="mx-auto max-w-6xl px-4 py-8" aria-labelledby="taras-poradnik">
              <h2 id="taras-poradnik" className="text-2xl font-bold md:text-3xl">Jak wybrać system żywiczny na taras?</h2>
              <p className="mt-3 max-w-4xl leading-relaxed text-muted-foreground">
                Przed wykonaniem nawierzchni sprawdzamy wilgotność podłoża, odwodnienie,
                hydroizolację oraz wymagania dotyczące odporności na UV i poślizg.
                Wyjaśniamy to w poradniku{" "}
                <Link href="/blog/czy-posadzka-zywiczna-nadaje-sie-na-taras" className="font-medium text-primary underline-offset-4 hover:underline">
                  czy posadzka żywiczna nadaje się na taras
                </Link>.
                Jeśli masz zdjęcia balkonu lub tarasu,{" "}
                <Link href="/kontakt" className="font-medium text-primary underline-offset-4 hover:underline">
                  zapytaj o indywidualną wycenę
                </Link>.
              </p>
            </section>
            <RelatedRealizations category="balkony-tarasy" title="Nasze realizacje balkonów i tarasów" />
            <Feature3 />
            {/* <Feature4 /> */}
            <FAQ2 />
            <CTA2 />
            {/* <Case2 /> */}
            {/* <Stats2 /> */}
            {/* <Blog1 /> */}
            <Feature5 />
            <SocialProofSection />
            <Contact1 />
        </>
    );
}
