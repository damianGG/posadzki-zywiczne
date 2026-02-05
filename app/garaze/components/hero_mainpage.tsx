import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, MoveRight, PhoneCall } from "lucide-react";
import HeroAnimatedTitle from "@/components/HeroAnimatedTitle";


export default function HeroMainPage() {
    return (
        <div className="relative w-full min-h-screen">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/garaz/IMG_1253.JPG"
                    alt="Posadzka żywiczna w garażu - przykładowa realizacja"
                    fill
                    priority
                    className="object-cover object-right"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,1) 75%)",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center container">
                <div className="w-full md:w-1/2 px-4 md:px-8">
                    <div className="flex flex-col gap-8 py-20 lg:py-40 items-start justify-start">
                        <div className="flex gap-4 flex-col">
                            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-left font-regular">
                                <span className="text-spektr-cyan-50">
                                    Posadzka żywiczna która będzie
                                </span>
                                <HeroAnimatedTitle />
                            </h1>

                            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-left">
                                Odporne na zanieczyszczenia, estetyczne i łatwe w utrzymaniu.
                            </p>
                            <ul className="grid gap-2 text-sm md:text-base text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" />
                                    Darmowa wycena i pomiar w 24h
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" />
                                    Realizacja bez bałaganu w 3-5 dni
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" />
                                    Gwarancja trwałości oraz wsparcie po montażu
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3">
                            <Button className="gap-4" asChild>
                                <a href="#kontakt">
                                    Darmowa wycena
                                    <MoveRight className="w-4 h-4" />
                                </a>
                            </Button>
                            <Button className="gap-4" variant="outline" asChild>
                                <a href="tel:+48507384619">
                                    +48 507 384 619
                                    <PhoneCall className="w-4 h-4" />
                                </a>
                            </Button>

                            <Button className="gap-4" asChild>
                                <a href="mailto:biuro@posadzkizywiczne.com">
                                    biuro@posadzkizywiczne.com
                                    <MoveRight className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
