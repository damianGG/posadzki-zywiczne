"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import {
    Calculator,
    Home,
    Palette,
    Wrench,
    Download,
    CheckCircle,
    AlertTriangle,
    HelpCircle,
    Sparkles,
    Layers,
    Mail,
    ToggleLeft,
    ToggleRight,
} from "lucide-react"
import jsPDF from "jspdf"
import Image from "next/image"
import confetti from "canvas-confetti"

// Constants
const PLACEHOLDER_IMAGE = "/placeholder.svg"

interface PriceRange {
    min_m2: number
    max_m2: number | null
    price_per_m2: number
    is_flat_rate?: boolean
}

interface RodzajPowierzchniOption {
    id: string
    nazwa: string
    opis: string
    cenaZaM2: number
    price_ranges?: PriceRange[]
    zdjecie: string
    wlasciwosci: string[]
}

interface KolorOption {
    id: string
    nazwa: string
    kodRAL: string
    cenaDodatkowa: number
    zdjecie: string
    podglad: string
}

interface PosadzkaOption {
    id: string
    nazwa: string
    rodzajePowierzchni: RodzajPowierzchniOption[]
    kolory: KolorOption[]
}

interface RodzajPomieszczeniaOption {
    id: string
    nazwa: string
    opis: string
    ikona: string
    dostepny: boolean
}

interface StanBetonuOption {
    id: string
    nazwa: string
    opis: string
    cenaDodatkowa: number
    showPriceInLabel?: boolean
}

interface DodatkowaUsluga {
    id: string
    nazwa: string
    opis: string
    kategoria: string
    domyslnie: boolean
    zdjecie: string
    obowiazkowy: boolean
    wCeniePosadzki: boolean
    cenaZaM2?: number
    cenaZaMb?: number
    cenaStala?: number
}

const fallbackRodzajePomieszczen: RodzajPomieszczeniaOption[] = [
    {
        id: "garaz-piwnica",
        nazwa: "Garaż / Piwnica",
        opis: "Posadzka żywiczna dla garaży i piwnic - wytrzymała i łatwa w utrzymaniu",
        ikona: "🚗",
        dostepny: true,
    },
    {
        id: "mieszkanie-dom",
        nazwa: "Mieszkanie / Dom",
        opis: "Elegancka posadzka żywiczna do przestrzeni mieszkalnych",
        ikona: "🏠",
        dostepny: true,
    },
    {
        id: "balkon-taras",
        nazwa: "Balkon / Taras",
        opis: "Posadzka zewnętrzna odporna na warunki atmosferyczne (niedostępne)",
        ikona: "🌿",
        dostepny: false,
    },
]

const fallbackStanyBetonu: StanBetonuOption[] = [
    {
        id: "nowa-wylewka",
        nazwa: "Nowa wylewka betonowa",
        opis: "Świeża wylewka betonowa - wymaga jedynie gruntowania",
        cenaDodatkowa: 0,
    },
    {
        id: "plytki",
        nazwa: "Płytki ceramiczne",
        opis: "Istniejące płytki - wymagają usunięcia i przygotowania podłoża",
        cenaDodatkowa: 25,
    },
]

const rodzajePowierzchni: RodzajPowierzchniOption[] = [
    {
        id: "podstawowa",
        nazwa: "Podstawowa lekko chropowata",
        opis: "Powierzchnia z kruszywem kwarcowym zapewniająca dobrą przyczepność",
        cenaZaM2: 200,
        zdjecie: `${PLACEHOLDER_IMAGE}?height=80&width=80&text=Podstawowa+Chropowata`,
        wlasciwosci: ["Kruszywo kwarcowe", "Lekko chropowata", "Dobra przyczepność", "Standardowa odporność"],
    },
    {
        id: "akrylowa",
        nazwa: "Z posypką z płatków akrylowych",
        opis: "Dekoracyjna powierzchnia z kolorowymi płatkami akrylowymi",
        cenaZaM2: 230,
        zdjecie: `${PLACEHOLDER_IMAGE}?height=80&width=80&text=Płatki+Akrylowe`,
        wlasciwosci: ["Płatki akrylowe", "Efekt dekoracyjny", "Zwiększona estetyka", "Dobra odporność"],
    },
    {
        id: "zacierana",
        nazwa: "Zacierana mechanicznie",
        opis: "Gładka powierzchnia zacierana mechanicznie dla najwyższej jakości",
        cenaZaM2: 260,
        zdjecie: `${PLACEHOLDER_IMAGE}?height=80&width=80&text=Zacierana+Mechanicznie`,
        wlasciwosci: ["Zacierana mechanicznie", "Gładka powierzchnia", "Najwyższa jakość", "Maksymalna odporność"],
    },
]

const koloryRAL: KolorOption[] = [
    {
        id: "ral7035",
        nazwa: "RAL 7035 - Szary jasny",
        kodRAL: "RAL 7035",
        cenaDodatkowa: 0,
        zdjecie: `${PLACEHOLDER_IMAGE}?height=80&width=80&text=RAL7035`,
        podglad: `${PLACEHOLDER_IMAGE}?height=400&width=600&text=RAL7035+Podgląd+Posadzki`,
    },
    {
        id: "ral7040",
        nazwa: "RAL 7040 - Szary okno",
        kodRAL: "RAL 7040",
        cenaDodatkowa: 0,
        zdjecie: `${PLACEHOLDER_IMAGE}?height=80&width=80&text=RAL7040`,
        podglad: `${PLACEHOLDER_IMAGE}?height=400&width=600&text=RAL7040+Podgląd+Posadzki`,
    },
    {
        id: "ral7035posypka",
        nazwa: "RAL 7035 z posypką",
        kodRAL: "RAL 7035",
        cenaDodatkowa: 50,
        zdjecie: `${PLACEHOLDER_IMAGE}?height=80&width=80&text=RAL7035+Posypka`,
        podglad: `${PLACEHOLDER_IMAGE}?height=400&width=600&text=RAL7035+Posypka+Podgląd`,
    },
]

const rodzajePosadzek: PosadzkaOption[] = [
    {
        id: "zywica",
        nazwa: "Posadzka żywiczna",
        rodzajePowierzchni: rodzajePowierzchni,
        kolory: koloryRAL,
    },
]

const fallbackDodatkiUslugi: DodatkowaUsluga[] = [
    {
        id: "gruntowanie",
        nazwa: "Gruntowanie podłoża",
        cenaZaM2: 8,
        opis: "Dwukrotne gruntowanie podłoża dla lepszej przyczepności",
        kategoria: "przygotowanie",
        domyslnie: true,
        zdjecie: "/images/gruntowanie.jpg",
        obowiazkowy: true,
        wCeniePosadzki: false,
    },
    {
        id: "cokol",
        nazwa: "Cokoły na wysokość 10cm",
        cenaZaMb: 15,
        opis: "Wykonanie cokołu żywicznego na wysokość 10cm",
        kategoria: "wykończenie",
        domyslnie: true,
        zdjecie: "/images/cokol.jpg",
        obowiazkowy: true,
        wCeniePosadzki: false,
    },
    {
        id: "uszczelnienie",
        nazwa: "Uszczelnienie między ścianą a posadzką",
        cenaZaMb: 8,
        opis: "Silikonowe uszczelnienie styku posadzki z ścianą",
        kategoria: "wykończenie",
        domyslnie: true,
        zdjecie: "/images/uszczelnienie.jpg",
        obowiazkowy: true,
        wCeniePosadzki: false,
    },
    {
        id: "dylatacje",
        nazwa: "Dylatacje",
        cenaZaMb: 12,
        opis: "Wykonanie dylatacji w posadzce zgodnie z wymogami technicznymi",
        kategoria: "wykończenie",
        domyslnie: false,
        zdjecie: "/images/dylatacje.jpg",
        obowiazkowy: false,
        wCeniePosadzki: false,
    },
    {
        id: "podklad",
        nazwa: "Podkład wyrównujący",
        cenaZaM2: 15,
        opis: "Samopoziomujący podkład cementowy do wyrównania powierzchni",
        kategoria: "przygotowanie",
        domyslnie: false,
        zdjecie: "/images/podklad.jpg",
        obowiazkowy: false,
        wCeniePosadzki: false,
    },
    {
        id: "szlifowanie",
        nazwa: "Szlifowanie betonu",
        cenaZaM2: 12,
        opis: "Mechaniczne przygotowanie powierzchni betonowej",
        kategoria: "przygotowanie",
        domyslnie: false,
        zdjecie: "/images/szlifowanie.jpg",
        obowiazkowy: false,
        wCeniePosadzki: false,
    },
    {
        id: "naprawa-ubytków",
        nazwa: "Naprawa ubytków",
        cenaZaM2: 25,
        opis: "Wypełnienie i wyrównanie ubytków w podłożu",
        kategoria: "przygotowanie",
        domyslnie: false,
        zdjecie: "/images/naprawa.jpg",
        obowiazkowy: false,
        wCeniePosadzki: false,
    },
    {
        id: "warstwa-ochronna",
        nazwa: "Warstwa ochronna",
        cenaZaM2: 18,
        opis: "Dodatkowa warstwa ochronna zwiększająca odporność",
        kategoria: "ochrona",
        domyslnie: false,
        zdjecie: "/images/warstwa-ochronna.jpg",
        obowiazkowy: false,
        wCeniePosadzki: false,
    },
    {
        id: "antypoślizgowa",
        nazwa: "Powierzchnia antypoślizgowa",
        cenaZaM2: 22,
        opis: "Specjalna tekstura zwiększająca bezpieczeństwo",
        kategoria: "ochrona",
        domyslnie: false,
        zdjecie: "/images/antypoślizgowa.jpg",
        obowiazkowy: false,
        wCeniePosadzki: false,
    },
    {
        id: "transport",
        nazwa: "Transport i dostawa",
        cenaStala: 150,
        opis: "Dostawa materiałów na teren budowy",
        kategoria: "logistyka",
        domyslnie: false,
        zdjecie: "/images/transport.jpg",
        obowiazkowy: false,
        wCeniePosadzki: false,
    },
    {
        id: "demontaz",
        nazwa: "Demontaż starej posadzki",
        cenaZaM2: 8,
        opis: "Usunięcie istniejącej posadzki wraz z wywozem gruzu",
        kategoria: "przygotowanie",
        domyslnie: false,
        zdjecie: "/images/demontaz.jpg",
        obowiazkowy: false,
        wCeniePosadzki: false,
    },
    {
        id: "sprzatanie",
        nazwa: "Sprzątanie końcowe",
        cenaStala: 200,
        opis: "Kompleksowe sprzątanie po zakończeniu prac",
        kategoria: "wykończenie",
        domyslnie: false,
        zdjecie: "/images/sprzatanie.jpg",
        obowiazkowy: false,
        wCeniePosadzki: false,
    },
]

// Walidacja wymiarów
const WYMIARY_LIMITS = {
    min: 1,
    max: 50,
    minPowierzchnia: 1,
    maxPowierzchnia: 2500,
}

const FLAT_RATE_LIMIT_M2 = 34
const FLAT_RATE_AMOUNT = 5000

const DIACRITIC_MAP: Record<string, string> = {
    ą: "a",
    Ą: "A",
    ć: "c",
    Ć: "C",
    ę: "e",
    Ę: "E",
    ł: "l",
    Ł: "L",
    ń: "n",
    Ń: "N",
    ó: "o",
    Ó: "O",
    ś: "s",
    Ś: "S",
    ź: "z",
    Ź: "Z",
    ż: "z",
    Ż: "Z",
}

