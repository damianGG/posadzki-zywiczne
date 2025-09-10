"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroAnimatedTitle() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["piękna?", "trwała?", "nowoczesna?", "czysta?"],
        []
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTitleNumber((prev) => (prev + 1) % titles.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [titles.length]);

    return (
        <span className="relative flex w-full justify-start overflow-hidden text-left md:pb-4 md:pt-1">
            &nbsp;
            <AnimatePresence mode="wait">
                <motion.span
                    key={titleNumber}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                    {titles[titleNumber]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
