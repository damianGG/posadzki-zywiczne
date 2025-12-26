"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface RodzajPowierzchniOption {
    id: string
    nazwa: string
    opis: string
    cenaZaM2: number
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

const rodzajePowierzchni: RodzajPowierzchniOption[] = [
    {
        id: "podstawowa",
        nazwa: "Podstawowa lekko chropowata",
        opis: "Powierzchnia z kruszywem kwarcowym zapewniająca dobrą przyczepność",
        cenaZaM2: 200,
        zdjecie: "/placeholder.svg?height=80&width=80&text=Podstawowa+Chropowata",
        wlasciwosci: ["Kruszywo kwarcowe", "Lekko chropowata", "Dobra przyczepność", "Standardowa odporność"],
    },
    {
        id: "akrylowa",
        nazwa: "Z posypką z płatków akrylowych",
        opis: "Dekoracyjna powierzchnia z kolorowymi płatkami akrylowymi",
        cenaZaM2: 230,
        zdjecie: "/placeholder.svg?height=80&width=80&text=Płatki+Akrylowe",
        wlasciwosci: ["Płatki akrylowe", "Efekt dekoracyjny", "Zwiększona estetyka", "Dobra odporność"],
    },
    {
        id: "zacierana",
        nazwa: "Zacierana mechanicznie",
        opis: "Gładka powierzchnia zacierana mechanicznie dla najwyższej jakości",
        cenaZaM2: 260,
        zdjecie: "/placeholder.svg?height=80&width=80&text=Zacierana+Mechanicznie",
        wlasciwosci: ["Zacierana mechanicznie", "Gładka powierzchnia", "Najwyższa jakość", "Maksymalna odporność"],
    },
]