const normalizeServiceId = (serviceId: string) =>
    serviceId
        .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (char) => DIACRITIC_MAP[char] || char)
        .toLowerCase()

const SERVICE_IMAGE_MAP: Record<string, string> = {
    gruntowanie: "/images/gruntowanie.jpg",
    cokol: "/images/cokol.jpg",
    uszczelnienie: "/images/uszczelnienie.jpg",
    dylatacje: "/images/dylatacje.jpg",
    podklad: "/images/podklad.jpg",
    szlifowanie: "/images/szlifowanie.jpg",
    "naprawa-ubytkow": "/images/naprawa.jpg",
    demontaz: "/images/demontaz.jpg",
    "warstwa-ochronna": "/images/warstwa-ochronna.jpg",
    antyposlizgowa: "/images/antyposlizgowa.jpg",
    transport: "/images/transport.jpg",
    sprzatanie: "/images/sprzatanie.jpg",
}

const getServiceImage = (serviceId?: string | null, imageUrl?: string | null) => {
    if (imageUrl) return imageUrl
    if (!serviceId) return PLACEHOLDER_IMAGE
    const normalizedId = normalizeServiceId(serviceId)
    return SERVICE_IMAGE_MAP[normalizedId] || PLACEHOLDER_IMAGE
}

interface ProgressBarProps {
    currentStep: number
    steps: Array<{ id: string; title: string; description: string }>
}

