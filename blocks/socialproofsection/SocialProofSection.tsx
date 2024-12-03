"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star, Award, Building2, Calendar } from 'lucide-react'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { testimonials } from "@/data/testimonials"
import { TestimonialCarousel } from "./TestimonialCarousel"
// Przykładowe dane


// Dodano więcej klientów dla lepszej demonstracji slidera
const clients = [
    { name: "Firma A", logo: "/IMG_2966.jpg" },
    { name: "Firma B", logo: "/IMG_2966.jpg" },
    { name: "Firma C", logo: "/IMG_2966.jpg" },
    { name: "Firma D", logo: "/IMG_2966.jpg" },
    { name: "Firma E", logo: "/IMG_2966.jpg" },
    { name: "Firma F", logo: "/IMG_2966.jpg" },
    { name: "Firma G", logo: "/IMG_2966.jpg" },
    { name: "Firma H", logo: "/IMG_2966.jpg" }
]

const stats = [
    {
        icon: Building2,
        value: "500+",
        label: "Zrealizowanych projektów"
    },
    {
        icon: Calendar,
        value: "15+",
        label: "Lat doświadczenia"
    },
    {
        icon: Award,
        value: "100%",
        label: "Zadowolonych klientów"
    }
]

interface TestimonialCardProps {
    testimonial: {
        content: string
        author: string
        position: string
        rating: number
        image: string
    }
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <Card className="h-full">
            <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                    <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{testimonial.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-6">
                    <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.position}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

interface CertificateCardProps {
    certificate: {
        name: string
        image: string
        year: string
    }
}

function CertificateCard({ certificate }: CertificateCardProps) {
    return (
        <div className="text-center space-y-2">
            <div className="relative w-32 h-32 mx-auto">
                <Image
                    src={certificate.image}
                    alt={certificate.name}
                    fill
                    className="object-contain"
                />
            </div>
            <p className="font-medium">{certificate.name}</p>
            <p className="text-sm text-gray-500">{certificate.year}</p>
        </div>
    )
}

function ClientsCarousel() {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    const plugin = Autoplay({ delay: 3000, stopOnInteraction: false })

    return (
        <div className="w-full max-w-5xl mx-auto">
            <Carousel

                setApi={setApi}
                className="w-full"
                plugins={[plugin]}
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {clients.map((client, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4 lg:basis-1/4">
                            <div className="relative w-full h-20">
                                <Image
                                    src={client.logo}
                                    alt={client.name}
                                    fill
                                    className="object-contain filter grayscale hover:grayscale-0 transition-all"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            current === index ? "bg-primary" : "bg-muted"
                        )}
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`Przejdź do logo ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default function SocialProofSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
            <div className="container px-4 md:px-6">
                {/* Nagłówek sekcji */}
                <div className="flex flex-col items-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Zaufali nam
                    </h2>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        Zobacz, co mówią o nas nasi klienci i poznaj nasze osiągnięcia
                    </p>
                </div>

                {/* Statystyki */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center p-6 text-center space-y-2"
                        >
                            <div className="p-3 rounded-full bg-primary/10">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Opinie klientów */}
                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-center mb-8">
                        Opinie naszych klientów
                    </h3>
                    {testimonials && testimonials.length > 1 ? (
                        <TestimonialCarousel testimonials={testimonials} />
                    ) : (
                        <p>Brak dostępnych opinii.</p>
                    )}
                </div>


                {/* Certyfikaty i nagrody */}
                {/* <div className="mb-16">
                    <h3 className="text-2xl font-bold text-center mb-8">
                        Certyfikaty i nagrody
                    </h3>
                    {certificates.length > 3 ? (
                        <Carousel className="w-full max-w-5xl mx-auto">
                            <CarouselContent>
                                {certificates.map((certificate, index) => (
                                    <CarouselItem key={index} className="md:basis-1/3">
                                        <CertificateCard certificate={certificate} />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex" />
                            <CarouselNext className="hidden md:flex" />
                        </Carousel>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
                            {certificates.map((certificate, index) => (
                                <CertificateCard key={index} certificate={certificate} />
                            ))}
                        </div>
                    )}
                </div> */}

                {/* Logo klientów */}
                {/* <div>
                    <h3 className="text-2xl font-bold text-center mb-8">
                        Zaufali nam również
                    </h3>
                    <ClientsCarousel />
                </div> */}
            </div>
        </section>
    )
}

