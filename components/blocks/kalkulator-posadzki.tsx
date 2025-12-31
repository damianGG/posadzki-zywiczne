"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
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
}

const rodzajePomieszczen: RodzajPomieszczeniaOption[] = [
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

const stanyBetonu: StanBetonuOption[] = [
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

const dodatkiUslugi = [
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

interface ProgressBarProps {
    currentStep: number
    totalSteps: number
}

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const stepsBase = [
        { number: 1, title: "Typ pomieszczenia", description: "Wybierz rodzaj pomieszczenia" },
        { number: 2, title: "Stan betonu", description: "Wybierz stan podłoża", conditional: true },
        { number: 3, title: "Wymiary", description: "Wprowadź wymiary pomieszczenia" },
        { number: 4, title: "Powierzchnia", description: "Wybierz rodzaj powierzchni" },
        { number: 5, title: "Kolor", description: "Wybierz kolor posadzki" },
        { number: 6, title: "Dodatki", description: "Wybierz dodatkowe usługi" },
    ]

    // Filter steps based on totalSteps
    const steps = totalSteps === 5 
        ? stepsBase.filter(s => !s.conditional).map((s, i) => ({ ...s, number: i + 1 }))
        : stepsBase

    return (
        <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                {/* Desktop version */}
                <div className="hidden md:flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center flex-1">
                            <div className="flex items-center">
                                <div
                                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ease-in-out
                    ${currentStep > step.number
                                            ? "bg-green-500 border-green-500 text-white"
                                            : currentStep === step.number
                                                ? "bg-blue-500 border-blue-500 text-white"
                                                : "bg-gray-100 border-gray-300 text-gray-500"
                                        }
                  `}
                                >
                                    {currentStep > step.number ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <span className="text-sm font-semibold">{step.number}</span>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div
                                        className={`text-sm font-medium transition-colors duration-300 ${currentStep >= step.number ? "text-gray-900" : "text-gray-500"
                                            }`}
                                    >
                                        {step.title}
                                    </div>
                                    <div
                                        className={`text-xs transition-colors duration-300 ${currentStep >= step.number ? "text-gray-600" : "text-gray-400"
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
                        ${currentStep > step.number ? "bg-green-500 w-full" : "bg-gray-200 w-0"}
                      `}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile version */}
                <div className="md:hidden">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-2">
                            <div
                                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500 ease-in-out
                  ${currentStep > steps[currentStep - 1]?.number
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

export default function KalkulatorPosadzki() {
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
    const [loadedRodzajePowierzchni, setLoadedRodzajePowierzchni] = useState<RodzajPowierzchniOption[]>([])
    const [loadedKolory, setLoadedKolory] = useState<KolorOption[]>([])
    const [isLoadingConfig, setIsLoadingConfig] = useState(true)

    // Create dynamic posadzka object with loaded data
    const wybranapPosadzka = {
        id: "zywica",
        nazwa: "Posadzka żywiczna",
        rodzajePowierzchni: loadedRodzajePowierzchni,
        kolory: loadedKolory,
    }
    
    const wybranyRodzajPowierzchniObj = wybranapPosadzka?.rodzajePowierzchni.find(
        (r) => r.id === wybranyRodzajPowierzchni,
    )
    const wybranyKolorObj = wybranapPosadzka?.kolory.find((k) => k.id === wybranyKolor)
    const wybraneRodzajPomieszczenieObj = rodzajePomieszczen.find((p) => p.id === rodzajPomieszczenia)
    const wybranyStanBetonuObj = stanyBetonu.find((s) => s.id === stanBetonu)

    // Load calculator configuration from Supabase
    useEffect(() => {
        async function loadConfig() {
            try {
                setIsLoadingConfig(true)
                const response = await fetch('/api/admin/calculator-settings')
                if (response.ok) {
                    const data = await response.json()
                    
                    // Transform surface types data
                    if (data.surfaceTypes && data.surfaceTypes.length > 0) {
                        const transformedSurfaces = data.surfaceTypes
                            .filter((s: any) => s.is_active)
                            .map((s: any) => {
                                // Parse properties if it's a string, otherwise use as-is
                                let properties = []
                                try {
                                    properties = typeof s.properties === 'string' 
                                        ? JSON.parse(s.properties) 
                                        : (Array.isArray(s.properties) ? s.properties : [])
                                } catch (e) {
                                    console.error('Error parsing properties:', e)
                                }
                                
                                return {
                                    id: s.id,
                                    nazwa: s.name,
                                    opis: s.description || '',
                                    cenaZaM2: s.price_per_m2 || 0,
                                    price_ranges: s.price_ranges || [],
                                    zdjecie: s.image_url || PLACEHOLDER_IMAGE,
                                    wlasciwosci: properties,
                                }
                            })
                        setLoadedRodzajePowierzchni(transformedSurfaces)
                    } else {
                        // Fallback to hardcoded data if no data from API
                        setLoadedRodzajePowierzchni(rodzajePowierzchni)
                    }
                    
                    // Transform colors data
                    if (data.colors && data.colors.length > 0) {
                        const transformedColors = data.colors
                            .filter((c: any) => c.is_active)
                            .map((c: any) => ({
                                id: c.id,
                                nazwa: c.name,
                                kodRAL: c.ral_code || '',
                                cenaDodatkowa: c.additional_price || 0,
                                zdjecie: c.image_url || PLACEHOLDER_IMAGE,
                                podglad: c.preview_url || PLACEHOLDER_IMAGE,
                            }))
                        setLoadedKolory(transformedColors)
                    } else {
                        // Fallback to hardcoded data if no data from API
                        setLoadedKolory(koloryRAL)
                    }
                } else {
                    // Fallback to hardcoded data if API fails
                    setLoadedRodzajePowierzchni(rodzajePowierzchni)
                    setLoadedKolory(koloryRAL)
                }
            } catch (error) {
                console.error('Error loading calculator config:', error)
                // Fallback to hardcoded data on error
                setLoadedRodzajePowierzchni(rodzajePowierzchni)
                setLoadedKolory(koloryRAL)
            } finally {
                setIsLoadingConfig(false)
            }
        }
        
        loadConfig()
    }, [])

    // Initialize mandatory services on first render
    useEffect(() => {
        const obowiazkowe = dodatkiUslugi.filter((d) => d.obowiazkowy).map((d) => d.id)
        if (wybraneDodatki.length === 0 && obowiazkowe.length > 0) {
            setWybraneDodatki(obowiazkowe)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

    // Sprawdzanie kroków
    const rodzajPomieszczeniaJestWybrany = rodzajPomieszczenia !== ""
    const stanBetonuJestWybrany = stanBetonu !== "" || rodzajPomieszczenia !== "garaz-piwnica"
    const wymiarySaWypelnione =
        rodzajPomieszczeniaJestWybrany &&
        stanBetonuJestWybrany &&
        (trybWymiarow === "wymiary"
            ? wymiary.dlugosc && wymiary.szerokosc && powierzchnia > 0 && walidacjaErrors.length === 0
            : powierzchniaBezposrednia && powierzchnia > 0 && walidacjaErrors.length === 0)

    const rodzajPowierzchniJestWybrany = wybranyRodzajPowierzchni !== ""
    const kolorJestWybrany = wybranyKolor !== ""
    const moznaWybracStanBetonu = rodzajPomieszczeniaJestWybrany && rodzajPomieszczenia === "garaz-piwnica"
    const moznaWybracWymiary = rodzajPomieszczeniaJestWybrany && stanBetonuJestWybrany
    const moznaWybracRodzajPowierzchni = wymiarySaWypelnione
    const moznaWybracKolor = wymiarySaWypelnione && rodzajPowierzchniJestWybrany
    const moznaWybracDodatki = wymiarySaWypelnione && rodzajPowierzchniJestWybrany && kolorJestWybrany

    // Obliczanie aktualnego kroku
    const getCurrentStep = () => {
        if (!rodzajPomieszczeniaJestWybrany) return 1
        if (rodzajPomieszczenia === "garaz-piwnica" && !stanBetonuJestWybrany) return 2
        if (!wymiarySaWypelnione) return rodzajPomieszczenia === "garaz-piwnica" ? 3 : 2
        if (!rodzajPowierzchniJestWybrany) return rodzajPomieszczenia === "garaz-piwnica" ? 4 : 3
        if (!kolorJestWybrany) return rodzajPomieszczenia === "garaz-piwnica" ? 5 : 4
        return rodzajPomieszczenia === "garaz-piwnica" ? 6 : 5
    }

    const currentStep = getCurrentStep()
    const totalSteps = rodzajPomieszczenia === "garaz-piwnica" ? 6 : 5

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

        if (pow > 0 && wybranapPosadzka && wybranyRodzajPowierzchniObj && wybranyKolorObj && errors.length === 0) {
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
        wybranapPosadzka,
        wybranyRodzajPowierzchniObj,
        wybranyKolorObj,
        wybranyStanBetonuObj,
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
        const obowiazkowe = dodatkiUslugi.filter((d) => d.obowiazkowy).map((d) => d.id)
        setWybraneDodatki(obowiazkowe)
        setObwod("")
        setWalidacjaErrors([])
        setUserEmail("")
        setShowEmailInput(false)
    }

    const generujPDF = async (sendEmail = false) => {
        if (!powierzchnia || !wybranapPosadzka || !wybranyRodzajPowierzchniObj || !wybranyKolorObj) return

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
        
        doc.setTextColor(255, 255, 255) // Biały tekst
        doc.setFontSize(24)
        doc.setFont("helvetica", "bold")
        doc.text("POSADZKI ZYWICZNE", pageWidth / 2, 15, { align: "center" })
        
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text("Profesjonalne posadzki zywiczne dla domu i biznesu", pageWidth / 2, 23, { align: "center" })

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

        if (wybranyStanBetonuObj && rodzajPomieszczenia === "garaz-piwnica") {
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
        doc.text(formatTextForPDF(`Rodzaj: ${wybranapPosadzka.nazwa}`), 20, yPosition)
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
        const cenaCalkowita = wybranyRodzajPowierzchniObj.cenaZaM2 + wybranyKolorObj.cenaDodatkowa
        doc.text(formatTextForPDF(`${wybranapPosadzka.nazwa} ${wybranyKolorObj.kodRAL}`), 20, yPosition)
        doc.text(powierzchnia.toFixed(2), 80, yPosition)
        doc.text("m²", 110, yPosition)
        doc.text(`${cenaCalkowita.toFixed(2)} zl`, 140, yPosition)
        doc.text(`${(powierzchnia * cenaCalkowita).toFixed(2)} zl`, 170, yPosition)
        yPosition += 8

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
        doc.text(formatTextForPDF(`Koszt calkowity: ${kosztCalkowity.toFixed(2)} zl`), 20, yPosition)
        yPosition += 6
        doc.text(formatTextForPDF(`Koszt za m²: ${(kosztCalkowity / powierzchnia).toFixed(2)} zl/m²`), 20, yPosition)

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
        doc.text(formatTextForPDF("Instagram: @posadzkizywiczne"), 20, footerY + 43)
        
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
            formatTextForPDF("Kosztorys wygenerowany automatycznie. Ceny moga ulec zmianie. Prosimy o kontakt w celu potwierdzenia."),
            pageWidth / 2,
            pageHeight - 10,
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
    const dodatkiPodleKategorii = dodatkiUslugi.reduce(
        (acc, dodatek) => {
            const kategoria = dodatek.kategoria || "inne"
            if (!acc[kategoria]) {
                acc[kategoria] = []
            }
            acc[kategoria].push(dodatek)
            return acc
        },
        {} as Record<string, typeof dodatkiUslugi>,
    )

    const kategorieNazwy = {
        przygotowanie: "Przygotowanie podłoża",
        wykończenie: "Wykończenie",
        ochrona: "Warstwy ochronne",
        logistyka: "Transport i logistyka",
        inne: "Pozostałe usługi",
    }

    // Show loading state while configuration is being fetched
    if (isLoadingConfig) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Ładowanie konfiguracji kalkulatora...</p>
                </div>
            </div>
        )
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
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 min-h-[600px]">
                    {/* Panel opcji - na mobile pełna szerokość, na lg 1/3 ekranu */}
                    <div className="lg:col-span-4 space-y-4 lg:space-y-6">
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
                                            Krok 1: Typ pomieszczenia
                                        </span>
                                    </CardTitle>
                                    {!rodzajPomieszczeniaJestWybrany && (
                                        <CardDescription className="text-blue-600 font-medium animate-pulse">
                                            Rozpocznij od wyboru typu pomieszczenia
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {rodzajePomieszczen.map((pomieszczenie, index) => (
                                        <div
                                            key={pomieszczenie.id}
                                            className={`
                                border rounded-lg p-4 cursor-pointer transition-all duration-300 ease-in-out
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
                        {rodzajPomieszczenia === "garaz-piwnica" && (
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
                                                Krok 2: Stan podłoża
                                            </span>
                                        </CardTitle>
                                        {moznaWybracStanBetonu && !stanBetonuJestWybrany && (
                                            <CardDescription className="text-blue-600 font-medium animate-pulse">
                                                Wybierz obecny stan betonu
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {stanyBetonu.map((stan, index) => (
                                            <div
                                                key={stan.id}
                                                className={`
                                    border rounded-lg p-4 cursor-pointer transition-all duration-300 ease-in-out
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
                                                        {stan.cenaDodatkowa > 0 && (
                                                            <p className="text-sm font-bold text-orange-600 mt-2">
                                                                +{stan.cenaDodatkowa} zł/m²
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
                                            Krok {rodzajPomieszczenia === "garaz-piwnica" ? "3" : "2"}: Wymiary pomieszczenia
                                        </span>
                                    </CardTitle>
                                    {!moznaWybracWymiary && (
                                        <CardDescription className="text-gray-500">
                                            Najpierw wybierz typ pomieszczenia{rodzajPomieszczenia === "garaz-piwnica" && " i stan podłoża"}
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
                                            Krok {rodzajPomieszczenia === "garaz-piwnica" ? "4" : "3"}: Rodzaj powierzchni
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
                                    {isLoadingConfig ? (
                                        <div className="text-center py-8 text-gray-500">
                                            Ładowanie konfiguracji...
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {loadedRodzajePowierzchni.map((rodzaj, index) => (
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
                                                                {rodzaj.wlasciwosci.map((wlasciwosc, idx) => (
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
                                )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Krok: Wybór koloru */}
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
                                            Krok {rodzajPomieszczenia === "garaz-piwnica" ? "5" : "4"}: Wybór koloru RAL
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
                                        {koloryRAL.map((kolor, index) => (
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

                        {/* Krok: Dodatkowe usługi */}
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
                                            Krok {rodzajPomieszczenia === "garaz-piwnica" ? "6" : "5"}: Dodatkowe usługi
                                        </span>
                                    </CardTitle>
                                    {!moznaWybracDodatki && (
                                        <CardDescription className="text-gray-500">
                                            Najpierw wybierz wymiary, rodzaj powierzchni i kolor
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
                                    flex items-start space-x-3 p-3 rounded-lg border transition-all duration-300
                                    animate-in slide-in-from-right-2
                                    ${dodatek.obowiazkowy ? "bg-blue-50 border-blue-200" : "border-gray-200"}
                                    ${moznaWybracDodatki ? "hover:bg-gray-50" : ""}
                                  `}
                                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                                >
                                                                    {dodatek.zdjecie && (
                                                                        <div className="relative w-12 h-12 rounded border overflow-hidden flex-shrink-0">
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
                                                                        <p className="text-xs text-gray-600 mt-1 ml-6">{dodatek.opis}</p>
                                                                        <span
                                                                            className={`text-sm font-semibold transition-colors duration-300 ml-6 inline-block mt-1 ${!moznaWybracDodatki ? "text-gray-400" : "text-green-600"
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

                        {/* Podsumowanie i akcje */}
                        {powierzchnia > 0 && wybranapPosadzka && wybranyRodzajPowierzchniObj && wybranyKolorObj && (
                            <div className="animate-in slide-in-from-bottom-4 duration-700">
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

                        {/* Przyciski akcji */}
                        <div className="space-y-3">
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
                                wybranapPosadzka &&
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

                    {/* Podgląd - na mobile pełna szerokość pod opcjami, na lg 2/3 ekranu */}
                    <div className="lg:col-span-8 order-first lg:order-last">
                        <Card className="h-64 sm:h-80 lg:h-full transition-all duration-500 ease-in-out">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="text-lg sm:text-xl">Podgląd wybranej posadzki</CardTitle>
                                {wybranyRodzajPowierzchniObj && wybranyKolorObj && (
                                    <CardDescription className="text-base sm:text-lg font-medium text-blue-600 animate-in fade-in duration-500">
                                        {wybranyRodzajPowierzchniObj.nazwa} - {wybranyKolorObj.nazwa}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="h-full pb-4">
                                {wybranyKolorObj && wybranyRodzajPowierzchniObj ? (
                                    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-700">
                                        <div className="flex-1 relative rounded-lg overflow-hidden border-2 border-gray-200 min-h-[200px] sm:min-h-[300px] lg:min-h-[400px] group">
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
                                                        {wybranyRodzajPowierzchniObj.wlasciwosci.map((wlasciwosc, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                {wlasciwosc}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                        <div className="text-center text-gray-500 animate-in fade-in duration-500 p-4">
                                            <Layers className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50 animate-pulse" />
                                            <h3 className="text-lg sm:text-xl font-medium mb-2">Wybierz rodzaj powierzchni i kolor</h3>
                                            <p className="text-sm sm:text-base text-gray-400">
                                                {!wymiarySaWypelnione
                                                    ? "Najpierw wprowadź poprawne wymiary pomieszczenia"
                                                    : !rodzajPowierzchniJestWybrany
                                                        ? "Wybierz rodzaj powierzchni posadzki"
                                                        : "Wybierz kolor posadzki RAL"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
