import HeroMainPage from "./components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";

import { CTA2 } from "@/blocks/cta/cta2";
import { FAQ2 } from "./components/faq2";
import { Contact1 } from "@/blocks/contact/contact1";

import { Feature3 } from "./components/feature3";

import ProblemSolutionSection from "./components/issuse-solution";
import BenefitsSection from "./components/BenefitsSection";
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";
import CertificatesSection from "./components/CertificatesSection";

export default function Home() {


    return (
        <>
            <HeroMainPage />
            <ProblemSolutionSection />
            <CertificatesSection />
            <BenefitsSection />
            <Feature3 />
            <SocialProofSection />
            <FAQ2 />
            <CTA2 />
            {/* <Case2 /> */}
            {/* <Stats2 /> */}
            {/* <Blog1 /> */}
            <Feature5 />
            <Contact1 />
        </>
    );
}
