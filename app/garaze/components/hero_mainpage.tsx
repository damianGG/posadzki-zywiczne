import Image from "next/image";
import Link from "next/link";

export default function HeroMainPage({ variant = "home" }: { variant?: "home" | "garage" }) {
  const garage = variant === "garage";
  return (
    <section className="brand-surface">
      <div className="mx-auto grid max-w-7xl items-center gap-5 px-4 py-5 sm:px-6 sm:py-10 lg:grid-cols-2 lg:gap-12 lg:py-14">
        <figure className="order-first min-w-0 lg:order-last">
          <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-zinc-200 sm:aspect-[16/10] lg:aspect-[4/3]">
            <Image src="/chatgpt-realizacje/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski/garaz-30m2-ral7035-oryginal.jpg" alt="Jasnoszara posadzka z płatkami w garażu 30 m² w Sędziszowie Małopolskim" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-bottom" />
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
