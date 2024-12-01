"use client";

import { Heroes } from "@/components/blocks/heroes";
import { Header } from "@/components/header";
import { Hero } from "@/components/blocks/hero";
import { Cases } from "@/components/blocks/cases";
import { Testimonials } from "@/components/blocks/testimonials";
import { Features } from "@/components/blocks/features";
import { Pricings } from "@/components/blocks/pricings";
import { Stats } from "@/components/blocks/stats";
import { CTAs } from "@/components/blocks/ctas";
import { Blogs } from "@/components/blocks/blogs";
import { FAQs } from "@/components/blocks/faqs";
import { Contacts } from "@/components/blocks/contacts";
import { Footers } from "@/components/blocks/footers";
import { Headers } from "@/components/blocks/headers";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Contact2, MoveRight, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import HeroMainPage from "@/components/blocks/hero_mainpage";
import { Feature5 } from "@/blocks/feature/feature5";
import { Feature4 } from "@/blocks/feature/feature4";
import { CTA2 } from "@/blocks/cta/cta2";
import { Case2 } from "@/blocks/case/case2";

import { Stats2 } from "@/blocks/stats/stats2";
import { FAQ2 } from "@/blocks/faq/faq2";
import { Contact1 } from "@/blocks/contact/contact1";
import { Blog1 } from "@/blocks/blog/blog1";
import { Feature3 } from "@/blocks/feature/feature3";
import { Feature3left } from "@/blocks/feature/feature3-left";
import { Feature3Right } from "@/blocks/feature/feature3-right";

export default function Home() {


  return (
    <>
      <HeroMainPage />
      <Feature5 />
      <Feature3 />
      {/* <Feature4 /> */}
      <FAQ2 />
      <CTA2 />
      <Case2 />
      <Stats2 />
      {/* <Blog1 /> */}
      <Contact1 />
    </>
  );
}
