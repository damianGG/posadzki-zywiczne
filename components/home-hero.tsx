import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

const shots = [
  {
    src: "/garaz/IMG_1253.JPG",
    alt: "Jasna posadzka z płatkami w garażu",
    caption: "Garaż",
  },
  {
    src: "/kamienny-dywan/realizacje/kamienny-dywan-taras-bez-rzeszow-06-hq.webp",
    alt: "Beżowy kamienny dywan na tarasie",
    caption: "Taras",
  },
  {
    src: "/realizacje/krakow-rydlowka-balkon/IMG_1315.JPG",
    alt: "Balkon z jasną posadzką w płatki",
    caption: "Balkon",
  },
  {
    src: "/garaz/IMG_0910.JPG",
    alt: "Jasna gładka posadzka w dużym garażu",
    caption: "Gładka",
  },
];

export default function HomeHero() {
  return (
    <section className="bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Posadzki żywiczne</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Najpierw zdjęcia. Potem metraż.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Garaż, taras, dom albo firma. Wybierasz miejsce, oglądasz wykonane posadzki i zostawiasz numer. Bez katalogu systemów na starcie.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="#zamow" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
              Zobacz i wyceń <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href="tel:+48507384619" className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-600 px-6 py-3.5 text-sm font-semibold text-white hover:border-white">
              <Phone className="h-4 w-4" aria-hidden="true" /> 507 384 619
            </a>
          </div>
          <p className="mt-5 text-sm text-zinc-400">Rzeszów, Kraków i dojazd w region. Wycena po krótkiej rozmowie, nie po formularzu na trzy ekrany.</p>
        </div>
        <div className="order-1 grid grid-cols-2 gap-2 lg:order-2">
          {shots.map((shot, index) => (
            <div key={shot.src} className={"relative overflow-hidden rounded-2xl " + (index === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/3]")}>
              <Image src={shot.src} alt={shot.alt} fill priority={index === 0} sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} className="object-cover" />
              <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">{shot.caption}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
