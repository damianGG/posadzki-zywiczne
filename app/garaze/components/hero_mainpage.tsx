import Image from "next/image";
import Link from "next/link";

export default function HeroMainPage({ variant = "home" }: { variant?: "home" | "garage" }) {
  const garage = variant === "garage";
  if (!garage) return (
    <section className="premium-hero">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-8 pt-5 sm:px-6 sm:py-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14 lg:py-16">
        <figure className="order-first min-w-0 lg:order-last">
          <div className="relative aspect-[16/8] overflow-hidden rounded-xl bg-[#E4E1DB] sm:aspect-[16/10] lg:aspect-[4/3]">
            <Image src="/chatgpt-realizacje/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski/garaz-30m2-ral7035-oryginal.jpg" alt="Jasnoszara posadzka z płatkami w garażu 30 m² w Sędziszowie Małopolskim" fill priority fetchPriority="high" quality={72} sizes="(min-width: 1280px) 670px, (min-width: 1024px) 53vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)" className="object-cover object-bottom" />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs text-[#575C54] sm:text-sm">
            <span>Nasza realizacja · Sędziszów Młp. · 30 m²</span>
            <Link prefetch={false} href="/realizacje/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski" className="font-semibold underline underline-offset-4">Zobacz projekt <span aria-hidden="true">↗</span></Link>
          </figcaption>
        </figure>
        <div className="min-w-0">
          <p className="brand-eyebrow">Rzeszów, Kraków i okolice</p>
          <h1 className="premium-display mt-3 text-[clamp(2rem,4.4vw,4.15rem)] font-medium">Posadzki żywiczne do garażu, domu i firmy.</h1>
          <p className="premium-serif mt-3 text-xl text-[#596257] sm:text-[1.65rem]">Piękno tkwi w wykończeniu.</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#50564E] sm:text-lg">Od pierwszej rozmowy po ostatni detal. Doradzimy, jaki system sprawdzi się u Ciebie, i wykonamy posadzkę dopasowaną do Twojej przestrzeni.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link href="#services-heading" className="premium-primary inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3.5 text-center text-sm font-semibold">Wybierz rodzaj posadzki <span aria-hidden="true">↘</span></Link>
            <Link href="/kalkulator?typ=garaz" className="premium-secondary inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3.5 text-center text-sm font-semibold">Sprawdź cenę garażu</Link>
          </div>
          <p className="mt-5 text-sm text-[#50564E]">Wolisz porozmawiać? <a className="font-semibold text-[#273B2E] underline underline-offset-4" href="tel:+48507384619">507 384 619</a></p>
          <nav aria-label="Szybki dostęp" className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-[#D9DBD3] pt-3 text-sm text-[#50564E]">
            <Link href="#home-services-private" className="inline-flex min-h-11 items-center hover:underline">Dom i garaż</Link>
            <Link href="#home-services-business" className="inline-flex min-h-11 items-center hover:underline">Firma i przemysł</Link>
            <Link href="#home-price-section" className="inline-flex min-h-11 items-center hover:underline">Koszt</Link>
            <Link href="#home-realizations" className="inline-flex min-h-11 items-center hover:underline">Realizacje</Link>
          </nav>
        </div>
      </div>
    </section>
  );
  return (
    <section className="brand-surface">
      <div className="mx-auto grid max-w-7xl items-center gap-5 px-4 py-5 sm:px-6 sm:py-10 lg:grid-cols-2 lg:gap-12 lg:py-14">
        <figure className="order-first min-w-0 lg:order-last">
          <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-zinc-200 sm:aspect-[16/10] lg:aspect-[4/3]">
            <Image src="/chatgpt-realizacje/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski/garaz-30m2-ral7035-oryginal.jpg" alt="Jasnoszara posadzka z płatkami w garażu 30 m² w Sędziszowie Małopolskim" fill priority fetchPriority="high" quality={72} sizes="(min-width: 1280px) 592px, (min-width: 1024px) calc((100vw - 96px) / 2), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)" className="object-cover object-bottom" />
          </div>
          <figcaption className="mt-3 text-sm text-zinc-600">
            <Link href="/realizacje/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski" className="underline underline-offset-4">Nasza realizacja · Sędziszów Małopolski · 30 m²</Link>
          </figcaption>
        </figure>
        <div>
          <p className="brand-eyebrow">Rzeszów, Kraków i okolice</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">{garage ? "Posadzka żywiczna do garażu" : "Posadzki żywiczne do garażu, domu i firmy"}</h1>
          <p className="mt-3 max-w-xl text-base sm:text-lg leading-relaxed text-zinc-600">Zobacz nasze realizacje i porównaj wykończenia. Sprawdź koszt, zakres prac i to, na co uważać przed wyborem posadzki.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href={garage ? "/garaze#wykonczenia" : "#services-heading"} className="rounded-full brand-button px-6 py-3.5 text-center font-semibold">Wybierz rodzaj posadzki</Link>
            <Link href="/kalkulator?typ=garaz" className="rounded-full border border-zinc-400 px-6 py-3.5 text-center font-semibold text-zinc-950 hover:bg-white">Sprawdź cenę garażu</Link>
          </div>
          {!garage && <nav aria-label="Szybki dostęp" className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium"><Link href="#home-services-private" className="inline-flex min-h-11 items-center underline underline-offset-4">Dom i garaż</Link><Link href="#home-services-business" className="inline-flex min-h-11 items-center underline underline-offset-4">Firma i przemysł</Link><Link href="#home-price-section" className="inline-flex min-h-11 items-center underline underline-offset-4">Koszt</Link><Link href="#home-realizations" className="inline-flex min-h-11 items-center underline underline-offset-4">Realizacje</Link></nav>}
          <p className="mt-5 text-base text-zinc-600">Masz pytanie? <a className="font-semibold underline underline-offset-4" href="tel:+48507384619">507 384 619</a></p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">Wycenę przygotujemy na podstawie metrażu, miejscowości i stanu podłoża. Nie musisz znać nazwy systemu.</p>
        </div>
      </div>
    </section>
  );
}
