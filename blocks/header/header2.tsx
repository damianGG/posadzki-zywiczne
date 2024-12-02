"use client";

import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavigationSubItem {
    title: string;
    href: string;
    image: string;
}

interface NavigationItem {
    title: string;
    href?: string;
    description?: string;
    image?: string;
    items?: NavigationSubItem[];
}

export const Header2 = () => {
    const navigationItems: NavigationItem[] = [
        {
            title: "Strona Główna",
            href: "/",
            description: "",
        },
        // {
        //     title: "Oferta",
        //     // description: "Sprawdzone rozwiązania w budownictwie prywatnym",
        //     items: [
        //         {
        //             title: "Balkony i Tarasy",
        //             href: "/posadzki-zywiczne-na-balkony",
        //             image: "/IMG_2966_res.jpg"
        //         },
        //         {
        //             title: "Garaże",
        //             href: "/garaze",
        //             image: "/garage.jpg"
        //         },
        //         {
        //             title: "Pomieszczenia czyste",
        //             href: "/pomieszczenia-czyste",
        //             image: "/gastronomia.jpg"
        //         },
        //         {
        //             title: "Kuchnie i Salony",
        //             href: "/kuchnia-salon",
        //             image: "/kuchnia.jpg"
        //         },
        //     ],
        // },
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

    ];

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const [isOpen, setOpen] = useState(true);
    const [hoveredSubItem, setHoveredSubItem] = useState<NavigationSubItem | null>(null);
    return (
        <header className={`w-full z-40 sticky top-0 left-0 transition-all duration-300 ${scrolled ? 'bg-background/50 backdrop-blur-md' : 'bg-background'
            }`}>

            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-2 items-center">

                <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
                    <NavigationMenu className="flex justify-start items-start">
                        <NavigationMenuList className="flex justify-start gap-4 flex-row">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem
                                    key={item.title}
                                    className="relative"
                                    onMouseLeave={() => setHoveredSubItem(null)} // Reset when leaving the menu item
                                >
                                    {item.href ? (
                                        <>
                                            <Link href={item.href} passHref>

                                                <Button variant="ghost">{item.title}</Button>


                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <NavigationMenuTrigger
                                                className="font-medium text-sm"
                                                onMouseEnter={() => {
                                                    // Set the hoveredSubItem to the first submenu item
                                                    if (item.items && item.items.length > 0) {
                                                        setHoveredSubItem(item.items[2]);
                                                    }
                                                }}
                                                onMouseLeave={() => {
                                                    // Optionally reset the hoveredSubItem when leaving the trigger
                                                    // setHoveredSubItem(null);
                                                }}
                                            >
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent
                                                className="absolute left-1/2 transform -translate-x-1/2 !w-[450px] p-4"
                                            >
                                                <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col h-full justify-between">
                                                        <div className="flex flex-col">
                                                            {item.description && (
                                                                <p className="text-muted-foreground text-sm">
                                                                    {item.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {(hoveredSubItem?.image || item.image) && (
                                                            <Image
                                                                src={hoveredSubItem?.image || item.image}
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
                                                                    // Reset to the first submenu item when leaving a subItem
                                                                    if (item.items && item.items.length > 0) {
                                                                        setHoveredSubItem(item.items[0]);
                                                                    } else {
                                                                        setHoveredSubItem(null);
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

                <div className="flex justify-end w-full gap-4">
                    {/* <div className="border-r hidden md:inline"></div> */}
                    <Button variant="outline"><Link href="/kontakt">Kontakt</Link></Button>
                    <Button><Link href="/kontakt">Bezpłatna konsultacja</Link></Button>
                </div>
                <div className="flex w-12 shrink lg:hidden items-end justify-end">
                    <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    {isOpen && (
                        <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
                            {navigationItems.map((item) => (
                                <div key={item.title}>
                                    <div className="flex flex-col gap-2">
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="flex justify-between items-center"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="text-lg">{item.title}</span>
                                                <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                                            </Link>
                                        ) : (
                                            <p className="text-lg">{item.title}</p>
                                        )}
                                        {item.items &&
                                            item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="flex justify-between items-center"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <span className="text-muted-foreground">
                                                        {subItem.title}
                                                    </span>
                                                    <MoveRight className="w-4 h-4 stroke-1" />
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};