import HeroMainPage from "./components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";

import { CTA2 } from "@/blocks/cta/cta2";
import { FAQ2 } from "./components/faq2";
import { Contact1 } from "@/blocks/contact/contact1";

import { Feature3 } from "./components/feature3";

import ProblemSolutionSection from "./components/issuse-solution";
import BenefitsSection from "./components/BenefitsSection";
import SocialProofSection from "./components/SocialProofSection";

export const metadata = {
    title: "Posadzki Żywiczne w Kuchni i Salonie | Styl i Funkcjonalność",
    description:
        "Stylowe posadzki żywiczne do kuchni i salonu. Estetyczne, łatwe w utrzymaniu i trwałe rozwiązanie. Zamów u nas!",
    keywords:
        "posadzki żywiczne kuchnia, salon, posadzki dekoracyjne, żywiczne wnętrza",
    openGraph: {
        title: "Posadzki Żywiczne w Kuchni i Salonie | Styl i Funkcjonalność",
        description:
            "Stylowe posadzki żywiczne do kuchni i salonu. Estetyczne, łatwe w utrzymaniu i trwałe rozwiązanie. Zamów u nas!",
        url: "https://posadzkizywiczne.com/posadzki-kuchnia-salon",
        images: [
            {
                url: "https://posadzkizywiczne.com/images/posadzki-kuchnia-salon.jpg",
                width: 1200,
                height: 630,
                alt: "Posadzki Żywiczne w Kuchni i Salonie",
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
