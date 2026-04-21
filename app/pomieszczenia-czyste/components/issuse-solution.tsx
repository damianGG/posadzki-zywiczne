"use client"

import Image from "next/image";
import { Check, X } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const data = {
    problem: {
        title: "Problem",
        description: "Standardowe posadzki nie spełniają norm sanitarnych w produkcji spożywczej?",
        points: [
            "Fugi i pory – idealne siedlisko bakterii i grzybów",
            "Nasiąkliwe podłoże pochłania tłuszcze, kwasy i detergenty",
            "Trudności w dezynfekcji – kontrola sanepidu wykazuje uchybienia",
            "Pękający beton i odpadające płytki zagrażają produktowi",
            "Brak odporności na gorącą wodę i parę wodną",
        ],
        images: [
            {
                src: "/garaz/beton-problem.jpg",
                alt: "Zniszczona posadzka w zakładzie spożywczym",
            },
            {
                src: "/garaz/beton-plamy.jpg",
                alt: "Pory i plamy na betonowej podłodze",
            },
            {
                src: "/garaz/garaz-tesla.png",
                alt: "Stara, niehigieniczna posadzka",
            },
        ],
    },
    solution: {
        title: "Rozwiązanie",
        description: "Bezszwowe posadzki żywiczne zgodne z HACCP i normami sanitarnymi",
        points: [
            "Bezszwowa powierzchnia — bez fug, bez bakterii",
            "Pełna odporność chemiczna: kwasy spożywcze, zasady, środki dezynfekujące",
            "Certyfikat PZH — dopuszczenie do kontaktu z żywnością",
            "Odporność na parę wodną i myjki wysokociśnieniowe (80°C)",
            "Antypoślizgowa nawet w wilgotnych warunkach (R11/R12)",
        ],
        images: [
            {
                src: "/gastronomia.jpg",
                alt: "Higieniczna posadzka żywiczna w kuchni przemysłowej",
            },
            {
                src: "/produkcja.jpg",
                alt: "Posadzka żywiczna w zakładzie produkcji spożywczej",
            },
            {
                src: "/garaz/garaz-tesla-po.png",
                alt: "Efekt końcowy — estetyczna i higieniczna posadzka",
            },
        ],
    },
};

function ImageCarousel({
    images,
}: {
    images: Array<{ src: string; alt: string }>;
}) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="relative">
            <Carousel className="w-full" setApi={setApi}>
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index}>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="relative aspect-video cursor-pointer">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                    <div className="relative w-full h-[80vh]">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
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
    );
}

export default function ProblemSolutionSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 ">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Problem & Rozwiązanie w branży spożywczej
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Dowiedz się, dlaczego standardowe podłogi nie spełniają norm sanitarnych i jak posadzki żywiczne rozwiązują ten problem
                        </p>
                    </div>
                </div>

                <div className="mx-auto grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-[1200px] mt-12 relative">
                    {/* Vertical Separator */}
                    <div className="absolute left-1/2 top-0 h-full w-px bg-gray-200 hidden md:block -translate-x-1/2" />

                    {/* Problem Section */}
                    <div className="flex flex-col">
                        <div className="flex-1 space-y-4 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <X className="h-5 w-5 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold">{data.problem.title}</h3>
                            </div>
                            <p className="text-xl">{data.problem.description}</p>
                            <ul className="space-y-2 mt-4">
                                {data.problem.points.map((point, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <ImageCarousel images={data.problem.images} />
                    </div>

                    {/* Solution Section */}
                    <div className="flex flex-col">
                        <div className="flex-1 space-y-4 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="h-5 w-5 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold">{data.solution.title}</h3>
                            </div>
                            <p className="text-xl">{data.solution.description}</p>
                            <ul className="space-y-2 mt-4">
                                {data.solution.points.map((point, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <ImageCarousel images={data.solution.images} />
                    </div>
                </div>
            </div>
        </section>
    );
}
