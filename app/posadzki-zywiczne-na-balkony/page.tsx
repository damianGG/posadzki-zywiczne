
import HeroMainPage from "@/app/posadzki-zywiczne-na-balkony/components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";

import { CTA2 } from "@/blocks/cta/cta2";

import { FAQ2 } from "@/blocks/faq/faq2";
import { Contact1 } from "@/blocks/contact/contact1";

import { Feature3 } from "@/blocks/feature/feature3";

import ProblemSolutionSection from "./components/issuse-solution";
import BenefitsSection from "./components/BenefitsSection";
import SocialProofSection from "./components/SocialProofSection";

export const metadata = {
    title: "Posadzki Żywiczne na Balkony | Trwałe i Estetyczne",
    description:
        "Oferujemy trwałe i estetyczne posadzki żywiczne na balkony. Gwarancja odporności na warunki atmosferyczne i stylowy wygląd.",
    keywords: "posadzki żywiczne na balkony, trwałe posadzki, balkony żywiczne",
    openGraph: {
        title: "Posadzki Żywiczne na Balkony | Trwałe i Estetyczne",
        description:
            "Oferujemy trwałe i estetyczne posadzki żywiczne na balkony. Gwarancja odporności na warunki atmosferyczne i stylowy wygląd.",
        url: "https://posadzkizywiczne.com/posadzki-balkony",
        images: [
            {
                url: "https://posadzkizywiczne.com/images/posadzki-balkony.jpg",
                width: 1200,
                height: 630,
                alt: "Posadzki Żywiczne na Balkony",
            },
        ],
    },
};

export default function Home() {


    return (
        <>
            <HeroMainPage />
            <ProblemSolutionSection />
            <BenefitsSection />
            <SocialProofSection />
            <Feature3 />
            {/* <Feature4 /> */}
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
