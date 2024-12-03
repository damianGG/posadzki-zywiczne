

import HeroMainPage from "@/app/garaze/components/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";
import { CTA2 } from "@/blocks/cta/cta2";
import { FAQ2 } from "./components/faq2";
import { Contact1 } from "@/blocks/contact/contact1";
import { Feature3 } from "./components/feature3";
import ProblemSolutionSection from "./components/issuse-solution";
import BenefitsSection from "./components/BenefitsSection";
import SocialProofSection from "@/blocks/socialproofsection/SocialProofSection";

export const metadata = {
    title: "Posadzki Żywiczne do Garaży | Wytrzymałe i Odporne",
    description:
        "Oferujemy trwałe i odporne posadzki żywiczne do garaży. Wytrzymałość na obciążenia i estetyczny wygląd. Sprawdź ofertę!",
    keywords: "posadzki żywiczne do garaży, garaż żywica, wytrzymałe posadzki",
    openGraph: {
        title: "Posadzki Żywiczne do Garaży | Wytrzymałe i Odporne",
        description:
            "Oferujemy trwałe i odporne posadzki żywiczne do garaży. Wytrzymałość na obciążenia i estetyczny wygląd. Sprawdź ofertę!",
        url: "https://posadzkizywiczne.com/posadzki-garaz",
        images: [
            {
                url: "https://posadzkizywiczne.com/images/posadzki-garaz.jpg",
                width: 1200,
                height: 630,
                alt: "Posadzki Żywiczne do Garaży",
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
            <Feature3 />
            <FAQ2 />
            <CTA2 />
            {/* <Case2 /> */}
            {/* <Stats2 /> */}
            {/* <Blog1 /> */}
            <SocialProofSection />
            <Feature5 />
            <Contact1 />
        </>
    );
}
