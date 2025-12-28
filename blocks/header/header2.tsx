"use client"

import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, MoveRight, X } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

interface NavigationSubItem {
    title: string
    href: string
    image: string
}

interface NavigationItem {
    title: string
    href?: string
    description?: string
    image?: string
    items?: NavigationSubItem[]
}

export const Header2 = () => {
    const navigationItems: NavigationItem[] = [
        {
            title: "Strona Główna",
            href: "/",
            description: "",
        },
        {
            title: "Realizacje",
            href: "/realizacje",
            description: "",
        },
        {
            title: "Galeria",
            href: "/galeria",
            description: "",
        },
        {
            title: "Balkony i Tarasy",
            href: "/posadzki-zywiczne-na-balkony",
            description: "",
        },
        {
            title: "Garaże",
            href: "/garaze",
            description: "",
        },
        {
            title: "Pomieszczenia Czyste",
            href: "/pomieszczenia-czyste",
            description: "",
        },
        {
            title: "Kuchnia i Salon",
            href: "/kuchnia-salon",
            description: "",
        },
    ]

    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled)
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [scrolled])

    const [isOpen, setOpen] = useState(false)
    const [hoveredSubItem, setHoveredSubItem] = useState<NavigationSubItem | null>(null)

    const menuVariants = {
        open: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.3 },
        },
        closed: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.3 },
        },
    }

    return (
        <header
            className={`sticky top-0 left-0 z-40 w-full bg-zinc-50`}
        >

            <div className="container relative mx-auto min-h-20 flex items-center justify-between">
                {/* LOGO/BRAND - DODANE */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8  rounded-md flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm"><Image src="/posadzkizywiczne.com_logo.png" alt="logo posadzkizywiczne.com" width={300} height={100} /></span>
                        </div>
                        <span className="font-bold text-lg hidden sm:block">PosadzkiŻywiczne.com</span>
                    </Link>
                </div>

                {/* NAVIGATION - ŚRODEK */}
                <div className="hidden lg:flex items-center">
                    <NavigationMenu className="flex justify-center items-center">
                        <NavigationMenuList className="flex justify-center gap-2 flex-row">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title} className="relative" onMouseLeave={() => setHoveredSubItem(null)}>
                                    {item.href ? (
                                        <Link href={item.href} passHref>
                                            <Button variant="ghost" size="sm" className="text-sm">
                                                {item.title}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <NavigationMenuTrigger
                                                className="font-medium text-sm"
                                                onMouseEnter={() => {
                                                    if (item.items && item.items.length > 0) {
                                                        setHoveredSubItem(item.items[2])
                                                    }
                                                }}
                                            >
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="absolute left-1/2 transform -translate-x-1/2 !w-[450px] p-4">
                                                <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col h-full justify-between">
                                                        <div className="flex flex-col">
                                                            {item.description && <p className="text-muted-foreground text-sm">{item.description}</p>}
                                                        </div>
                                                        {(hoveredSubItem?.image || item.image) && (
                                                            <Image
                                                                src={hoveredSubItem?.image || item.image || "/placeholder.svg"}
                                                                alt={hoveredSubItem?.title || item.title}
                                                                width={424}
                                                                height={424}
                                                                className="rounded-md mb-2"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col text-sm h-full justify-end">
                                                        {item.items?.map((subItem) => (
                                                            <NavigationMenuLink
                                                                href={subItem.href}
                                                                key={subItem.title}
                                                                className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
                                                                onMouseEnter={() => setHoveredSubItem(subItem)}
                                                                onMouseLeave={() => {
                                                                    if (item.items && item.items.length > 0) {
                                                                        setHoveredSubItem(item.items[0])
                                                                    } else {
                                                                        setHoveredSubItem(null)
                                                                    }
                                                                }}
                                                            >
                                                                <span>{subItem.title}</span>
                                                                <MoveRight className="w-4 h-4 text-muted-foreground" />
                                                            </NavigationMenuLink>
                                                        ))}
                                                    </div>
                                                </div>
                                            </NavigationMenuContent>
                                        </>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* CTA BUTTONS - PRAWA STRONA */}
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                        <Link href="/kontakt">Kontakt</Link>
                    </Button>
                    <Button
                        size="sm"
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:from-purple-700 hover:via-pink-600 hover:to-orange-500"
                    >
                        <Link href="/konkurs" className="flex items-center gap-2">
                            <span className="hidden sm:inline">Wygraj 5000 zł</span>
                            <span className="sm:hidden">Wygraj 5000 zł</span>
                        </Link>
                    </Button>
                </div>

                {/* MOBILE MENU BUTTON */}
                <div className="flex lg:hidden">
                    <Button variant="ghost" size="sm" onClick={() => setOpen(!isOpen)}>
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* MOBILE MENU */}
            <motion.div
                className="lg:hidden border-t bg-background/95 backdrop-blur-md"
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={menuVariants}
                style={{ overflow: "hidden" }}
            >
                <div className="container py-4 space-y-4">
                    {navigationItems.map((item) => (
                        <div key={item.title}>
                            <Link
                                href={item.href ?? "#"}
                                className="flex justify-between items-center py-2"
                                onClick={() => setOpen(false)}
                            >
                                <span className="text-base font-medium">{item.title}</span>
                                <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                            </Link>
                        </div>
                    ))}
                    <div className="pt-4 border-t space-y-3">
                        <Button variant="outline" className="w-full bg-transparent" asChild>
                            <Link href="/kontakt">Kontakt</Link>
                        </Button>
                        <Button className="w-full" asChild>
                            <Link href="/kontakt">Bezpłatna konsultacja</Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </header>
    )
}
