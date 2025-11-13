import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoveRight, PhoneCall } from "lucide-react";
import HeroAnimatedTitle from "@/components/HeroAnimatedTitle";


export default function HeroMainPage() {
    return (
        <div className="relative w-full min-h-screen">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/garaz/IMG_1253.JPG"
                    alt=""
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
                        </div>

                        <div className="flex flex-col md:flex-row gap-3">
                            <Button className="gap-4" variant="outline">
                                <a href="tel:+48507384619">+48 507 384 619</a>
                                <PhoneCall className="w-4 h-4" />
                            </Button>

                            <Button className="gap-4">
                                <a href="mailto:biuro@posadzkizywiczne.com">
                                    biuro@posadzkizywiczne.com
                                </a>
                                <MoveRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