function ProgressBar({ currentStep, steps }: ProgressBarProps) {
    const totalSteps = steps.length

    return (
        <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                {/* Desktop version */}
                <div className="hidden md:flex items-center justify-between">
                    {steps.map((step, index) => {
                        const stepNumber = index + 1
                        return (
                            <div key={step.id} className="flex items-center flex-1">
                            <div className="flex items-center">
                                <div
                                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ease-in-out
                    ${currentStep > stepNumber
                                            ? "bg-green-500 border-green-500 text-white"
                                            : currentStep === stepNumber
                                                ? "bg-blue-500 border-blue-500 text-white"
                                                : "bg-gray-100 border-gray-300 text-gray-500"
                                        }
                  `}
                                >
                                    {currentStep > stepNumber ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <span className="text-sm font-semibold">{stepNumber}</span>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div
                                        className={`text-sm font-medium transition-colors duration-300 ${currentStep >= stepNumber ? "text-gray-900" : "text-gray-500"
                                            }`}
                                    >
                                        {step.title}
                                    </div>
                                    <div
                                        className={`text-xs transition-colors duration-300 ${currentStep >= stepNumber ? "text-gray-600" : "text-gray-400"
                                            }`}
                                    >
                                        {step.description}
                                    </div>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-4">
                                    <div className="h-0.5 bg-gray-200 relative overflow-hidden">
                                        <div
                                            className={`
                        h-full transition-all duration-700 ease-in-out
                        ${currentStep > stepNumber ? "bg-green-500 w-full" : "bg-gray-200 w-0"}
                      `}
                                        />
                                    </div>
                                </div>
                            )}
                            </div>
                        )})}
                </div>

                {/* Mobile version */}
                <div className="md:hidden">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-2">
                            <div
                                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500 ease-in-out
                  ${currentStep === totalSteps
                                        ? "bg-green-500 border-green-500 text-white"
                                        : "bg-blue-500 border-blue-500 text-white"
                                    }
                `}
                            >
                                <span className="text-sm font-semibold">{currentStep}</span>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">{steps[currentStep - 1]?.title}</div>
                                <div className="text-xs text-gray-600">
                                    Krok {currentStep} z {totalSteps}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

interface HelpTooltipProps {
    content: string
    children: React.ReactNode
}

function HelpTooltip({ content, children }: HelpTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                        {children}
                        <HelpCircle className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors cursor-help" />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

// Funkcja konfetti
const triggerConfetti = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
            return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Lewa strona
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })

        // Prawa strona
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
    }, 250)
}

// Funkcja do konwersji tekstu na format kompatybilny z PDF
const formatTextForPDF = (text: string): string => {
    return text
        .replace(/ą/g, "a")
        .replace(/ć/g, "c")
        .replace(/ę/g, "e")
        .replace(/ł/g, "l")
        .replace(/ń/g, "n")
        .replace(/ó/g, "o")
        .replace(/ś/g, "s")
        .replace(/ź/g, "z")
        .replace(/ż/g, "z")
        .replace(/Ą/g, "A")
        .replace(/Ć/g, "C")
        .replace(/Ę/g, "E")
        .replace(/Ł/g, "L")
        .replace(/Ń/g, "N")
        .replace(/Ó/g, "O")
        .replace(/Ś/g, "S")
        .replace(/Ź/g, "Z")
        .replace(/Ż/g, "Z")
}

interface CalculatorData {
    surfaceTypes: any[]
    colors: any[]
    services: any[]
    roomTypes: any[]
    concreteStates: any[]
    stepConfigs: any[]
}

interface KalkulatorPosadzkiClientProps {
    initialData: CalculatorData
}

export default function KalkulatorPosadzkiClient({ initialData }: KalkulatorPosadzkiClientProps) {
    // Transform server data to component format early to prevent errors
    const transformedSurfaces = React.useMemo(() => {
        if (!initialData?.surfaceTypes || initialData.surfaceTypes.length === 0) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('Using fallback surface types - Supabase data not available')
            }
            return { data: rodzajePowierzchni, isFallback: true }
        }
        
        try {
            const transformed = initialData.surfaceTypes
                .filter((s: any) => s.is_active !== false)
                .map((s: any) => {
                    let properties = []
                    try {
                        properties = typeof s.properties === 'string' 
                            ? JSON.parse(s.properties) 
                            : (Array.isArray(s.properties) ? s.properties : [])
                    } catch (e) {
                        console.error('Error parsing properties for surface:', s.id, e)
                        properties = []
                    }
                    
                    return {
                        id: String(s.id || ''),
                        nazwa: s.name || 'Bez nazwy',
                        opis: s.description || '',
                        cenaZaM2: Number(s.price_per_m2) || 0,
                        price_ranges: Array.isArray(s.price_ranges) ? s.price_ranges : [],
                        zdjecie: s.image_url || PLACEHOLDER_IMAGE,
                        wlasciwosci: properties,
                    }
                })
            
            if (transformed.length === 0) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('No active surface types found - using fallback data')
                }
                return { data: rodzajePowierzchni, isFallback: true }
            }
            
            return { data: transformed, isFallback: false }
        } catch (error) {
            console.error('Error transforming surfaces:', error)
            return { data: rodzajePowierzchni, isFallback: true }
        }
    }, [initialData])
    
    const transformedColors = React.useMemo(() => {
        if (!initialData?.colors || initialData.colors.length === 0) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('Using fallback colors - Supabase data not available')
            }
            return { data: koloryRAL, isFallback: true }
        }
        
        try {
            const transformed = initialData.colors
                .filter((c: any) => c.is_active !== false)
                .map((c: any) => ({
                    id: String(c.id || ''),
                    nazwa: c.name || 'Bez nazwy',
                    kodRAL: c.ral_code || '',
                    cenaDodatkowa: Number(c.additional_price) || 0,
                    // Prioritize thumbnail_url (correct field from Supabase schema) with image_url as fallback
                    zdjecie: c.thumbnail_url || c.image_url || PLACEHOLDER_IMAGE,
                    podglad: c.preview_url || PLACEHOLDER_IMAGE,
                }))
            
            if (transformed.length === 0) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('No active colors found - using fallback data')
                }
                return { data: koloryRAL, isFallback: true }
            }
            
            return { data: transformed, isFallback: false }
        } catch (error) {
            console.error('Error transforming colors:', error)
            return { data: koloryRAL, isFallback: true }
        }
    }, [initialData])

    const transformedServices = React.useMemo(() => {
        if (!initialData?.services || initialData.services.length === 0) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('Using fallback services - Supabase data not available')
            }
            return { data: fallbackDodatkiUslugi, isFallback: true }
        }

        try {
            const transformed: DodatkowaUsluga[] = initialData.services
                .filter((s: any) => s.is_active !== false)
                .map((s: any) => {
                    const rawServiceId = String(s.service_id || s.id || "")
                    return {
                        id: rawServiceId,
                        nazwa: s.name || 'Bez nazwy',
                        opis: s.description || '',
                        kategoria: s.category || 'inne',
                        cenaZaM2: s.price_per_m2 !== null && s.price_per_m2 !== undefined ? Number(s.price_per_m2) : undefined,
                        cenaZaMb: s.price_per_mb !== null && s.price_per_mb !== undefined ? Number(s.price_per_mb) : undefined,
                        cenaStala: s.price_fixed !== null && s.price_fixed !== undefined ? Number(s.price_fixed) : undefined,
                        domyslnie: Boolean(s.is_default),
                        obowiazkowy: Boolean(s.is_mandatory),
                        wCeniePosadzki: Boolean(s.is_included_in_floor_price),
                        zdjecie: getServiceImage(rawServiceId, s.image_url),
                    }
                })

            if (transformed.length === 0) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('No active services found - using fallback data')
                }
                return { data: fallbackDodatkiUslugi, isFallback: true }
            }

            return { data: transformed, isFallback: false }
        } catch (error) {
            console.error('Error transforming services:', error)
            return { data: fallbackDodatkiUslugi, isFallback: true }
        }
    }, [initialData])

    const transformedRoomTypes = React.useMemo(() => {
        if (!initialData?.roomTypes || initialData.roomTypes.length === 0) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('Using fallback room types - Supabase data not available')
            }
            return { data: fallbackRodzajePomieszczen, isFallback: true }
        }

        try {
            const transformed = initialData.roomTypes.map((room: any) => ({
                id: String(room.room_id || room.id || ''),
                nazwa: room.name || 'Bez nazwy',
                opis: room.description || '',
                ikona: room.icon || '🏠',
                dostepny: room.is_available !== false,
            }))

            if (transformed.length === 0) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('No room types found - using fallback data')
                }
                return { data: fallbackRodzajePomieszczen, isFallback: true }
            }

            return { data: transformed, isFallback: false }
        } catch (error) {
            console.error('Error transforming room types:', error)
            return { data: fallbackRodzajePomieszczen, isFallback: true }
        }
    }, [initialData])

    const transformedConcreteStates = React.useMemo(() => {
        if (!initialData?.concreteStates || initialData.concreteStates.length === 0) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('Using fallback concrete states - Supabase data not available')
            }
            return { data: fallbackStanyBetonu, isFallback: true }
        }

        try {
            const transformed = initialData.concreteStates.map((state: any) => ({
                id: String(state.state_id || state.id || ''),
                nazwa: state.name || 'Bez nazwy',
                opis: state.description || '',
                cenaDodatkowa: Number(state.additional_price) || 0,
                showPriceInLabel: Boolean(state.show_price_in_label),
            }))

            if (transformed.length === 0) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('No concrete states found - using fallback data')
                }
                return { data: fallbackStanyBetonu, isFallback: true }
            }

            return { data: transformed, isFallback: false }
        } catch (error) {
            console.error('Error transforming concrete states:', error)
            return { data: fallbackStanyBetonu, isFallback: true }
        }
    }, [initialData])

    const stepConfigVisibility = React.useMemo(() => {
        const configMap = new Map<string, any>()
        ;(initialData?.stepConfigs || []).forEach((config: any) => {
            if (config?.step_id) {
                configMap.set(config.step_id, config)
            }
        })

        const resolveVisibility = (stepId: string) => {
            const config = configMap.get(stepId)
            if (!config) return true
            if (config.can_be_hidden === false) return true
            return config.is_visible !== false
        }

        return {
            concreteState: resolveVisibility('concrete_state'),
            colors: resolveVisibility('colors'),
            services: resolveVisibility('services'),
        }
    }, [initialData])
    
    // Derive fallback status from transformed data
    const usingFallbackData =
        transformedSurfaces.isFallback ||
        transformedColors.isFallback ||
        transformedServices.isFallback ||
        transformedRoomTypes.isFallback ||
        transformedConcreteStates.isFallback

    const rodzajePomieszczen = transformedRoomTypes.data
    const stanyBetonu = transformedConcreteStates.data
    const dodatkiUslugi: DodatkowaUsluga[] = transformedServices.data
    
    const [rodzajPomieszczenia, setRodzajPomieszczenia] = useState<string>("")
    const [stanBetonu, setStanBetonu] = useState<string>("")
    const [wymiary, setWymiary] = useState({ dlugosc: "", szerokosc: "" })
    const [powierzchniaBezposrednia, setPowierzchniaBezposrednia] = useState("")
    const [trybWymiarow, setTrybWymiarow] = useState<"wymiary" | "powierzchnia">("wymiary")
    const [wybranyRodzaj, setWybranyRodzaj] = useState<string>("zywica")
    const [wybranyRodzajPowierzchni, setWybranyRodzajPowierzchni] = useState<string>("")
    const [wybranyKolor, setWybranyKolor] = useState<string>("")
    const [wybraneDodatki, setWybraneDodatki] = useState<string[]>([])
    const [obwod, setObwod] = useState("")
    const [powierzchnia, setPowierzchnia] = useState(0)
    const [kosztCalkowity, setKosztCalkowity] = useState(0)
    const [walidacjaErrors, setWalidacjaErrors] = useState<string[]>([])
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
    const [isSendingEmail, setIsSendingEmail] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [showEmailInput, setShowEmailInput] = useState(false)
    
    // Create dynamic posadzka object with loaded data
    const wybranaPosadzka = useMemo(() => ({
        id: "zywica",
        nazwa: "Posadzka żywiczna",
        rodzajePowierzchni: transformedSurfaces.data,
        kolory: transformedColors.data,
    }), [transformedSurfaces, transformedColors])
    
    const wybranyRodzajPowierzchniObj = wybranaPosadzka?.rodzajePowierzchni.find(
        (r) => r.id === wybranyRodzajPowierzchni,
    )
    const wybranyKolorObj = wybranaPosadzka?.kolory.find((k) => k.id === wybranyKolor)
    const wybraneRodzajPomieszczenieObj = rodzajePomieszczen.find((p) => p.id === rodzajPomieszczenia)
    const wybranyStanBetonuObj = stanyBetonu.find((s) => s.id === stanBetonu)

    // Initialize mandatory services on first render
    useEffect(() => {
        if (wybraneDodatki.length > 0) return
        const domyslne = dodatkiUslugi
            .filter((d) => d.obowiazkowy || d.domyslnie)
            .map((d) => d.id)
        if (domyslne.length > 0) {
            setWybraneDodatki(Array.from(new Set(domyslne)))
        }
    }, [dodatkiUslugi, wybraneDodatki.length])


    // Walidacja wymiarów
    const walidujWymiary = useCallback((dlugosc: string, szerokosc: string, powierzchniaBezp: string) => {
        const errors: string[] = []

        if (trybWymiarow === "wymiary") {
            const dlugoscNum = Number.parseFloat(dlugosc)
            const szerokoscNum = Number.parseFloat(szerokosc)

            if (dlugosc && (isNaN(dlugoscNum) || dlugoscNum < WYMIARY_LIMITS.min)) {
                errors.push(`Długość musi być większa niż ${WYMIARY_LIMITS.min}m`)
            }
            if (dlugosc && dlugoscNum > WYMIARY_LIMITS.max) {
                errors.push(`Długość nie może być większa niż ${WYMIARY_LIMITS.max}m`)
            }
            if (szerokosc && (isNaN(szerokoscNum) || szerokoscNum < WYMIARY_LIMITS.min)) {
                errors.push(`Szerokość musi być większa niż ${WYMIARY_LIMITS.min}m`)
            }
            if (szerokosc && szerokoscNum > WYMIARY_LIMITS.max) {
                errors.push(`Szerokość nie może być większa niż ${WYMIARY_LIMITS.max}m`)
            }

            const pow = dlugoscNum * szerokoscNum
            if (dlugosc && szerokosc && pow < WYMIARY_LIMITS.minPowierzchnia) {
                errors.push(`Powierzchnia musi być większa niż ${WYMIARY_LIMITS.minPowierzchnia}m²`)
            }
            if (dlugosc && szerokosc && pow > WYMIARY_LIMITS.maxPowierzchnia) {
                errors.push(`Powierzchnia nie może być większa niż ${WYMIARY_LIMITS.maxPowierzchnia}m²`)
            }
        } else {
            const powNum = Number.parseFloat(powierzchniaBezp)
            if (powierzchniaBezp && (isNaN(powNum) || powNum < WYMIARY_LIMITS.minPowierzchnia)) {
                errors.push(`Powierzchnia musi być większa niż ${WYMIARY_LIMITS.minPowierzchnia}m²`)
            }
            if (powierzchniaBezp && powNum > WYMIARY_LIMITS.maxPowierzchnia) {
                errors.push(`Powierzchnia nie może być większa niż ${WYMIARY_LIMITS.maxPowierzchnia}m²`)
            }
        }

        return errors
    }, [trybWymiarow])

    const isValidEmail = (email: string) => {
        const trimmed = email.trim()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
            return false
        }
        return !trimmed.includes("..")
    }

    // Sprawdzanie kroków
    const rodzajPomieszczeniaJestWybrany = rodzajPomieszczenia !== ""
    const shouldShowConcreteStep = rodzajPomieszczenia === "garaz-piwnica" && stepConfigVisibility.concreteState
    const shouldShowColorStep = stepConfigVisibility.colors
    const shouldShowServicesStep = stepConfigVisibility.services
    const stanBetonuJestWybrany = !shouldShowConcreteStep || stanBetonu !== ""
    const wymiarySaWypelnione =
        rodzajPomieszczeniaJestWybrany &&
        stanBetonuJestWybrany &&
        (trybWymiarow === "wymiary"
            ? wymiary.dlugosc && wymiary.szerokosc && powierzchnia > 0 && walidacjaErrors.length === 0
            : powierzchniaBezposrednia && powierzchnia > 0 && walidacjaErrors.length === 0)

    const rodzajPowierzchniJestWybrany = wybranyRodzajPowierzchni !== ""
    const kolorJestWybrany = !shouldShowColorStep || wybranyKolor !== ""
    const moznaWybracStanBetonu = rodzajPomieszczeniaJestWybrany && shouldShowConcreteStep
    const moznaWybracWymiary = rodzajPomieszczeniaJestWybrany && stanBetonuJestWybrany
    const moznaWybracRodzajPowierzchni = wymiarySaWypelnione
    const moznaWybracKolor = wymiarySaWypelnione && rodzajPowierzchniJestWybrany && shouldShowColorStep
    const moznaWybracDodatki =
        wymiarySaWypelnione && rodzajPowierzchniJestWybrany && kolorJestWybrany && shouldShowServicesStep

    const steps = React.useMemo(
        () => [
            { id: "room", title: "Typ pomieszczenia", description: "Wybierz rodzaj pomieszczenia" },
            ...(shouldShowConcreteStep
                ? [{ id: "concrete", title: "Stan betonu", description: "Wybierz stan podłoża" }]
                : []),
            { id: "dimensions", title: "Wymiary", description: "Wprowadź wymiary pomieszczenia" },
            { id: "surface", title: "Powierzchnia", description: "Wybierz rodzaj powierzchni" },
            ...(shouldShowColorStep ? [{ id: "color", title: "Kolor", description: "Wybierz kolor posadzki" }] : []),
            ...(shouldShowServicesStep ? [{ id: "services", title: "Dodatki", description: "Wybierz dodatkowe usługi" }] : []),
        ],
        [shouldShowConcreteStep, shouldShowColorStep, shouldShowServicesStep],
    )

    const stepNumberById = React.useMemo(() => {
        const map = new Map<string, number>()
        steps.forEach((step, index) => map.set(step.id, index + 1))
        return map
    }, [steps])

    const currentStep = React.useMemo(() => {
        const completion: Record<string, boolean> = {
            room: rodzajPomieszczeniaJestWybrany,
            concrete: stanBetonuJestWybrany,
            dimensions: wymiarySaWypelnione,
            surface: rodzajPowierzchniJestWybrany,
            color: kolorJestWybrany,
            services: !shouldShowServicesStep,
        }

        const firstIncompleteIndex = steps.findIndex((step) => !completion[step.id])
        return firstIncompleteIndex === -1 ? steps.length : firstIncompleteIndex + 1
    }, [
        steps,
        rodzajPomieszczeniaJestWybrany,
        stanBetonuJestWybrany,
        wymiarySaWypelnione,
        rodzajPowierzchniJestWybrany,
        kolorJestWybrany,
        shouldShowServicesStep,
    ])

    const totalSteps = steps.length

    const shouldShowPreview =
        currentStep === totalSteps &&
        powierzchnia > 0 &&
        !!wybranyRodzajPowierzchniObj &&
        !!wybranyKolorObj

    // Check if mobile sticky bar should be shown
    const shouldShowMobileStickyBar = powierzchnia > 0 && 
        !!wybranaPosadzka && 
        !!wybranyRodzajPowierzchniObj && 
        !!wybranyKolorObj && 
        kosztCalkowity > 0
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Mobile Sticky Bar Debug:', {
            shouldShow: shouldShowMobileStickyBar,
            powierzchnia,
            wybranaPosadzka: !!wybranaPosadzka,
            wybranyRodzajPowierzchniObj: !!wybranyRodzajPowierzchniObj,
            wybranyKolorObj: !!wybranyKolorObj,
            kosztCalkowity
        })
    }

    useEffect(() => {
        if (shouldShowConcreteStep || rodzajPomieszczenia !== "garaz-piwnica") return
        if (!stanBetonu && stanyBetonu.length > 0) {
            setStanBetonu(stanyBetonu[0].id)
        }
    }, [shouldShowConcreteStep, rodzajPomieszczenia, stanBetonu, stanyBetonu])

    useEffect(() => {
        if (shouldShowColorStep || !rodzajPowierzchniJestWybrany || !wymiarySaWypelnione) return
        if (!wybranyKolor && wybranaPosadzka?.kolory?.length) {
            setWybranyKolor(wybranaPosadzka.kolory[0].id)
        }
    }, [shouldShowColorStep, rodzajPowierzchniJestWybrany, wymiarySaWypelnione, wybranyKolor, wybranaPosadzka])

    useEffect(() => {
        const errors = walidujWymiary(wymiary.dlugosc, wymiary.szerokosc, powierzchniaBezposrednia)
        setWalidacjaErrors(errors)

        let pow = 0
        if (trybWymiarow === "wymiary") {
            const dlugosc = Number.parseFloat(wymiary.dlugosc) || 0
            const szerokosc = Number.parseFloat(wymiary.szerokosc) || 0
            pow = dlugosc * szerokosc
        } else {
            pow = Number.parseFloat(powierzchniaBezposrednia) || 0
        }

        if (errors.length === 0) {
            setPowierzchnia(pow)
        } else {
            setPowierzchnia(0)
        }

        if (pow > 0 && wybranaPosadzka && wybranyRodzajPowierzchniObj && wybranyKolorObj && errors.length === 0) {
            // Calculate base cost using price ranges if available
            let baseCost = 0
            
            // Check if price ranges are defined and find applicable range
            if (wybranyRodzajPowierzchniObj.price_ranges && wybranyRodzajPowierzchniObj.price_ranges.length > 0) {
                const applicableRange = wybranyRodzajPowierzchniObj.price_ranges.find(range => {
                    const minMatch = pow >= range.min_m2
                    const maxMatch = range.max_m2 === null || pow <= range.max_m2
                    return minMatch && maxMatch
                })
                
                if (applicableRange) {
                    if (applicableRange.is_flat_rate) {
                        // Flat rate pricing (ryczałt)
                        baseCost = applicableRange.price_per_m2 // Actually flat amount, not per m2
                    } else {
                        // Per m² pricing
                        baseCost = pow * applicableRange.price_per_m2
                    }
                } else {
                    // No matching range, use base price
                    baseCost = pow * wybranyRodzajPowierzchniObj.cenaZaM2
                }
            } else {
                // No price ranges defined, use base price
                baseCost = pow * wybranyRodzajPowierzchniObj.cenaZaM2
            }
            
            // Add color additional cost (always per m²)
            let koszt = baseCost + (pow * wybranyKolorObj.cenaDodatkowa)

            // Dodaj koszt za stan betonu
            if (wybranyStanBetonuObj && wybranyStanBetonuObj.cenaDodatkowa > 0) {
                koszt += pow * wybranyStanBetonuObj.cenaDodatkowa
            }

            // Dodaj koszty dodatków
            wybraneDodatki.forEach((dodatekId) => {
                const dodatek = dodatkiUslugi.find((d) => d.id === dodatekId)
                if (dodatek && !dodatek.wCeniePosadzki) {
                    if (dodatek.cenaZaM2) {
                        koszt += pow * dodatek.cenaZaM2
                    } else if (dodatek.cenaZaMb && obwod) {
                        koszt += Number.parseFloat(obwod) * dodatek.cenaZaMb
                    } else if (dodatek.cenaStala) {
                        koszt += dodatek.cenaStala
                    }
                }
            })

            setKosztCalkowity(koszt)
        } else {
            setKosztCalkowity(0)
        }
    }, [
        wymiary,
        powierzchniaBezposrednia,
        trybWymiarow,
        wybranyRodzaj,
        wybranyRodzajPowierzchni,
        wybranyKolor,
        wybraneDodatki,
        obwod,
        stanBetonu,
        wybranaPosadzka,
        wybranyRodzajPowierzchniObj,
        wybranyKolorObj,
        wybranyStanBetonuObj,
        dodatkiUslugi,
        walidujWymiary,
    ])

    const handleDodatekChange = (dodatekId: string, checked: boolean) => {
        if (!moznaWybracDodatki) return
        
        const dodatek = dodatkiUslugi.find((d) => d.id === dodatekId)
        if (dodatek?.obowiazkowy) return // Don't allow changing mandatory services

        if (checked) {
            setWybraneDodatki([...wybraneDodatki, dodatekId])
        } else {
            setWybraneDodatki(wybraneDodatki.filter((id) => id !== dodatekId))
        }
    }

    const resetKalkulator = () => {
        setRodzajPomieszczenia("")
        setStanBetonu("")
        setWymiary({ dlugosc: "", szerokosc: "" })
        setPowierzchniaBezposrednia("")
        setTrybWymiarow("wymiary")
        setWybranyRodzaj("zywica")
        setWybranyRodzajPowierzchni("")
        setWybranyKolor("")
        const domyslne = dodatkiUslugi
            .filter((d) => d.obowiazkowy || d.domyslnie)
            .map((d) => d.id)
        setWybraneDodatki(Array.from(new Set(domyslne)))
        setObwod("")
        setWalidacjaErrors([])
        setUserEmail("")
        setShowEmailInput(false)
    }

    const generujPDF = async (sendEmail = false) => {
        if (!powierzchnia || !wybranaPosadzka || !wybranyRodzajPowierzchniObj || !wybranyKolorObj) return

        if (sendEmail && !isValidEmail(userEmail)) {
            alert("Wprowadź poprawny adres email.")
            return
        }

        if (sendEmail) {
            setIsSendingEmail(true)
        } else {
            setIsGeneratingPDF(true)
        }

        // Symulacja generowania PDF
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.width
        const pageHeight = doc.internal.pageSize.height
        let yPosition = 15

        // Unikalny numer kosztorysu
        const numerKosztorysu = `PZ-${Date.now().toString().slice(-6)}`
        const dataKosztorysu = new Date().toLocaleDateString("pl-PL")

        // Logo i nazwa firmy (górny nagłówek)
        doc.setFillColor(41, 128, 185) // Niebieski pasek
        doc.rect(0, 0, pageWidth, 30, 'F')

        const logoUrl = "/posadzkizywiczne.com_logo.png"
        try {
            const logoResponse = await fetch(logoUrl)
            if (logoResponse.ok) {
                const logoBuffer = await logoResponse.arrayBuffer()
                const binaryChunks: string[] = []
                const bytes = new Uint8Array(logoBuffer)
                const chunkSize = 0x8000
                for (let i = 0; i < bytes.length; i += chunkSize) {
                    binaryChunks.push(String.fromCharCode(...bytes.slice(i, i + chunkSize)))
                }
                const logoData = `data:image/png;base64,${btoa(binaryChunks.join(""))}`
                doc.addImage(logoData, "PNG", 12, 5, 20, 20)
            }
        } catch (error) {
            console.warn(`Logo load failed for ${logoUrl}:`, error)
        }

        doc.setTextColor(255, 255, 255) // Biały tekst
        doc.setFontSize(24)
        doc.setFont("helvetica", "bold")
        doc.text("POSADZKI ZYWICZNE", pageWidth / 2, 15, { align: "center" })
        
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text("Profesjonalne posadzki żywiczne dla domu i biznesu", pageWidth / 2, 23, { align: "center" })
        doc.setFontSize(8)
        doc.text("Instagram: @posadzkizywicznecom", pageWidth - 12, 26, { align: "right" })

        yPosition = 40
        doc.setTextColor(0, 0, 0) // Czarny tekst dla reszty dokumentu

        // Numer kosztorysu i data
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text(formatTextForPDF("KOSZTORYS"), 20, yPosition)
        doc.setFont("helvetica", "normal")
        doc.text(`Nr: ${numerKosztorysu}`, 20, yPosition + 6)
        doc.text(`Data: ${dataKosztorysu}`, 20, yPosition + 12)

        yPosition += 25

        // Dane pomieszczenia
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text(formatTextForPDF("DANE POMIESZCZENIA"), 20, yPosition)
        yPosition += 10

        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")

        if (wybraneRodzajPomieszczenieObj) {
            doc.text(formatTextForPDF(`Typ pomieszczenia: ${wybraneRodzajPomieszczenieObj.nazwa}`), 20, yPosition)
            yPosition += 6
        }

        if (wybranyStanBetonuObj && shouldShowConcreteStep) {
            doc.text(formatTextForPDF(`Stan podloza: ${wybranyStanBetonuObj.nazwa}`), 20, yPosition)
            yPosition += 6
        }

        if (trybWymiarow === "wymiary") {
            doc.text(formatTextForPDF(`Dlugosc: ${wymiary.dlugosc} m`), 20, yPosition)
            yPosition += 6
            doc.text(formatTextForPDF(`Szerokosc: ${wymiary.szerokosc} m`), 20, yPosition)
            yPosition += 6
        }

        doc.text(formatTextForPDF(`Powierzchnia: ${powierzchnia.toFixed(2)} m²`), 20, yPosition)
        if (obwod) {
            yPosition += 6
            doc.text(formatTextForPDF(`Obwod: ${obwod} m`), 20, yPosition)
        }

        yPosition += 20

        // Wybrana posadzka
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text(formatTextForPDF("SPECYFIKACJA POSADZKI"), 20, yPosition)
        yPosition += 10

        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        doc.text(formatTextForPDF(`Rodzaj: ${wybranaPosadzka.nazwa}`), 20, yPosition)
        yPosition += 6
        doc.text(formatTextForPDF(`Powierzchnia: ${wybranyRodzajPowierzchniObj.nazwa}`), 20, yPosition)
        yPosition += 6
        doc.text(formatTextForPDF(`Kolor: ${wybranyKolorObj.nazwa}`), 20, yPosition)
        yPosition += 6
        doc.text(
            formatTextForPDF(`Cena podstawowa: ${wybranyRodzajPowierzchniObj.cenaZaM2.toFixed(2)} zl/m²`),
            20,
            yPosition,
        )
        if (wybranyKolorObj.cenaDodatkowa > 0) {
            yPosition += 6
            doc.text(formatTextForPDF(`Doplata za kolor: ${wybranyKolorObj.cenaDodatkowa.toFixed(2)} zl/m²`), 20, yPosition)
        }

        yPosition += 20

        // Szczegółowa kalkulacja
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text(formatTextForPDF("SZCZEGOLOWA KALKULACJA"), 20, yPosition)
        yPosition += 10

        // Tabela - nagłówki
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.text(formatTextForPDF("Pozycja"), 20, yPosition)
        doc.text(formatTextForPDF("Ilosc"), 80, yPosition)
        doc.text(formatTextForPDF("Jednostka"), 110, yPosition)
        doc.text(formatTextForPDF("Cena jedn."), 140, yPosition)
        doc.text(formatTextForPDF("Wartosc"), 170, yPosition)

        yPosition += 5
        doc.line(20, yPosition, pageWidth - 20, yPosition)
        yPosition += 8

        // Materiał podstawowy
        doc.setFont("helvetica", "normal")
        const priceRanges: PriceRange[] = Array.isArray(wybranyRodzajPowierzchniObj.price_ranges)
            ? wybranyRodzajPowierzchniObj.price_ranges
            : []
        const applicableRange = priceRanges.find((range: PriceRange) => {
            const minMatch = powierzchnia >= range.min_m2
            const maxMatch = range.max_m2 === null || powierzchnia <= range.max_m2
            return minMatch && maxMatch
        })
        const isFlatRate = Boolean(applicableRange?.is_flat_rate)
        let basePricePerM2 = wybranyRodzajPowierzchniObj.cenaZaM2
        if (!isFlatRate && applicableRange?.price_per_m2) {
            basePricePerM2 = Number(applicableRange.price_per_m2)
        }
        let flatRateAmount = 0
        if (isFlatRate && !applicableRange?.price_per_m2) {
            console.warn(
                `Flat rate range for ${wybranyRodzajPowierzchniObj.nazwa} missing price_per_m2, using default ${FLAT_RATE_AMOUNT} zl.`
            )
        }
        if (isFlatRate) {
            flatRateAmount = Number(applicableRange?.price_per_m2 ?? FLAT_RATE_AMOUNT)
        }
        const baseRowTotal = isFlatRate ? flatRateAmount : powierzchnia * basePricePerM2

        doc.text(formatTextForPDF(`${wybranaPosadzka.nazwa} - ${wybranyRodzajPowierzchniObj.nazwa}${isFlatRate ? " (ryczałt)" : ""}`), 20, yPosition)
        doc.text(isFlatRate ? "1" : powierzchnia.toFixed(2), 80, yPosition)
        doc.text(isFlatRate ? "ryczałt" : "m²", 110, yPosition)
        doc.text(`${(isFlatRate ? flatRateAmount : basePricePerM2).toFixed(2)} zl`, 140, yPosition)
        doc.text(`${baseRowTotal.toFixed(2)} zl`, 170, yPosition)
        yPosition += 8

        if (wybranyKolorObj.cenaDodatkowa > 0) {
            const colorTotal = powierzchnia * wybranyKolorObj.cenaDodatkowa
            doc.text(formatTextForPDF(`Dopłata za kolor (${wybranyKolorObj.kodRAL})`), 20, yPosition)
            doc.text(powierzchnia.toFixed(2), 80, yPosition)
            doc.text("m²", 110, yPosition)
            doc.text(`${wybranyKolorObj.cenaDodatkowa.toFixed(2)} zl`, 140, yPosition)
            doc.text(`${colorTotal.toFixed(2)} zl`, 170, yPosition)
            yPosition += 8
        }

        // Stan betonu (jeśli dotyczy)
        if (wybranyStanBetonuObj && wybranyStanBetonuObj.cenaDodatkowa > 0) {
            doc.text(formatTextForPDF(`Przygotowanie podloza: ${wybranyStanBetonuObj.nazwa}`), 20, yPosition)
            doc.text(powierzchnia.toFixed(2), 80, yPosition)
            doc.text("m²", 110, yPosition)
            doc.text(`${wybranyStanBetonuObj.cenaDodatkowa.toFixed(2)} zl`, 140, yPosition)
            doc.text(`${(powierzchnia * wybranyStanBetonuObj.cenaDodatkowa).toFixed(2)} zl`, 170, yPosition)
            yPosition += 8
        }

        // Dodatkowe usługi
        wybraneDodatki.forEach((dodatekId) => {
            const dodatek = dodatkiUslugi.find((d) => d.id === dodatekId)
            if (!dodatek) return

            let ilosc = 0
            let jednostka = ""
            let cenaJedn = 0
            let wartosc = 0

            if (dodatek.wCeniePosadzki) {
                // Service included in floor price
                doc.text(formatTextForPDF(dodatek.nazwa), 20, yPosition)
                doc.text("-", 80, yPosition)
                doc.text("-", 110, yPosition)
                doc.text("w cenie posadzki", 140, yPosition)
                doc.text("0.00 zl", 170, yPosition)
            } else if (dodatek.cenaZaM2) {
                ilosc = powierzchnia
                jednostka = "m²"
                cenaJedn = dodatek.cenaZaM2
                wartosc = powierzchnia * dodatek.cenaZaM2
                
                doc.text(formatTextForPDF(dodatek.nazwa), 20, yPosition)
                doc.text(ilosc.toFixed(2), 80, yPosition)
                doc.text(jednostka, 110, yPosition)
                doc.text(`${cenaJedn.toFixed(2)} zl`, 140, yPosition)
                doc.text(`${wartosc.toFixed(2)} zl`, 170, yPosition)
            } else if (dodatek.cenaZaMb && obwod) {
                ilosc = Number.parseFloat(obwod)
                jednostka = "mb"
                cenaJedn = dodatek.cenaZaMb
                wartosc = ilosc * dodatek.cenaZaMb
                
                doc.text(formatTextForPDF(dodatek.nazwa), 20, yPosition)
                doc.text(ilosc.toFixed(2), 80, yPosition)
                doc.text(jednostka, 110, yPosition)
                doc.text(`${cenaJedn.toFixed(2)} zl`, 140, yPosition)
                doc.text(`${wartosc.toFixed(2)} zl`, 170, yPosition)
            } else if (dodatek.cenaStala) {
                ilosc = 1
                jednostka = "kpl"
                cenaJedn = dodatek.cenaStala
                wartosc = dodatek.cenaStala
                
                doc.text(formatTextForPDF(dodatek.nazwa), 20, yPosition)
                doc.text(ilosc.toFixed(2), 80, yPosition)
                doc.text(jednostka, 110, yPosition)
                doc.text(`${cenaJedn.toFixed(2)} zl`, 140, yPosition)
                doc.text(`${wartosc.toFixed(2)} zl`, 170, yPosition)
            }
            yPosition += 8
        })

        // Linia podsumowania
        yPosition += 5
        doc.line(20, yPosition, pageWidth - 20, yPosition)
        yPosition += 10

        // Podsumowanie
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text(formatTextForPDF("PODSUMOWANIE"), 20, yPosition)
        yPosition += 10

        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        doc.text(formatTextForPDF(`Koszt całkowity: ${kosztCalkowity.toFixed(2)} zl`), 20, yPosition)
        yPosition += 6
        doc.text(formatTextForPDF(`Koszt za m²: ${(kosztCalkowity / powierzchnia).toFixed(2)} zl/m²`), 20, yPosition)
        yPosition += 6
        if (isFlatRate) {
            doc.text(
                formatTextForPDF(
                    `Dla powierzchni do ${FLAT_RATE_LIMIT_M2} m² obowiązuje cena ryczałtowa ${flatRateAmount.toFixed(2)} zł.`
                ),
                20,
                yPosition,
            )
        }

        yPosition += 20

        // Firma i kontakt w kolorowym footer
        if (yPosition > pageHeight - 60) {
            doc.addPage()
            yPosition = 20
        }

        // Footer z informacjami o firmie
        const footerY = pageHeight - 55
        
        doc.setFillColor(245, 245, 245) // Szare tło
        doc.rect(0, footerY - 5, pageWidth, 55, 'F')
        
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(41, 128, 185)
        doc.text(formatTextForPDF("O FIRMIE"), 20, footerY + 5)
        
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(50, 50, 50)
        doc.text(formatTextForPDF("Posadzki Zywiczne - Profesjonalne posadzki epoksydowe"), 20, footerY + 12)
        doc.text(formatTextForPDF("Specjalizujemy sie w wykonywaniu posadzek zywicznych"), 20, footerY + 17)
        doc.text(formatTextForPDF("dla garaży, piwnicy domow i przestrzeni komercyjnych."), 20, footerY + 22)
        
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(41, 128, 185)
        doc.text(formatTextForPDF("KONTAKT"), 20, footerY + 32)
        
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(50, 50, 50)
        doc.text(formatTextForPDF("Web: posadzkizywiczne.com"), 20, footerY + 38)
        doc.text(formatTextForPDF("Instagram: @posadzkizywicznecom"), 20, footerY + 43)
        
        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(41, 128, 185)
        doc.text(formatTextForPDF("REALIZACJE"), 120, footerY + 32)
        
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(50, 50, 50)
        doc.text(formatTextForPDF("Zobacz nasze realizacje na:"), 120, footerY + 38)
        doc.text(formatTextForPDF("posadzkizywiczne.com/realizacje"), 120, footerY + 43)

        // Stopka z disclaimerem
        doc.setFontSize(8)
        doc.setFont("helvetica", "italic")
        doc.setTextColor(100, 100, 100)
        doc.text(
            formatTextForPDF("Oferta nie jest umową. Wymagamy kontaktu w celu potwierdzenia ostatecznej ceny."),
            pageWidth / 2,
            pageHeight - 14,
            { align: "center" },
        )
        doc.text(
            formatTextForPDF("Kosztorys wygenerowany automatycznie. Ceny mogą ulec zmianie."),
            pageWidth / 2,
            pageHeight - 8,
            { align: "center" },
        )

        if (sendEmail && userEmail) {
            // Wyślij email z PDF
            try {
                const pdfData = doc.output("datauristring")

                const kosztorysData = {
                    numer: numerKosztorysu,
                    data: dataKosztorysu,
                    powierzchnia: powierzchnia.toFixed(2),
                    rodzajPowierzchni: wybranyRodzajPowierzchniObj.nazwa,
                    kolor: wybranyKolorObj.nazwa,
                    kosztCalkowity: kosztCalkowity.toFixed(2),
                }

                const response = await fetch("/api/send-pdf", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        pdfData,
                        kosztorysData,
                    }),
                })

                const result = await response.json()

                if (result.success) {
                    // Uruchom konfetti po wysłaniu emaila
                    triggerConfetti()
                    setShowEmailInput(false)
                    setUserEmail("")
                } else {
                    const errorMsg = result.message || "Błąd wysyłania emaila. Spróbuj ponownie."
                    console.error("Email send failed:", errorMsg)
                    alert(`Błąd wysyłania emaila: ${errorMsg}`)
                }
            } catch (error) {
                console.error("Błąd wysyłania emaila:", error)
                const errorMsg = error instanceof Error ? error.message : "Nieznany błąd"
                alert(`Błąd wysyłania emaila: ${errorMsg}. Sprawdź połączenie z internetem i spróbuj ponownie.`)
            }
        } else {
            // Zapisz PDF lokalnie
            doc.save(`kosztorys-posadzka-zywiczna-${numerKosztorysu}.pdf`)
            // Uruchom konfetti!
            triggerConfetti()
        }

        setIsGeneratingPDF(false)
        setIsSendingEmail(false)
    }

    // Grupowanie dodatków według kategorii
    const dodatkiPodleKategorii = (Array.isArray(dodatkiUslugi) ? dodatkiUslugi : []).reduce(
        (acc, dodatek) => {
            const kategoria = dodatek.kategoria || "inne"
            if (!acc[kategoria]) {
                acc[kategoria] = []
            }
            acc[kategoria].push(dodatek)
            return acc
        },
        {} as Record<string, DodatkowaUsluga[]>,
    )

    const kategorieNazwy = {
        przygotowanie: "Przygotowanie podłoża",
        wykończenie: "Wykończenie",
        ochrona: "Warstwy ochronne",
        logistyka: "Transport i logistyka",
        inne: "Pozostałe usługi",
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Nagłówek */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 sm:gap-3">
                            <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                            <span className="hidden sm:inline">Kalkulator Posadzki Żywicznej</span>
                            <span className="sm:hidden">Kalkulator Posadzki</span>
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-2">
                            Oblicz koszt posadzki żywicznej dla swojego pomieszczenia
                        </p>
                    </div>
                </div>
            </div>

            {/* Pasek postępu */}
            <ProgressBar currentStep={currentStep} steps={steps} />

            {/* Info message if using fallback data */}
            {usingFallbackData && (
                <div className="bg-blue-50 border-b border-blue-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                        <Alert className="bg-blue-100 border-blue-300">
                            <AlertDescription className="text-blue-800 text-sm">
                                <strong>Informacja:</strong> Kalkulator korzysta z domyślnych danych. 
                                Wszystkie funkcje działają poprawnie.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            )}

            {/* Main content with extra bottom padding on mobile for sticky bottom bar (128px to accommodate bar height) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-32 lg:pb-8">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 min-h-[600px]">
                    {/* Panel opcji - pełna szerokość */}
                    <div className="lg:col-span-12 space-y-4 lg:space-y-6">
                        {/* Krok 1: Typ pomieszczenia */}
                        <div
                            className={`
                transition-all duration-500 ease-in-out transform
                ${!rodzajPomieszczeniaJestWybrany ? "scale-105" : "scale-100"}
              `}
                        >
                            <Card
                                className={`
                  transition-all duration-500 ease-in-out
                  ${!rodzajPomieszczeniaJestWybrany
                                        ? "ring-2 ring-blue-500 shadow-lg bg-blue-50/50 border-blue-200"
                                        : "bg-white shadow-md border-green-200"
                                    }
                `}
                            >
                                <CardHeader className="pb-3 sm:pb-4">
                                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                                        <div
                                            className={`
                        transition-all duration-300 ease-in-out
                        ${rodzajPomieszczeniaJestWybrany ? "text-green-500 scale-110" : "text-blue-600"}
                      `}
                                        >
                                            {rodzajPomieszczeniaJestWybrany ? <CheckCircle className="h-6 w-6" /> : <Home className="h-6 w-6" />}
                                        </div>
                                        <span className={rodzajPomieszczeniaJestWybrany ? "text-green-700" : "text-blue-700"}>
                                            Krok {stepNumberById.get("room") ?? 1}: Typ pomieszczenia
                                        </span>
                                    </CardTitle>
                                    {!rodzajPomieszczeniaJestWybrany && (
                                        <CardDescription className="text-blue-600 font-medium animate-pulse">
                                            Rozpocznij od wyboru typu pomieszczenia
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {(Array.isArray(rodzajePomieszczen) ? rodzajePomieszczen : []).map((pomieszczenie, index) => (
                                        <div
                                            key={pomieszczenie.id}
                                            className={`
                                border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-300 ease-in-out
                                animate-in slide-in-from-left-2
                                ${rodzajPomieszczenia === pomieszczenie.id
                                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 scale-105"
                                                    : pomieszczenie.dostepny
                                                        ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-102"
                                                        : "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                                                }
                              `}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                            onClick={() => pomieszczenie.dostepny && setRodzajPomieszczenia(pomieszczenie.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="text-3xl">{pomieszczenie.ikona}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium text-sm">{pomieszczenie.nazwa}</h3>
                                                        <div
                                                            className={`
                                        w-4 h-4 rounded-full border-2 transition-all duration-300
                                        ${rodzajPomieszczenia === pomieszczenie.id
                                                                    ? "border-blue-500 bg-blue-500 scale-125"
                                                                    : "border-gray-300"
                                                                }
                                      `}
                                                        >
                                                            {rodzajPomieszczenia === pomieszczenie.id && (
                                                                <div className="w-full h-full rounded-full bg-white scale-50 animate-in zoom-in-50 duration-200"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">{pomieszczenie.opis}</p>
                                                    {!pomieszczenie.dostepny && (
                                                        <p className="text-xs text-red-600 mt-1 font-medium">Tymczasowo niedostępne</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Krok 2: Stan betonu (tylko dla garaż/piwnica) */}
                        {shouldShowConcreteStep && (
                            <div
                                className={`
                    transition-all duration-700 ease-in-out transform
                    ${!moznaWybracStanBetonu ? "opacity-50 scale-95" : stanBetonuJestWybrany ? "scale-100" : "scale-105"}
                  `}
                            >
                                <Card
                                    className={`
                      transition-all duration-500 ease-in-out
                      ${!moznaWybracStanBetonu
                                            ? "pointer-events-none bg-gray-50 border-gray-200"
                                            : stanBetonuJestWybrany
                                                ? "bg-white shadow-md border-green-200"
                                                : "ring-2 ring-blue-500 shadow-lg bg-blue-50/50 border-blue-200"
                                        }
                    `}
                                >
                                    <CardHeader className="pb-3 sm:pb-4">
                                        <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                                            <div
                                                className={`
                            transition-all duration-300 ease-in-out
                            ${stanBetonuJestWybrany
                                                        ? "text-green-500 scale-110"
                                                        : moznaWybracStanBetonu
                                                            ? "text-blue-600"
                                                            : "text-gray-400"
                                                    }
                          `}
                                            >
                                                {stanBetonuJestWybrany ? <CheckCircle className="h-6 w-6" /> : <Layers className="h-6 w-6" />}
                                            </div>
                                            <span
                                                className={
                                                    stanBetonuJestWybrany
                                                        ? "text-green-700"
                                                        : moznaWybracStanBetonu
                                                            ? "text-blue-700"
                                                            : "text-gray-400"
                                                }
                                            >
                                                Krok {stepNumberById.get("concrete") ?? 2}: Stan podłoża
                                            </span>
                                        </CardTitle>
                                        {moznaWybracStanBetonu && !stanBetonuJestWybrany && (
                                            <CardDescription className="text-blue-600 font-medium animate-pulse">
                                                Wybierz obecny stan betonu
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {(Array.isArray(stanyBetonu) ? stanyBetonu : []).map((stan, index) => (
                                            <div
                                                key={stan.id}
                                                className={`
                                    border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-300 ease-in-out
                                    animate-in slide-in-from-left-2
                                    ${stanBetonu === stan.id
                                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 scale-105"
                                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-102"
                                                    }
                                    ${!moznaWybracStanBetonu ? "cursor-not-allowed opacity-50" : ""}
                                  `}
                                                style={{ animationDelay: `${index * 100}ms` }}
                                                onClick={() => moznaWybracStanBetonu && setStanBetonu(stan.id)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-sm">{stan.nazwa}</h3>
                                                        <p className="text-xs text-gray-600 mt-1">{stan.opis}</p>
                                                        {(stan.cenaDodatkowa > 0 || stan.showPriceInLabel) && (
                                                            <p className="text-sm font-bold text-orange-600 mt-2">
                                                                {stan.cenaDodatkowa > 0 ? `+${stan.cenaDodatkowa} zł/m²` : "Bez dopłaty"}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={`
                                        w-4 h-4 rounded-full border-2 transition-all duration-300 flex-shrink-0 ml-3
                                        ${stanBetonu === stan.id
                                                            ? "border-blue-500 bg-blue-500 scale-125"
                                                            : "border-gray-300"
                                                        }
                                      `}
                                                    >
                                                        {stanBetonu === stan.id && (
                                                            <div className="w-full h-full rounded-full bg-white scale-50 animate-in zoom-in-50 duration-200"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Krok: Wymiary pomieszczenia */}
                        <div
                            className={`
                transition-all duration-500 ease-in-out transform
                ${!moznaWybracWymiary ? "opacity-50 scale-95" : !wymiarySaWypelnione ? "scale-105" : "scale-100"}
              `}
                        >
                            <Card
                                className={`
                  transition-all duration-500 ease-in-out
                  ${!moznaWybracWymiary
                                        ? "pointer-events-none bg-gray-50 border-gray-200"
                                        : !wymiarySaWypelnione
                                            ? "ring-2 ring-blue-500 shadow-lg bg-blue-50/50 border-blue-200"
                                            : "bg-white shadow-md border-green-200"
                                    }
                `}
                            >
                                <CardHeader className="pb-3 sm:pb-4">
                                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                                        <div
                                            className={`
                        transition-all duration-300 ease-in-out
                        ${wymiarySaWypelnione ? "text-green-500 scale-110" : moznaWybracWymiary ? "text-blue-600" : "text-gray-400"}
                      `}
                                        >
                                            {wymiarySaWypelnione ? <CheckCircle className="h-6 w-6" /> : <Home className="h-6 w-6" />}
                                        </div>
                                        <span className={wymiarySaWypelnione ? "text-green-700" : moznaWybracWymiary ? "text-blue-700" : "text-gray-400"}>
                                            Krok {stepNumberById.get("dimensions") ?? 2}: Wymiary pomieszczenia
                                        </span>
                                    </CardTitle>
                                    {!moznaWybracWymiary && (
                                        <CardDescription className="text-gray-500">
                                            Najpierw wybierz typ pomieszczenia{shouldShowConcreteStep && " i stan podłoża"}
                                        </CardDescription>
                                    )}
                                    {moznaWybracWymiary && !wymiarySaWypelnione && (
                                        <CardDescription className="text-blue-600 font-medium animate-pulse">
                                            Wprowadź wymiary pomieszczenia
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Toggle trybu wprowadzania */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                        <div className="flex items-center gap-2">
                                            <ToggleLeft
                                                className={`h-5 w-5 ${trybWymiarow === "wymiary" ? "text-blue-600" : "text-gray-400"}`}
                                            />
                                            <span className="text-sm font-medium">Sposób wprowadzania:</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`text-sm ${trybWymiarow === "wymiary" ? "font-medium text-blue-600" : "text-gray-500"}`}
                                            >
                                                Wymiary
                                            </span>
                                            <Switch
                                                checked={trybWymiarow === "powierzchnia"}
                                                onCheckedChange={(checked) => {
                                                    setTrybWymiarow(checked ? "powierzchnia" : "wymiary")
                                                    setWalidacjaErrors([])
                                                }}
                                            />
                                            <span
                                                className={`text-sm ${trybWymiarow === "powierzchnia" ? "font-medium text-blue-600" : "text-gray-500"}`}
                                            >
                                                m²
                                            </span>
                                            <ToggleRight
                                                className={`h-5 w-5 ${trybWymiarow === "powierzchnia" ? "text-blue-600" : "text-gray-400"}`}
                                            />
                                        </div>
                                    </div>

                                    {trybWymiarow === "wymiary" ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <HelpTooltip content="Wprowadź długość pomieszczenia w metrach. Minimalna wartość: 1m, maksymalna: 50m">
                                                    <Label htmlFor="dlugosc" className="font-medium">
                                                        Długość (m)
                                                    </Label>
                                                </HelpTooltip>
                                                <Input
                                                    id="dlugosc"
                                                    type="number"
                                                    step="0.1"
                                                    min={WYMIARY_LIMITS.min}
                                                    max={WYMIARY_LIMITS.max}
                                                    placeholder="np. 5.5"
                                                    value={wymiary.dlugosc}
                                                    onChange={(e) => setWymiary({ ...wymiary, dlugosc: e.target.value })}
                                                    className={`mt-1 transition-all duration-300 ${walidacjaErrors.some((e) => e.includes("Długość")) ? "border-red-500 ring-red-200" : ""
                                                        }`}
                                                />
                                            </div>
                                            <div>
                                                <HelpTooltip content="Wprowadź szerokość pomieszczenia w metrach. Minimalna wartość: 1m, maksymalna: 50m">
                                                    <Label htmlFor="szerokosc" className="font-medium">
                                                        Szerokość (m)
                                                    </Label>
                                                </HelpTooltip>
                                                <Input
                                                    id="szerokosc"
                                                    type="number"
                                                    step="0.1"
                                                    min={WYMIARY_LIMITS.min}
                                                    max={WYMIARY_LIMITS.max}
                                                    placeholder="np. 4.2"
                                                    value={wymiary.szerokosc}
                                                    onChange={(e) => setWymiary({ ...wymiary, szerokosc: e.target.value })}
                                                    className={`mt-1 transition-all duration-300 ${walidacjaErrors.some((e) => e.includes("Szerokość")) ? "border-red-500 ring-red-200" : ""
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <HelpTooltip content="Wprowadź powierzchnię pomieszczenia w metrach kwadratowych. Minimalna wartość: 1m², maksymalna: 2500m²">
                                                <Label htmlFor="powierzchnia" className="font-medium">
                                                    Powierzchnia (m²)
                                                </Label>
                                            </HelpTooltip>
                                            <Input
                                                id="powierzchnia"
                                                type="number"
                                                step="0.1"
                                                min={WYMIARY_LIMITS.minPowierzchnia}
                                                max={WYMIARY_LIMITS.maxPowierzchnia}
                                                placeholder="np. 23.1"
                                                value={powierzchniaBezposrednia}
                                                onChange={(e) => setPowierzchniaBezposrednia(e.target.value)}
                                                className={`mt-1 transition-all duration-300 ${walidacjaErrors.some((e) => e.includes("Powierzchnia")) ? "border-red-500 ring-red-200" : ""
                                                    }`}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <HelpTooltip content="Obwód pomieszczenia potrzebny do kalkulacji listew, cokołów i uszczelnień. Jeśli nie znasz, możesz obliczyć: 2 × (długość + szerokość)">
                                            <Label htmlFor="obwod" className="font-medium">
                                                Obwód pomieszczenia (m)
                                            </Label>
                                        </HelpTooltip>
                                        <Input
                                            id="obwod"
                                            type="number"
                                            step="0.1"
                                            placeholder="np. 19.4"
                                            value={obwod}
                                            onChange={(e) => setObwod(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Błędy walidacji */}
                                    {walidacjaErrors.length > 0 && (
                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                            <Alert variant="destructive">
                                                <AlertTriangle className="h-4 w-4" />
                                                <AlertDescription>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {walidacjaErrors.map((error, index) => (
                                                            <li key={index} className="text-sm">
                                                                {error}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    )}

                                    {/* Powierzchnia */}
                                    {powierzchnia > 0 && walidacjaErrors.length === 0 && (
                                        <div className="animate-in slide-in-from-bottom-2 duration-500">
                                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                <p className="text-sm font-semibold text-green-800">
                                                    Powierzchnia: <span className="text-green-600 text-lg">{powierzchnia.toFixed(2)} m²</span>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Pozostałe kroki pozostają bez zmian... */}
                        {/* Krok: Rodzaj powierzchni */}
                        <div
                            className={`
                transition-all duration-700 ease-in-out transform
                ${!moznaWybracRodzajPowierzchni ? "opacity-50 scale-95" : rodzajPowierzchniJestWybrany ? "scale-100" : "scale-105"}
              `}
                        >
                            <Card
                                className={`
                  transition-all duration-500 ease-in-out
                  ${!moznaWybracRodzajPowierzchni
                                        ? "pointer-events-none bg-gray-50 border-gray-200"
                                        : rodzajPowierzchniJestWybrany
                                            ? "bg-white shadow-md border-green-200"
                                            : "ring-2 ring-blue-500 shadow-lg bg-blue-50/50 border-blue-200"
                                    }
                `}
                            >
                                <CardHeader className="pb-3 sm:pb-4">
                                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                                        <div
                                            className={`
                        transition-all duration-300 ease-in-out
                        ${rodzajPowierzchniJestWybrany
                                                    ? "text-green-500 scale-110"
                                                    : moznaWybracRodzajPowierzchni
                                                        ? "text-blue-600"
                                                        : "text-gray-400"
                                                }
                      `}
                                        >
                                            {rodzajPowierzchniJestWybrany ? (
                                                <CheckCircle className="h-6 w-6" />
                                            ) : (
                                                <Layers className="h-6 w-6" />
                                            )}
                                        </div>
                                        <span
                                            className={
                                                rodzajPowierzchniJestWybrany
                                                    ? "text-green-700"
                                                    : moznaWybracRodzajPowierzchni
                                                        ? "text-blue-700"
                                                        : "text-gray-400"
                                            }
                                        >
                                            Krok {stepNumberById.get("surface") ?? 3}: Rodzaj powierzchni
                                        </span>
                                    </CardTitle>
                                    {!moznaWybracRodzajPowierzchni && (
                                        <CardDescription className="text-gray-500">
                                            Najpierw wprowadź poprawne wymiary pomieszczenia
                                        </CardDescription>
                                    )}
                                    {moznaWybracRodzajPowierzchni && !rodzajPowierzchniJestWybrany && (
                                        <CardDescription className="text-blue-600 font-medium animate-pulse">
                                            Wybierz rodzaj powierzchni posadzki
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        {(Array.isArray(transformedSurfaces.data) ? transformedSurfaces.data : []).map((rodzaj, index) => (
                                            <TooltipProvider key={rodzaj.id}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={`
                                border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-300 ease-in-out
                                animate-in slide-in-from-left-2
                                ${wybranyRodzajPowierzchni === rodzaj.id
                                                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 scale-105"
                                                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-102"
                                                                }
                                ${!moznaWybracRodzajPowierzchni ? "cursor-not-allowed opacity-50" : ""}
                              `}
                                                            style={{ animationDelay: `${index * 100}ms` }}
                                                            onClick={() => moznaWybracRodzajPowierzchni && setWybranyRodzajPowierzchni(rodzaj.id)}
                                                        >
                                                            <div className="flex flex-col sm:flex-row items-start sm:items-start gap-3">
                                                                <div className="relative w-full h-32 sm:w-16 sm:h-16 rounded border overflow-hidden flex-shrink-0">
                                                                    <Image
                                                                        src={rodzaj.zdjecie || PLACEHOLDER_IMAGE}
                                                                        alt={rodzaj.nazwa}
                                                                        fill
                                                                        className="object-cover transition-transform duration-300 hover:scale-110"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0 w-full">
                                                                    <h3 className="font-medium text-sm mb-1">{rodzaj.nazwa}</h3>
                                                                    <p className="text-xs text-gray-600 mb-2">{rodzaj.opis}</p>
                                                                    <div className="flex items-center justify-end">
                                                                        <div
                                                                            className={`
                                        w-4 h-4 rounded-full border-2 transition-all duration-300
                                        ${wybranyRodzajPowierzchni === rodzaj.id
                                                                                    ? "border-blue-500 bg-blue-500 scale-125"
                                                                                    : "border-gray-300"
                                                                                }
                                      `}
                                                                        >
                                                                            {wybranyRodzajPowierzchni === rodzaj.id && (
                                                                                <div className="w-full h-full rounded-full bg-white scale-50 animate-in zoom-in-50 duration-200"></div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" className="max-w-xs">
                                                        <p className="text-sm font-medium mb-2">{rodzaj.nazwa}</p>
                                                        <p className="text-xs text-gray-600 mb-2">{rodzaj.opis}</p>
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-medium">Właściwości:</p>
                                                            <ul className="text-xs text-gray-600 space-y-1">
                                                                {(rodzaj.wlasciwosci || []).map((wlasciwosc, idx) => (
                                                                    <li key={idx} className="flex items-center gap-1">
                                                                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                                                        {wlasciwosc}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Krok: Wybór koloru */}
                        {shouldShowColorStep && (
                            <div
                                className={`
                transition-all duration-700 ease-in-out transform
                ${!moznaWybracKolor ? "opacity-50 scale-95" : kolorJestWybrany ? "scale-100" : "scale-105"}
              `}
                            >
                                <Card
                                    className={`
                  transition-all duration-500 ease-in-out
                  ${!moznaWybracKolor
                                            ? "pointer-events-none bg-gray-50 border-gray-200"
                                            : kolorJestWybrany
                                                ? "bg-white shadow-md border-green-200"
                                                : "ring-2 ring-blue-500 shadow-lg bg-blue-50/50 border-blue-200"
                                        }
                `}
                                >
                                    <CardHeader className="pb-3 sm:pb-4">
                                        <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                                            <div
                                                className={`
                        transition-all duration-300 ease-in-out
                        ${kolorJestWybrany
                                                        ? "text-green-500 scale-110"
                                                        : moznaWybracKolor
                                                            ? "text-blue-600"
                                                            : "text-gray-400"
                                                    }
                      `}
                                            >
                                                {kolorJestWybrany ? <CheckCircle className="h-6 w-6" /> : <Palette className="h-6 w-6" />}
                                            </div>
                                            <span
                                                className={
                                                    kolorJestWybrany ? "text-green-700" : moznaWybracKolor ? "text-blue-700" : "text-gray-400"
                                                }
                                            >
                                                Krok {stepNumberById.get("color") ?? 4}: Wybór koloru RAL
                                            </span>
                                        </CardTitle>
                                        {!moznaWybracKolor && (
                                            <CardDescription className="text-gray-500">
                                                Najpierw wybierz wymiary i rodzaj powierzchni
                                            </CardDescription>
                                        )}
                                        {moznaWybracKolor && !kolorJestWybrany && (
                                            <CardDescription className="text-blue-600 font-medium animate-pulse">
                                                Wybierz kolor posadzki żywicznej
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            {(Array.isArray(wybranaPosadzka?.kolory) ? wybranaPosadzka.kolory : []).map((kolor, index) => (
                                                <TooltipProvider key={kolor.id}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                className={`
                                border rounded-lg p-3 cursor-pointer transition-all duration-300 ease-in-out
                                animate-in slide-in-from-left-2
                                ${wybranyKolor === kolor.id
                                                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 scale-105"
                                                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-102"
                                                                    }
                                ${!moznaWybracKolor ? "cursor-not-allowed opacity-50" : ""}
                              `}
                                                                style={{ animationDelay: `${index * 100}ms` }}
                                                                onClick={() => moznaWybracKolor && setWybranyKolor(kolor.id)}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative w-12 h-12 rounded border overflow-hidden flex-shrink-0">
                                                                        <Image
                                                                            src={kolor.zdjecie || PLACEHOLDER_IMAGE}
                                                                            alt={kolor.nazwa}
                                                                            fill
                                                                            className="object-cover transition-transform duration-300 hover:scale-110"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="font-medium text-sm truncate">{kolor.nazwa}</h3>
                                                                        <p className="text-xs text-gray-600">{kolor.kodRAL}</p>
                                                                        <p className="text-xs font-medium text-green-600">
                                                                            {kolor.cenaDodatkowa > 0 ? `+${kolor.cenaDodatkowa} zł/m²` : "Bez dopłaty"}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex-shrink-0">
                                                                        <div
                                                                            className={`
                                      w-4 h-4 rounded-full border-2 transition-all duration-300
                                      ${wybranyKolor === kolor.id
                                                                                    ? "border-blue-500 bg-blue-500 scale-125"
                                                                                    : "border-gray-300"
                                                                                }
                                    `}
                                                                        >
                                                                            {wybranyKolor === kolor.id && (
                                                                                <div className="w-full h-full rounded-full bg-white scale-50 animate-in zoom-in-50 duration-200"></div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right" className="max-w-xs">
                                                            <p className="text-sm font-medium">{kolor.nazwa}</p>
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                {kolor.cenaDodatkowa > 0
                                                                    ? `Wykończenie z posypką zwiększającą antypoślizgowość. Dopłata: ${kolor.cenaDodatkowa} zł/m²`
                                                                    : "Standardowe wykończenie gładkie w kolorze RAL"}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Krok: Dodatkowe usługi */}
                        {shouldShowServicesStep && (
                            <div
                                className={`
                transition-all duration-700 ease-in-out transform
                ${!moznaWybracDodatki ? "opacity-50 scale-95" : "scale-100"}
              `}
                            >
                                <Card
                                    className={`
                  transition-all duration-500 ease-in-out
                  ${!moznaWybracDodatki ? "pointer-events-none bg-gray-50 border-gray-200" : "bg-white shadow-md"}
                `}
                                >
                                    <CardHeader className="pb-3 sm:pb-4">
                                        <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                                            <Wrench
                                                className={`h-6 w-6 transition-colors duration-300 ${moznaWybracDodatki ? "text-blue-600" : "text-gray-400"
                                                    }`}
                                            />
                                            <span className={moznaWybracDodatki ? "text-blue-700" : "text-gray-400"}>
                                                Krok {stepNumberById.get("services") ?? 5}: Dodatkowe usługi
                                            </span>
                                        </CardTitle>
                                        {!moznaWybracDodatki && (
                                            <CardDescription className="text-gray-500">
                                                Najpierw wybierz wymiary, rodzaj powierzchni
                                                {shouldShowColorStep ? " i kolor" : ""}
                                            </CardDescription>
                                        )}
                                        {moznaWybracDodatki && (
                                            <CardDescription className="text-blue-600 font-medium">
                                                Wybierz dodatkowe usługi (opcjonalne)
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {Object.entries(dodatkiPodleKategorii).map(([kategoria, dodatki]) => (
                                            <div key={kategoria} className="space-y-3">
                                                <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">
                                                    {kategorieNazwy[kategoria as keyof typeof kategorieNazwy] || kategoria}
                                                </h4>
                                                <div className="space-y-2">
                                                    {dodatki.map((dodatek, index) => (
                                                        <TooltipProvider key={dodatek.id}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div
                                                                        className={`
                                    flex flex-col sm:flex-row sm:items-start gap-3 p-3 rounded-lg border transition-all duration-300
                                    animate-in slide-in-from-right-2
                                    ${dodatek.obowiazkowy ? "bg-blue-50 border-blue-200" : "border-gray-200"}
                                    ${moznaWybracDodatki ? "hover:bg-gray-50" : ""}
                                  `}
                                                                        style={{ animationDelay: `${index * 50}ms` }}
                                                                    >
                                                                        {dodatek.zdjecie && (
                                                                            <div className="relative w-16 h-16 rounded border overflow-hidden flex-shrink-0">
                                                                                <Image
                                                                                    src={dodatek.zdjecie || PLACEHOLDER_IMAGE}
                                                                                    alt={dodatek.nazwa}
                                                                                    fill
                                                                                    className="object-cover"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-start justify-between gap-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Checkbox
                                                                                        id={dodatek.id}
                                                                                        checked={wybraneDodatki.includes(dodatek.id)}
                                                                                        onCheckedChange={(checked) => handleDodatekChange(dodatek.id, checked as boolean)}
                                                                                        disabled={!moznaWybracDodatki || dodatek.obowiazkowy}
                                                                                        className="transition-all duration-200"
                                                                                    />
                                                                                    <Label
                                                                                        htmlFor={dodatek.id}
                                                                                        className={`text-sm font-medium transition-colors duration-300 ${!moznaWybracDodatki ? "text-gray-400" : dodatek.obowiazkowy ? "text-blue-700" : "cursor-pointer"
                                                                                            }`}
                                                                                    >
                                                                                        {dodatek.nazwa}
                                                                                        {dodatek.obowiazkowy && (
                                                                                            <span className="ml-2 text-xs text-blue-600 font-semibold">(Obowiązkowe)</span>
                                                                                        )}
                                                                                    </Label>
                                                                                </div>
                                                                                <HelpCircle className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0" />
                                                                            </div>
                                                                            <p className="text-xs text-gray-600 mt-1 sm:ml-6">{dodatek.opis}</p>
                                                                            <span
                                                                                className={`text-sm font-semibold transition-colors duration-300 sm:ml-6 inline-block mt-1 ${!moznaWybracDodatki ? "text-gray-400" : "text-green-600"
                                                                                    }`}
                                                                            >
                                                                                {dodatek.wCeniePosadzki ? (
                                                                                    <span className="text-blue-600 italic">w cenie posadzki</span>
                                                                                ) : (
                                                                                    <>
                                                                                        {dodatek.cenaZaM2 && `${dodatek.cenaZaM2} zł/m²`}
                                                                                        {dodatek.cenaZaMb && `${dodatek.cenaZaMb} zł/mb`}
                                                                                        {dodatek.cenaStala && `${dodatek.cenaStala} zł`}
                                                                                    </>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="right" className="max-w-xs">
                                                                    <p className="text-sm font-medium">{dodatek.nazwa}</p>
                                                                    <p className="text-xs text-gray-600 mt-1">{dodatek.opis}</p>
                                                                    {dodatek.obowiazkowy && (
                                                                        <p className="text-xs text-blue-600 mt-1 font-semibold">Ta usługa jest obowiązkowa i zawarta w cenie</p>
                                                                    )}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Podsumowanie i akcje - ukryte na mobile (przeniesione do sticky bottom bar) */}
                        {powierzchnia > 0 && wybranaPosadzka && wybranyRodzajPowierzchniObj && wybranyKolorObj && (
                            <div className="hidden lg:block animate-in slide-in-from-bottom-4 duration-700">
                                <Card className="bg-green-50 border-green-200 shadow-lg">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-green-800">Podsumowanie</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Powierzchnia:</span>
                                            <span className="font-medium">{powierzchnia.toFixed(2)} m²</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Rodzaj:</span>
                                            <span className="font-medium">{wybranyRodzajPowierzchniObj.nazwa}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Kolor:</span>
                                            <span className="font-medium">{wybranyKolorObj.kodRAL}</span>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between text-lg font-bold text-green-700">
                                            <span>Koszt całkowity:</span>
                                            <span className="animate-pulse">{kosztCalkowity.toFixed(2)} zł</span>
                                        </div>
                                        <div className="text-center text-sm text-green-600">
                                            ({(kosztCalkowity / powierzchnia).toFixed(2)} zł/m²)
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Przyciski akcji - ukryte na mobile (przeniesione do sticky bottom bar) */}
                        <div className="hidden lg:block space-y-3">
                            <Button
                                onClick={resetKalkulator}
                                variant="outline"
                                className="w-full transition-all duration-300 hover:scale-105 bg-transparent text-sm sm:text-base py-2 sm:py-3"
                            >
                                Wyczyść kalkulator
                            </Button>

                            {/* Input email - pokazuje się po kliknięciu "Wyślij email" */}
                            {showEmailInput && (
                                <div className="animate-in slide-in-from-bottom-2 duration-300 space-y-3">
                                    <div>
                                        <Label htmlFor="userEmail" className="font-medium">
                                            Twój adres email
                                        </Label>
                                        <Input
                                            id="userEmail"
                                            type="email"
                                            placeholder="np. jan.kowalski@email.com"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => generujPDF(true)}
                                            disabled={isSendingEmail || !userEmail}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-2 sm:py-3"
                                        >
                                            {isSendingEmail ? (
                                                <>
                                                    <Mail className="h-4 w-4 mr-2 animate-pulse" />
                                                    Wysyłanie...
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    Wyślij email
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowEmailInput(false)
                                                setUserEmail("")
                                            }}
                                            variant="outline"
                                            className="px-4"
                                        >
                                            Anuluj
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {powierzchnia > 0 &&
                                wybranaPosadzka &&
                                wybranyRodzajPowierzchniObj &&
                                wybranyKolorObj &&
                                !showEmailInput && (
                                    <div className="animate-in slide-in-from-bottom-2 duration-500 space-y-2">
                                        <Button
                                            onClick={() => generujPDF(false)}
                                            disabled={isGeneratingPDF}
                                            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-2 sm:py-3"
                                        >
                                            {isGeneratingPDF ? (
                                                <>
                                                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                                                    Generowanie PDF...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Pobierz kosztorys PDF
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => setShowEmailInput(true)}
                                            variant="outline"
                                            className="w-full transition-all duration-300 hover:scale-105 text-sm sm:text-base py-2 sm:py-3"
                                        >
                                            <Mail className="h-4 w-4 mr-2" />
                                            Wyślij kosztorys emailem
                                        </Button>
                                    </div>
                                )}
                        </div>
                    </div>

                    {shouldShowPreview && wybranyKolorObj && wybranyRodzajPowierzchniObj && (
                        <div className="lg:col-span-12">
                            <Card className="transition-all duration-500 ease-in-out">
                                <CardHeader className="pb-3 sm:pb-4">
                                    <CardTitle className="text-lg sm:text-xl">Podgląd wybranej posadzki</CardTitle>
                                    <CardDescription className="text-base sm:text-lg font-medium text-blue-600 animate-in fade-in duration-500">
                                        {wybranyRodzajPowierzchniObj.nazwa} - {wybranyKolorObj.nazwa}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 min-h-[200px] sm:min-h-[300px] group">
                                            <Image
                                                src={wybranyKolorObj.podglad || PLACEHOLDER_IMAGE}
                                                alt={`Podgląd ${wybranyKolorObj.nazwa}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg animate-in slide-in-from-bottom-2 duration-500 delay-200">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">Rodzaj powierzchni:</span>
                                                    <p className="text-sm font-bold text-gray-900">{wybranyRodzajPowierzchniObj.nazwa}</p>
                                                    <p className="text-base sm:text-lg font-bold text-blue-600">
                                                        {wybranyRodzajPowierzchniObj.cenaZaM2} zł/m²
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Kod koloru:</span>
                                                    <p className="text-sm font-bold text-gray-900">{wybranyKolorObj.kodRAL}</p>
                                                    <p className="text-base sm:text-lg font-bold text-green-600">
                                                        {wybranyKolorObj.cenaDodatkowa > 0
                                                            ? `+${wybranyKolorObj.cenaDodatkowa} zł/m²`
                                                            : "Bez dopłaty"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Koszt całkowity:</span>
                                                    <p className="text-base sm:text-lg font-bold text-green-600">
                                                        {kosztCalkowity.toFixed(2)} zł
                                                    </p>
                                                    <p className="text-sm text-gray-600">({(kosztCalkowity / powierzchnia).toFixed(2)} zł/m²)</p>
                                                </div>
                                            </div>
                                            {wybranyRodzajPowierzchniObj.wlasciwosci && (
                                                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                                                    <span className="font-medium text-gray-700 text-sm">Właściwości powierzchni:</span>
                                                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                                                        {(wybranyRodzajPowierzchniObj.wlasciwosci || []).map((wlasciwosc, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                {wlasciwosc}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Sticky bottom bar for mobile - floating pinned at the very bottom */}
            {shouldShowMobileStickyBar && (
                <div className="block lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur border-t-2 border-green-500 shadow-lg z-[9999]">
                    <div className="px-3 sm:px-4 py-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                        {/* Compact summary */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Koszt całkowity:</span>
                                <span className="text-xl font-bold text-green-700">{kosztCalkowity.toFixed(2)} zł</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>{powierzchnia.toFixed(2)} m²</span>
                                <span>•</span>
                                <span>{(kosztCalkowity / powierzchnia).toFixed(2)} zł/m²</span>
                                <span>•</span>
                                <span className="truncate flex-shrink-0 min-w-0">{wybranyKolorObj?.kodRAL || ''}</span>
                            </div>
                        </div>
                        
                        {/* Email input for mobile */}
                        {showEmailInput ? (
                            <div className="space-y-2 mb-3">
                                <Input
                                    id="userEmailMobile"
                                    type="email"
                                    placeholder="Twój adres email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="text-sm"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => generujPDF(true)}
                                        disabled={isSendingEmail || !userEmail}
                                        size="sm"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isSendingEmail ? (
                                            <>
                                                <Mail className="h-3 w-3 mr-1" />
                                                Wysyłanie...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="h-3 w-3 mr-1" />
                                                Wyślij
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowEmailInput(false)
                                            setUserEmail("")
                                        }}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Anuluj
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* Action buttons */
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={() => generujPDF(false)}
                                    disabled={isGeneratingPDF}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                >
                                    {isGeneratingPDF ? (
                                        <>
                                            <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                                            <span className="text-xs">PDF...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-3 w-3 mr-1" />
                                            <span className="text-xs">Pobierz PDF</span>
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={() => setShowEmailInput(true)}
                                    size="sm"
                                    variant="outline"
                                >
                                    <Mail className="h-3 w-3 mr-1" />
                                    <span className="text-xs">Email</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
