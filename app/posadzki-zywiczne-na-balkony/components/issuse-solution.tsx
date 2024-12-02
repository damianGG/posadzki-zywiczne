"use client"

import Image from "next/image"
import { Check, X } from 'lucide-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { useState, useEffect } from "react"

// Dane przykładowe - w rzeczywistości mogłyby pochodzić z CMS
const problemImages = [
    {
        src: "/remont-balkon.webp",
        alt: "Zniszczona powierzchnia balkonu - przykład 1",
    },
    {
        src: "/odpadajace_plytki.webp",
        alt: "Zniszczona powierzchnia balkonu - przykład 2",
    },
    {
        src: "/mech.jpg",
        alt: "Zniszczona powierzchnia balkonu - przykład 3",
    },
]

const solutionImages = [
    {
        src: "/IMG_2538_422.jpg",
        alt: "Profesjonalna posadzka żywiczna - przykład 1",
    },
    {
        src: "/IMG_2966.jpg",
        alt: "Profesjonalna posadzka żywiczna - przykład 2",
    },
    {
        src: "/IMG_3130.jpg",
        alt: "Profesjonalna posadzka żywiczna - przykład 3",
    },
]

function ImageCarousel({
    images,
}: {
    images: Array<{ src: string; alt: string }>
}) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    return (
        <div className="relative">
            <Carousel className="w-full" setApi={setApi}>
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="relative aspect-video">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
            <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`h-2 w-2 rounded-full transition-colors ${current === index ? "bg-primary" : "bg-muted"
                            }`}
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`Przejdź do zdjęcia ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default function ProblemSolutionSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 ">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Problem & Rozwiązanie
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Poznaj różnicę, jaką może przynieść profesjonalna posadzka żywiczna
                        </p>
                    </div>
                </div>

                <div className="mx-auto grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-[1200px] mt-12 relative">
                    {/* Vertical Separator - visible only on desktop */}
                    <div className="absolute left-1/2 top-0 h-full w-px bg-gray-200 hidden md:block -translate-x-1/2" />

                    {/* Problem Section */}
                    <div className="flex flex-col">
                        <div className="flex-1 space-y-4 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <X className="h-5 w-5 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold">Problem</h3>
                            </div>
                            <p className="text-xl">
                                Masz dość pękających płytek i trudnych w utrzymaniu powierzchni balkonu?
                            </p>
                            <ul className="space-y-2 mt-4">
                                <li className="flex items-start gap-2">
                                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <span>Pękające płytki podczas mrozów</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <span>Trudności w utrzymaniu czystości</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <span>Problemy z fugami i wykwitami</span>
                                </li>
                            </ul>
                        </div>
                        <ImageCarousel images={problemImages} />
                    </div>

                    {/* Solution Section */}
                    <div className="flex flex-col">
                        <div className="flex-1 space-y-4 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="h-5 w-5 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold">Rozwiązanie</h3>
                            </div>
                            <p className="text-xl">
                                Posadzki żywiczne - trwałe i eleganckie rozwiązanie
                            </p>
                            <ul className="space-y-2 mt-4">
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <span>Odporne na warunki atmosferyczne i mróz</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <span>Łatwe w utrzymaniu czystości</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <span>Bezspoinowa, wodoszczelna powierzchnia</span>
                                </li>
                            </ul>
                        </div>
                        <ImageCarousel images={solutionImages} />
                    </div>
                </div>
            </div>
        </section>
    )
}

