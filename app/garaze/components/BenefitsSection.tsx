

import Image from "next/image"
import { Sun, Sparkles, Palette, Shield, Timer, ThumbsUp } from 'lucide-react'

// Dane korzyści
const benefits = [
    {
        icon: Sun,
        title: "Odporność na UV",
        description: "Posadzka nie blaknie i zachowuje kolor na lata, nawet przy intensywnym nasłonecznieniu."
    },
    {
        icon: Sparkles,
        title: "Łatwe czyszczenie",
        description: "Gładka powierzchnia bez fug sprawia, że czyszczenie jest proste i szybkie. Bez smug i plam."
    },
    {
        icon: Palette,
        title: "Estetyka",
        description: "Dowolne kolory i wykończenia pozwalają na pełną personalizację według Twoich preferencji."
    },
    {
        icon: Shield,
        title: "Trwałość",
        description: "Odporna na uszkodzenia mechaniczne, zarysowania i uderzenia. Służy przez wiele lat."
    },
    {
        icon: Timer,
        title: "Szybki montaż",
        description: "Instalacja jest szybka i czysta, minimalizując czas remontu."
    },
    {
        icon: ThumbsUp,
        title: "Bezpieczeństwo",
        description: "Antypoślizgowa powierzchnia zapewnia bezpieczeństwo użytkowania."
    }
]

// Zdjęcia ilustrujące korzyści
const benefitImages = [
    {
        src: "/placeholder.svg?height=400&width=600",
        alt: "Przykład trwałości posadzki żywicznej po latach użytkowania"
    },
    {
        src: "/placeholder.svg?height=400&width=600",
        alt: "Demonstracja łatwego czyszczenia posadzki"
    },
    {
        src: "/placeholder.svg?height=400&width=600",
        alt: "Różnorodne kolory i wzory posadzek żywicznych"
    }
]

export default function BenefitsSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Dlaczego warto wybrać posadzkę żywiczną?
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Poznaj kluczowe zalety posadzek żywicznych, które sprawiają, że są idealnym wyborem
                        </p>
                    </div>
                </div>

                {/* Grid z korzyściami */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="p-3 rounded-full bg-primary/10">
                                <benefit.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{benefit.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{benefit.description}</p>
                        </div>
                    ))}
                </div>

                {/* Galeria zdjęć */}
                {/* <div className="mt-16 space-y-4">
                    <h3 className="text-2xl font-bold text-center mb-8">
                        Zobacz różnicę na własne oczy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefitImages.map((image, index) => (
                            <div key={index} className="relative aspect-video group overflow-hidden rounded-lg">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <p className="text-white text-center px-4 max-w-[80%]">
                                        {image.alt}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </section>
    )
}

