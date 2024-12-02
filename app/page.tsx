
import HeroMainPage from "@/components/blocks/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";
import { Feature4 } from "@/blocks/feature/feature4";
import { CTA2 } from "@/blocks/cta/cta2";


import { Stats2 } from "@/blocks/stats/stats2";
import { FAQ2 } from "@/blocks/faq/faq2";
import { Contact1 } from "@/blocks/contact/contact1";

import { Feature3 } from "@/blocks/feature/feature3";
import { NextSeo } from 'next-seo';

export default function Home() {


  return (
    <>

      <HeroMainPage />
      <Feature5 />
      <Feature3 />
      <Feature4 />
      <FAQ2 />
      <CTA2 />
      {/* <Case2 /> */}
      <Stats2 />
      {/* <Blog1 /> */}
      <Contact1 />
    </>
  );
}
