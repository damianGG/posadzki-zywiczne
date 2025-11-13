"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Hammer,
  Disc,
  Paintbrush,
  Droplets,
  Ruler,
  CheckCircle,
  Clock,
  Wrench,
  ArrowDown,
  MousePointer,
} from "lucide-react"

interface ProcessStep {
  id: number
  title: string
  description: string
  details: string[]
  icon: React.ReactNode
  duration: string
  color: string
  bgColor: string
  tips: string[]
}

const renovationSteps: ProcessStep[] = [
  {
    id: 1,
    title: "Przygotowanie betonu/Skuwanie płytek",
    description: "Usunięcie starych powłok i przygotowanie podłoża",
    details: [
      "Skuwanie starych płytek ceramicznych",
      "Oczyszczenie powierzchni betonu",
      "Usunięcie kurzu i zanieczyszczeń",
      "Ocena stanu podłoża",
    ],
    tips: [
      "Używamy profesjonalnych młotów ",
      "Sprawdzamy wytrzymałość betonu",
      "Dokumentujemy stan wyjściowy",
    ],
    icon: <Hammer className="w-6 h-6" />,
    duration: "1-2 dni",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: 2,
    title: "Szlifowanie",
    description: "Wyrównanie i przygotowanie powierzchni",
    details: [
      "Szlifowanie diamentowe betonu",
      "Usunięcie nierówności",
      "Odkurzanie powierzchni",
      "Kontrola równości podłoża",
    ],
    tips: [
      "Używamy tarcz diamentowych różnej gradacji",
      "Kontrolujemy poziomy",
      "Usuwamy całkowicie pył przed kolejnym etapem",
    ],
    icon: <Disc className="w-6 h-6" />,
    duration: "1 dzień",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: 3,
    title: "Gruntowanie",
    description: "Aplikacja gruntu penetrującego",
    details: [
      "Nałożenie gruntu epoksydowego",
      "Penetracja w strukturę betonu",
      "Zwiększenie przyczepności",
      "Czas schnięcia 12-24h",
    ],
    tips: [
      "Grunt penetruje na głębokość 2-3mm",
      "Aplikujemy w temperaturze 5-25°C",
      "Kontrolujemy wilgotność powietrza",
    ],
    icon: <Paintbrush className="w-6 h-6" />,
    duration: "0.5 dnia",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 4,
    title: "Powłoka żywiczna",
    description: "Aplikacja głównej warstwy żywicy",
    details: [
      "Mieszanie komponentów żywicy",
      "Aplikacja wałkiem lub pędzlem",
      "Równomierne rozprowadzenie",
      "Kontrola grubości warstwy",
    ],
    tips: ["Żywica nakładana w 1-2 warstwach", "Grubość końcowa 0.5-1mm", "Czas pracy mieszanki: 30-45 min"],
    icon: <Droplets className="w-6 h-6" />,
    duration: "1-2 dni",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 5,
    title: "Dylatacje",
    description: "Wykonanie szczelin dylatacyjnych",
    details: [
      "Wyznaczenie miejsc dylatacji",
      "Przecięcie powłoki",
      "Wypełnienie masą dylatacyjną",
      "Wyrównanie powierzchni",
    ],
    tips: ["Dylatacje co 6-8 metrów", "Głębokość 1/3 grubości płyty", "Masa dylatacyjna odporna na UV"],
    icon: <Ruler className="w-6 h-6" />,
    duration: "0.5 dnia",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 6,
    title: "Odbiór końcowy",
    description: "Kontrola jakości i przekazanie",
    details: [
      "Sprawdzenie równości powierzchni",
      "Kontrola przyczepności",
      "Dokumentacja fotograficzna",
    ],
    tips: ["Test przyczepności metodą pull-off", "Pomiar twardości powierzchni", "Gwarancja na wykonane prace"],
    icon: <CheckCircle className="w-6 h-6" />,
    duration: "0.5 dnia",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
]

export default function ScrollDrivenRenovationTimeline() {
  const [currentStep, setCurrentStep] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [showScrollHint, setShowScrollHint] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return

      const rect = timelineRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height

      // Calculate how much of the timeline is visible
      const elementTop = rect.top
      const elementBottom = rect.bottom

      // Start animation when element enters viewport
      const startOffset = windowHeight * 0.8
      const endOffset = windowHeight * 0.2

      let progress = 0

      if (elementTop <= startOffset && elementBottom >= endOffset) {
        // Element is in the animation zone
        const visibleHeight = Math.min(startOffset - elementTop, elementHeight)
        const totalAnimationHeight = elementHeight + startOffset - endOffset
        progress = Math.max(0, Math.min(1, visibleHeight / totalAnimationHeight))
      } else if (elementBottom < endOffset) {
        // Element has passed through completely
        progress = 1
      }

      setScrollProgress(progress)

      // Calculate current step based on progress
      const totalSteps = renovationSteps.length
      const stepSize = 1 / totalSteps
      const currentStepIndex = Math.min(Math.floor(progress / stepSize), totalSteps - 1)
      const stepProgressValue = ((progress % stepSize) / stepSize) * 100

      setCurrentStep(currentStepIndex)
      setStepProgress(stepProgressValue)

      // Hide scroll hint after some scrolling
      if (progress > 0.1) {
        setShowScrollHint(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToStep = (stepIndex: number) => {
    if (!timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const targetProgress = (stepIndex + 0.5) / renovationSteps.length
    const scrollOffset = rect.top + window.scrollY - windowHeight * 0.8 + rect.height * targetProgress

    window.scrollTo({
      top: scrollOffset,
      behavior: "smooth",
    })
  }

  const totalDuration = "2-4 dni roboczych"

  return (
    <div className="w-full pt-8">
      {/* Hero Section */}
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
        <div className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4 mt-24">
            Proces realizacji remontu garażu
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-6">
            Kompleksowy remont z profesjonalną posadzką żywiczną
          </p>
          <div className="flex items-center justify-center gap-2 text-base md:text-lg text-gray-500 mb-6 md:mb-8">
            <Clock className="w-4 h-4 md:w-5 md:h-5" />
            <span>Całkowity czas realizacji: {totalDuration}</span>
          </div>

          {showScrollHint && (
            <div className="animate-bounce">
              <div className="flex flex-col items-center gap-2 text-blue-600">
                <MousePointer className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-xs md:text-sm font-medium">Przewiń w dół, aby zobaczyć proces</span>
                <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />
              </div>
            </div>
          )}
          {/* Progress Indicator */}
          {/* <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div> */}

          {/* Step Navigation */}

          {/* Timeline */}
          <div ref={timelineRef} className="min-h-[150vh] md:min-h-[200vh] py-10 md:py-20">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 md:w-1 bg-gray-200 rounded-full"></div>
                <div
                  className="absolute left-6 md:left-8 top-0 w-0.5 md:w-1 bg-gradient-to-b from-blue-500 to-green-500 rounded-full transition-all duration-500"
                  style={{
                    height: `${scrollProgress * 100}%`,
                  }}
                />

                <div className="space-y-8 md:space-y-16">
                  {renovationSteps.map((step, index) => {
                    const isActive = index === currentStep
                    const isCompleted = index < currentStep
                    const isVisible = index <= currentStep

                    return (
                      <div
                        key={step.id}
                        className={`relative flex items-start gap-4 md:gap-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-30 translate-y-8"
                          }`}
                      >
                        {/* Step indicator */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-2 md:border-4 cursor-pointer transition-all duration-500 ${isVisible
                            ? `${step.bgColor} border-current ${step.color} shadow-lg scale-110`
                            : "bg-gray-100 border-gray-300 text-gray-400"
                            }`}
                          onClick={() => scrollToStep(index)}
                        >
                          <div className="w-4 h-4 md:w-6 md:h-6">{step.icon}</div>
                          {isCompleted && (
                            <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-2.5 h-2.5 md:w-4 md:h-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Step content */}
                        <Card
                          className={`flex-1 transition-all duration-500 ${isActive
                            ? "ring-1 md:ring-2 ring-blue-500 shadow-lg md:shadow-xl scale-105"
                            : isCompleted
                              ? "bg-gray-50 shadow-md"
                              : "shadow-sm"
                            }`}
                        >
                          <CardHeader className="p-4 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
                              <div className="flex-1">
                                <CardTitle
                                  className={`text-lg md:text-xl transition-colors duration-300 ${isActive ? step.color : isCompleted ? "text-gray-600" : "text-gray-800"
                                    }`}
                                >
                                  {step.id}. {step.title}
                                </CardTitle>
                                <CardDescription className="mt-1 md:mt-2 text-sm md:text-base">
                                  {step.description}
                                </CardDescription>
                              </div>
                              <div className="flex flex-row md:flex-col items-start md:items-end gap-2">
                                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                  <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                  {step.duration}
                                </Badge>
                                {isVisible && (
                                  <Badge
                                    variant="default"
                                    className={`text-xs ${isCompleted ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-gray-400"}`}
                                  >
                                    {isCompleted ? "Ukończono" : isActive ? "W trakcie" : "Oczekuje"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
                                Zakres prac:
                              </h4>
                              <ul className="space-y-1.5 md:space-y-2">
                                {step.details.map((detail, detailIndex) => (
                                  <li
                                    key={detailIndex}
                                    className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-gray-600"
                                  >
                                    <Wrench className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
                                Kluczowe informacje:
                              </h4>
                              <ul className="space-y-1.5 md:space-y-2">
                                {step.tips.map((tip, tipIndex) => (
                                  <li
                                    key={tipIndex}
                                    className="flex items-start gap-2 md:gap-3 text-xs md:text-sm text-blue-700 bg-blue-50 p-2 rounded"
                                  >
                                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-500 rounded-full mt-1.5 md:mt-2 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Progress bar for current step */}
                            {/* {isActive && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs md:text-sm text-gray-600">
                                  <span>Postęp etapu</span>
                                  <span>{Math.round(stepProgress)}%</span>
                                </div>
                                <Progress value={stepProgress} className="h-2 md:h-3" />
                              </div>
                            )} */}
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-4 md:space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Rezultat: Profesjonalna posadzka żywiczna</h2>
          <p className="text-lg md:text-xl text-gray-600">
            Trwała, odporna na ścieranie i łatwa w utrzymaniu powierzchnia garażowa
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
            {["Odporność na oleje i chemikalia", "Łatwe czyszczenie", "Estetyczny wygląd", "Długotrwałość 15+ lat"].map(
              (feature, index) => (
                <div key={index} className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs md:text-sm font-medium text-gray-700">{feature}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
