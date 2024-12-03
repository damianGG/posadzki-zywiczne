"use client"

import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { TestimonialCard } from "./TestimonialCard"
import { cn } from "@/lib/utils"

interface TestimonialCarouselProps {
    testimonials: Array<{
        content: string
        author: string
        position: string
        rating: number
        image: string
    }>
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
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

    if (!testimonials || testimonials.length === 0) {
        return <p>Brak dostępnych opinii.</p>
    }

    return (
        <div className="w-full max-w-5xl mx-auto relative ">
            <Carousel
                setApi={setApi}
                className="w-full"
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent className="-ml-2 md:-ml-4 flex items-center">
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-[45%]">
                            <TestimonialCard testimonial={testimonial} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious aria-label="Poprzednia opinia" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md" />
                <CarouselNext aria-label="Następna opinia" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md" />
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
                        aria-label={`Przejdź do opinii ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

