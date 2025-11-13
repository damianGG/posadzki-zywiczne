
import HeroMainPage from "@/app/posadzki-zywiczne-na-balkony/components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";

import { CTA2 } from "@/blocks/cta/cta2";

import { FAQ2 } from "@/blocks/faq/faq2";
import { Contact1 } from "@/blocks/contact/contact1";

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
