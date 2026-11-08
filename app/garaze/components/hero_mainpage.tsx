import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, MoveRight, PhoneCall } from "lucide-react";
type HeroMainPageProps = { variant?: "home" | "garage" };

export default function HeroMainPage({ variant = "home" }: HeroMainPageProps) {
    const garage = variant === "garage";
    if (garage) {
        return (
            <section className="container mx-auto grid items-center gap-8 px-4 py-12 md:grid-cols-2 lg:py-20">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Posadzka żywiczna do garażu</h1>
                    <p className="mt-4 text-lg">Podaj metraż, żeby obliczyć orientacyjny koszt. Jeśli beton wymaga naprawy, dołącz do e-maila zdjęcie całej podłogi i zbliżenie uszkodzeń.</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button asChild><a href="/kalkulator?typ=garaz">Oblicz koszt mojego garażu</a></Button>
                        <Button variant="outline" asChild><a href={`mailto:biuro@posadzkizywiczne.com?subject=${encodeURIComponent("Wycena posadzki w garażu")}&body=${encodeURIComponent("Miejscowość: \nMetraż: \nStan podłoża: ")}`}>Wyślij zdjęcia e-mailem</a></Button>
                    </div>
                    <p className="mt-4 text-sm">Wolisz porozmawiać? <a className="underline" href="tel:+48507384619">507 384 619</a></p>
                </div>
                <figure>
                    <Image src="https://res.cloudinary.com/dvvqfkmsw/image/upload/v1793190382/realizacje/chatgpt/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski/garaz-30m2-ral7035-oryginal-b2e28c4ecd288ef1.jpg" width={900} height={600} priority sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[3/2] w-full rounded-xl object-cover" alt="Jasnoszara posadzka z płatkami w garażu o powierzchni 30 m² w Sędziszowie Małopolskim" />
                    <figcaption className="mt-2 text-sm"><a className="underline" href="/realizacje/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski">Garaż 30 m² w Sędziszowie Małopolskim</a> · RAL 7035 z płatkami dekoracyjnymi</figcaption>
                </figure>
            </section>
        );
    }
    return (
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-white">
            {/* On phones the hero stays image-free: render portfolio photos below the fold instead. */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
                <Image
                    src="/garaz/IMG_1253.JPG"
                    alt=""
                    fill
                    quality={70}
                    sizes="(min-width: 1280px) 55vw, 50vw"
                    className="object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-55% to-white/10" />
            </div>

            <div className="container relative z-10 mx-auto flex min-h-[460px] items-center px-4 py-12 sm:min-h-[520px] sm:py-16 lg:min-h-[640px] lg:py-20">
                <div className="max-w-2xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        Posadzki żywiczne – wykonanie i wycena
                    </p>
                    <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                        Posadzki żywiczne do garażu, domu i firmy
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
                        Wykonujemy posadzki do garaży, domów, hal, na balkony i tarasy.
                        Rzeszów, Kraków i okolice. Zacznij od orientacyjnej wyceny garażu online.
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                            <a href="/kalkulator?typ=garaz">
                                Wyceń garaż
                                <MoveRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                            <a href="tel:+48507384619">
                                Zadzwoń: 507 384 619
                                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </Button>
                    </div>
                    <p className="mt-5 text-sm text-slate-700">
                        Inny rodzaj posadzki?{" "}
                        <a href="/kontakt" className="font-semibold underline underline-offset-4 hover:text-slate-950">
                            Wyślij zapytanie
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