const koloryRAL: KolorOption[] = [
    {
        id: "ral7035",
        nazwa: "RAL 7035 - Szary jasny",
        kodRAL: "RAL 7035",
        cenaDodatkowa: 0,
        zdjecie: "/placeholder.svg?height=80&width=80&text=RAL7035",
        podglad: "/placeholder.svg?height=400&width=600&text=RAL7035+Podgląd+Posadzki",
    },
    {
        id: "ral7040",
        nazwa: "RAL 7040 - Szary okno",
        kodRAL: "RAL 7040",
        cenaDodatkowa: 0,
        zdjecie: "/placeholder.svg?height=80&width=80&text=RAL7040",
        podglad: "/placeholder.svg?height=400&width=600&text=RAL7040+Podgląd+Posadzki",
    },
    {
        id: "ral7035posypka",
        nazwa: "RAL 7035 z posypką",
        kodRAL: "RAL 7035",
        cenaDodatkowa: 50,
        zdjecie: "/placeholder.svg?height=80&width=80&text=RAL7035+Posypka",
        podglad: "/placeholder.svg?height=400&width=600&text=RAL7035+Posypka+Podgląd",
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
        id: "malowanie-cokolu",
        nazwa: "Malowanie cokołu",
        cenaZaMb: 15,
        opis: "Profesjonalne malowanie cokołu w kolorze posadzki lub kontrastowym",
        kategoria: "wykończenie",
    },
    {
        id: "uszczelnienie-cokolu",
        nazwa: "Uszczelnienie cokołu",
        cenaZaMb: 8,
        opis: "Silikonowe uszczelnienie styku posadzki z ścianą",
        kategoria: "wykończenie",
    },
    {
        id: "dylatacje",
        nazwa: "Dylatacje",
        cenaZaMb: 12,
        opis: "Wykonanie dylatacji w posadzce zgodnie z wymogami technicznymi",
        kategoria: "wykończenie",
    },
    {
        id: "podklad",
        nazwa: "Podkład wyrównujący",
        cenaZaM2: 15,
        opis: "Samopoziomujący podkład cementowy do wyrównania powierzchni",
        kategoria: "przygotowanie",
    },
    {
        id: "gruntowanie",
        nazwa: "Gruntowanie podłoża",
        cenaZaM2: 8,
        opis: "Dwukrotne gruntowanie podłoża dla lepszej przyczepności",
        kategoria: "przygotowanie",
    },
    {
        id: "szlifowanie",
        nazwa: "Szlifowanie betonu",
        cenaZaM2: 12,
        opis: "Mechaniczne przygotowanie powierzchni betonowej",
        kategoria: "przygotowanie",
    },
    {
        id: "naprawa-ubytków",
        nazwa: "Naprawa ubytków",
        cenaZaM2: 25,
        opis: "Wypełnienie i wyrównanie ubytków w podłożu",
        kategoria: "przygotowanie",
    },
    {
        id: "warstwa-ochronna",
        nazwa: "Warstwa ochronna",
        cenaZaM2: 18,
        opis: "Dodatkowa warstwa ochronna zwiększająca odporność",
        kategoria: "ochrona",
    },
    {
        id: "antypoślizgowa",
        nazwa: "Powierzchnia antypoślizgowa",
        cenaZaM2: 22,
        opis: "Specjalna tekstura zwiększająca bezpieczeństwo",
        kategoria: "ochrona",
    },
    {
        id: "transport",
        nazwa: "Transport i dostawa",
        cenaStala: 150,
        opis: "Dostawa materiałów na teren budowy",
        kategoria: "logistyka",
    },
    {
        id: "demontaz",
        nazwa: "Demontaż starej posadzki",
        cenaZaM2: 8,
        opis: "Usunięcie istniejącej posadzki wraz z wywozem gruzu",
        kategoria: "przygotowanie",
    },
    {
        id: "sprzatanie",
        nazwa: "Sprzątanie końcowe",
        cenaStala: 200,
        opis: "Kompleksowe sprzątanie po zakończeniu prac",
        kategoria: "wykończenie",
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
    const steps = [
        { number: 1, title: "Wymiary", description: "Wprowadź wymiary pomieszczenia" },
        { number: 2, title: "Powierzchnia", description: "Wybierz rodzaj powierzchni" },
        { number: 3, title: "Kolor", description: "Wybierz kolor posadzki" },
        { number: 4, title: "Dodatki", description: "Wybierz dodatkowe usługi" },
    ]

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

    const wybranapPosadzka = rodzajePosadzek.find((p) => p.id === wybranyRodzaj)
    const wybranyRodzajPowierzchniObj = wybranapPosadzka?.rodzajePowierzchni.find(
        (r) => r.id === wybranyRodzajPowierzchni,
    )
    const wybranyKolorObj = wybranapPosadzka?.kolory.find((k) => k.id === wybranyKolor)

    // Walidacja wymiarów
    const walidujWymiary = (dlugosc: string, szerokosc: string, powierzchniaBezp: string) => {
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
    }

    // Sprawdzanie kroków
    const wymiarySaWypelnione =
        trybWymiarow === "wymiary"
            ? wymiary.dlugosc && wymiary.szerokosc && powierzchnia > 0 && walidacjaErrors.length === 0
            : powierzchniaBezposrednia && powierzchnia > 0 && walidacjaErrors.length === 0

    const rodzajPowierzchniJestWybrany = wybranyRodzajPowierzchni !== ""
    const kolorJestWybrany = wybranyKolor !== ""
    const moznaWybracRodzajPowierzchni = wymiarySaWypelnione
    const moznaWybracKolor = wymiarySaWypelnione && rodzajPowierzchniJestWybrany
    const moznaWybracDodatki = wymiarySaWypelnione && rodzajPowierzchniJestWybrany && kolorJestWybrany

    // Obliczanie aktualnego kroku
    const getCurrentStep = () => {
        if (!wymiarySaWypelnione) return 1
        if (!rodzajPowierzchniJestWybrany) return 2
        if (!kolorJestWybrany) return 3
        return 4
    }

    const currentStep = getCurrentStep()

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
            let koszt = pow * (wybranyRodzajPowierzchniObj.cenaZaM2 + wybranyKolorObj.cenaDodatkowa)

            // Dodaj koszty dodatków
            wybraneDodatki.forEach((dodatekId) => {
                const dodatek = dodatkiUslugi.find((d) => d.id === dodatekId)
                if (dodatek) {
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
        wybranapPosadzka,
        wybranyRodzajPowierzchniObj,
        wybranyKolorObj,
        walidujWymiary,
    ])

    const handleDodatekChange = (dodatekId: string, checked: boolean) => {
        if (!moznaWybracDodatki) return

        if (checked) {
            setWybraneDodatki([...wybraneDodatki, dodatekId])
        } else {
            setWybraneDodatki(wybraneDodatki.filter((id) => id !== dodatekId))
        }
    }

    const resetKalkulator = () => {
        setWymiary({ dlugosc: "", szerokosc: "" })
        setPowierzchniaBezposrednia("")
        setTrybWymiarow("wymiary")
        setWybranyRodzaj("zywica")
        setWybranyRodzajPowierzchni("")
        setWybranyKolor("")
        setWybraneDodatki([])
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
        let yPosition = 20

        // Unikalny numer kosztorysu
        const numerKosztorysu = `PZ-${Date.now().toString().slice(-6)}`
        const dataKosztorysu = new Date().toLocaleDateString("pl-PL")

        // Nagłówek
        doc.setFontSize(20)
        doc.setFont("helvetica", "bold")
        doc.text(formatTextForPDF("KOSZTORYS POSADZKI ZYWICZNEJ"), pageWidth / 2, yPosition, { align: "center" })

        yPosition += 15
        doc.setFontSize(12)
        doc.setFont("helvetica", "normal")
        doc.text(`Data: ${dataKosztorysu}`, pageWidth - 20, yPosition, { align: "right" })
        doc.text(`Nr kosztorysu: ${numerKosztorysu}`, 20, yPosition)

        yPosition += 20

        // Dane pomieszczenia
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text(formatTextForPDF("DANE POMIESZCZENIA"), 20, yPosition)
        yPosition += 10

        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")

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

        // Dodatkowe usługi
        wybraneDodatki.forEach((dodatekId) => {
            const dodatek = dodatkiUslugi.find((d) => d.id === dodatekId)
            if (!dodatek) return

            let ilosc = 0
            let jednostka = ""
            let cenaJedn = 0
            let wartosc = 0

            if (dodatek.cenaZaM2) {
                ilosc = powierzchnia
                jednostka = "m²"
                cenaJedn = dodatek.cenaZaM2
                wartosc = powierzchnia * dodatek.cenaZaM2
            } else if (dodatek.cenaZaMb && obwod) {
                ilosc = Number.parseFloat(obwod)
                jednostka = "mb"
                cenaJedn = dodatek.cenaZaMb
                wartosc = ilosc * dodatek.cenaZaMb
            } else if (dodatek.cenaStala) {
                ilosc = 1
                jednostka = "kpl"
                cenaJedn = dodatek.cenaStala
                wartosc = dodatek.cenaStala
            }

            doc.text(formatTextForPDF(dodatek.nazwa), 20, yPosition)
            doc.text(ilosc.toFixed(2), 80, yPosition)
            doc.text(jednostka, 110, yPosition)
            doc.text(`${cenaJedn.toFixed(2)} zl`, 140, yPosition)
            doc.text(`${wartosc.toFixed(2)} zl`, 170, yPosition)
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

        // Stopka
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.text(formatTextForPDF("Kosztorys posadzki zywicznej - wygenerowany automatycznie"), pageWidth / 2, yPosition, {
            align: "center",
        })
        yPosition += 5
        doc.text(
            formatTextForPDF("Ceny moga ulec zmianie. Prosimy o kontakt w celu potwierdzenia aktualnych cen."),
            pageWidth / 2,
            yPosition,
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
                    alert("Błąd wysyłania emaila. Spróbuj ponownie.")
                }
            } catch (error) {
                console.error("Błąd wysyłania emaila:", error)
                alert("Błąd wysyłania emaila. Spróbuj ponownie.")
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
            <ProgressBar currentStep={currentStep} totalSteps={4} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 min-h-[600px]">
                    {/* Panel opcji - na mobile pełna szerokość, na lg 1/3 ekranu */}
                    <div className="lg:col-span-4 space-y-4 lg:space-y-6">
                        {/* Krok 1: Wymiary pomieszczenia */}
                        <div
                            className={`
                transition-all duration-500 ease-in-out transform
                ${!wymiarySaWypelnione ? "scale-105" : "scale-100"}
              `}
                        >
                            <Card
                                className={`
                  transition-all duration-500 ease-in-out
                  ${!wymiarySaWypelnione
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
                        ${wymiarySaWypelnione ? "text-green-500 scale-110" : "text-blue-600"}
                      `}
                                        >
                                            {wymiarySaWypelnione ? <CheckCircle className="h-6 w-6" /> : <Home className="h-6 w-6" />}
                                        </div>
                                        <span className={wymiarySaWypelnione ? "text-green-700" : "text-blue-700"}>
                                            Krok 1: Wymiary pomieszczenia
                                        </span>
                                    </CardTitle>
                                    {!wymiarySaWypelnione && (
                                        <CardDescription className="text-blue-600 font-medium animate-pulse">
                                            Rozpocznij od wprowadzenia wymiarów pomieszczenia
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Toggle trybu wprowadzania */}
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                        {/* Krok 2: Rodzaj powierzchni */}
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
                                            Krok 2: Rodzaj powierzchni
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
                                        {rodzajePowierzchni.map((rodzaj, index) => (
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
                                                                        src={rodzaj.zdjecie || "/placeholder.svg"}
                                                                        alt={rodzaj.nazwa}
                                                                        fill
                                                                        className="object-cover transition-transform duration-300 hover:scale-110"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0 w-full">
                                                                    <h3 className="font-medium text-sm mb-1">{rodzaj.nazwa}</h3>
                                                                    <p className="text-xs text-gray-600 mb-2">{rodzaj.opis}</p>
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="text-lg font-bold text-green-600">{rodzaj.cenaZaM2} zł/m²</p>
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
                                </CardContent>
                            </Card>
                        </div>

                        {/* Krok 3: Wybór koloru */}
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
                                            Krok 3: Wybór koloru RAL
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
                                                                        src={kolor.zdjecie || "/placeholder.svg"}
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

                        {/* Krok 4: Dodatkowe usługi */}
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
                                            Krok 4: Dodatkowe usługi
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
                                    flex items-center space-x-3 p-2 rounded transition-all duration-300
                                    animate-in slide-in-from-right-2
                                    ${moznaWybracDodatki ? "hover:bg-gray-50" : ""}
                                  `}
                                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                                >
                                                                    <Checkbox
                                                                        id={dodatek.id}
                                                                        checked={wybraneDodatki.includes(dodatek.id)}
                                                                        onCheckedChange={(checked) => handleDodatekChange(dodatek.id, checked as boolean)}
                                                                        disabled={!moznaWybracDodatki}
                                                                        className="transition-all duration-200"
                                                                    />
                                                                    <Label
                                                                        htmlFor={dodatek.id}
                                                                        className={`text-sm flex-1 transition-colors duration-300 ${!moznaWybracDodatki ? "text-gray-400" : "cursor-pointer"
                                                                            }`}
                                                                    >
                                                                        {dodatek.nazwa}
                                                                    </Label>
                                                                    <span
                                                                        className={`text-xs transition-colors duration-300 ${!moznaWybracDodatki ? "text-gray-400" : "text-gray-600"
                                                                            }`}
                                                                    >
                                                                        {dodatek.cenaZaM2 && `${dodatek.cenaZaM2} zł/m²`}
                                                                        {dodatek.cenaZaMb && `${dodatek.cenaZaMb} zł/mb`}
                                                                        {dodatek.cenaStala && `${dodatek.cenaStala} zł`}
                                                                    </span>
                                                                    <HelpCircle className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors" />
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right" className="max-w-xs">
                                                                <p className="text-sm font-medium">{dodatek.nazwa}</p>
                                                                <p className="text-xs text-gray-600 mt-1">{dodatek.opis}</p>
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
                        <div className="space-y-3 sticky bottom-4 sm:static bg-white sm:bg-transparent p-4 sm:p-0 -mx-4 sm:mx-0 border-t sm:border-t-0 shadow-lg sm:shadow-none">
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
                                                src={wybranyKolorObj.podglad || "/placeholder.svg"}
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
