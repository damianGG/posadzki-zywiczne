"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoveRight, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroMainPage() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["piękna?", "trwała?", "nowoczesna?", "czysta?"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="relative w-full min-h-screen ">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-right"
                style={{
                    backgroundImage: 'url("/garaz/garaz-tesla-po.png")',
                }}
            >
                {/* Gradient Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,1) 75%)",
                    }}
                ></div>
            </div>
            {/* Content */}
            <div className="relative z-10 h-full flex items-center container">
                <div className="w-full md:w-1/2 px-4 md:px-8">
                    <div className="flex flex-col gap-8 py-20 lg:py-40 items-start justify-start">
                        <div>
                            {/* <Button variant="secondary" size="sm" className="gap-4">
                                Zobacz nasze artykuły <MoveRight className="w-4 h-4" />
                            </Button> */}
                        </div>
                        <div className="flex gap-4 flex-col">
                            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-left font-regular">
                                <span className="text-spektr-cyan-50">Posadzka żywiczna która będzie</span>
                                <span className="relative flex w-full justify-start overflow-hidden text-left md:pb-4 md:pt-1">
                                    &nbsp;
                                    {titles.map((title, index) => (
                                        <motion.span
                                            key={index}
                                            className="absolute font-semibold"
                                            initial={{ opacity: 0, y: "-100" }}
                                            transition={{ type: "spring", stiffness: 50 }}
                                            animate={
                                                titleNumber === index
                                                    ? {
                                                        y: 0,
                                                        opacity: 1,
                                                    }
                                                    : {
                                                        y: titleNumber > index ? -150 : 150,
                                                        opacity: 0,
                                                    }
                                            }
                                        >
                                            {title}
                                        </motion.span>
                                    ))}
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-left">
                                Odporne na zanieczyszczenia, estetyczne i łatwe w utrzymaniu.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3">

                            <Button className="gap-4" variant="outline">
                                <a href="tel:+48507384619">+48 507 384 619</a><PhoneCall className="w-4 h-4" />
                            </Button>

                            <Button className="gap-4">
                                <a href="mailto:biuro@posadzkizywiczne.com">biuro@posadzkizywiczne.com</a>
                                <MoveRight className="w-4 h-4" />
                            </Button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
