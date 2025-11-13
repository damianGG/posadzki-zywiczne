"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Hammer,
  Disc,
  Paintbrush,
  Droplets,
  Ruler,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Wrench,
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
      "Test odporności na ścieranie",
      "Dokumentacja fotograficzna",
    ],
    icon: <CheckCircle className="w-6 h-6" />,
    duration: "0.5 dnia",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
]

export default function GarageRenovationTimeline() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && currentStep < renovationSteps.length) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentStep((current) => {
              if (current < renovationSteps.length - 1) {
                return current + 1
              } else {
                setIsPlaying(false)
                return current
              }
            })
            return 0
          }
          return prev + 2
        })
      }, 100)
    }

    return () => clearInterval(interval)
  }, [isPlaying, currentStep])

  const handlePlay = () => {
    if (currentStep >= renovationSteps.length) {
      setCurrentStep(0)
      setProgress(0)
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setProgress(0)
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
    setProgress(0)
    setIsPlaying(false)
  }

  const totalDuration = "5-7 dni roboczych"

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Proces realizacji remontu garażu</h1>
        <p className="text-lg text-gray-600">Kompleksowy remont z posadzką żywiczną</p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Całkowity czas realizacji: {totalDuration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button onClick={handlePlay} variant="default" size="lg">
          {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? "Pauza" : "Start"}
        </Button>
        <Button onClick={handleReset} variant="outline" size="lg">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div
          className="absolute left-8 top-0 w-0.5 bg-blue-500 transition-all duration-300"
          style={{
            height: `${(currentStep / (renovationSteps.length - 1)) * 100}%`,
          }}
        ></div>

        <div className="space-y-8">
          {renovationSteps.map((step, index) => (
            <div key={step.id} className="relative flex items-start gap-6">
              {/* Step indicator */}
              <div
                className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 cursor-pointer transition-all duration-300 ${
                  index <= currentStep
                    ? `${step.bgColor} border-current ${step.color}`
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
                onClick={() => handleStepClick(index)}
              >
                {step.icon}
              </div>

              {/* Step content */}
              <Card
                className={`flex-1 cursor-pointer transition-all duration-300 ${
                  index === currentStep ? "ring-2 ring-blue-500 shadow-lg" : index < currentStep ? "bg-gray-50" : ""
                }`}
                onClick={() => handleStepClick(index)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {step.id}. {step.title}
                      </CardTitle>
                      <CardDescription className="mt-1">{step.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {step.duration}
                      </Badge>
                      {index <= currentStep && (
                        <Badge variant="default" className="bg-green-500">
                          {index === currentStep ? "W trakcie" : "Ukończono"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <Wrench className="w-3 h-3 text-gray-400" />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {/* Progress bar for current step */}
                  {index === currentStep && isPlaying && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Postęp etapu</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Rezultat: Profesjonalna posadzka żywiczna</h3>
            <p className="text-gray-600">Trwała, odporna na ścieranie i łatwa w utrzymaniu powierzchnia garażowa</p>
            <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
              <span>✓ Odporność na oleje i chemikalia</span>
              <span>✓ Łatwe czyszczenie</span>
              <span>✓ Estetyczny wygląd</span>
              <span>✓ Długotrwałość</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
