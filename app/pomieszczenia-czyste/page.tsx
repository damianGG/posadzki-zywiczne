import HeroMainPage from "./components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";

import { CTA2 } from "@/blocks/cta/cta2";
import { FAQ2 } from "./components/faq2";
import { Contact1 } from "@/blocks/contact/contact1";

import { Feature3 } from "./components/feature3";

import ProblemSolutionSection from "./components/issuse-solution";
import BenefitsSection from "./components/BenefitsSection";
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";

export const metadata = {
    title: "Posadzki Żywiczne do Pomieszczeń Czystych | Higieniczne i Trwałe",
    description:
        "Higieniczne posadzki żywiczne do pomieszczeń czystych. Idealne do laboratoriów, szpitali i zakładów przemysłowych. Skontaktuj się z nami!",
    keywords:
        "posadzki żywiczne pomieszczenia czyste, higieniczne posadzki, laboratoria",
    openGraph: {
        title: "Posadzki Żywiczne do Pomieszczeń Czystych | Higieniczne i Trwałe",
        description:
            "Higieniczne posadzki żywiczne do pomieszczeń czystych. Idealne do laboratoriów, szpitali i zakładów przemysłowych. Skontaktuj się z nami!",
        url: "https://posadzkizywiczne.com/posadzki-pomieszczenia-czyste",
        images: [
            {
                url: "https://posadzkizywiczne.com/images/posadzki-pomieszczenia-czyste.jpg",
                width: 1200,
                height: 630,
                alt: "Posadzki Żywiczne do Pomieszczeń Czystych",
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
