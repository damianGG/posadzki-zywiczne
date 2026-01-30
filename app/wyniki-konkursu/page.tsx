"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Trophy, Instagram, Snowflake } from "lucide-react"
import SnowfallAnimation from "@/components/snowfall-animation"

export default function WynikiKonkursuPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <SnowfallAnimation />
      
      {/* Header Section */}
      <div className="w-full py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-10"></div>
        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-3">
              <Snowflake className="w-12 h-12 text-blue-600 animate-pulse" />
              <Trophy className="w-16 h-16 text-yellow-500" />
              <Snowflake className="w-12 h-12 text-blue-600 animate-pulse" />
            </div>
            <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
              Wyniki Konkursu 2026
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Gratulacje Zwycięzcy!
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl">
              🎉 Poznaj szczęśliwca, który wygrał posadzkę żywiczną o wartości 5000 zł! 🎊
            </p>
          </div>
        </div>
      </div>

      {/* Winner Section */}
      <div className="w-full py-12 lg:py-20">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border-2 border-purple-100">
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🏆 Zwycięzca Konkursu
              </h2>
            </div>
            
            {/* Winner Details */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 lg:p-12 mb-8">
              <div className="space-y-6">
                {/* Winner Name */}
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-2">Zwycięzca konkursu:</p>
                  <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Aleksandra
                  </p>
                </div>
                
                {/* Winner Code */}
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-2">Kod zwycięski:</p>
                  <div className="bg-white rounded-lg p-6 inline-block">
                    <p className="text-3xl md:text-4xl font-bold text-purple-600 font-mono tracking-wider">
                      G957Z
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prize Details */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
              <div className="text-center">
                <Gift className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Szczegóły nagrody</h3>
                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-600 mb-1">5000 zł</div>
                    <p className="text-gray-700 text-sm">Wartość posadzki żywicznej</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-xl font-bold text-purple-600 mb-1">Dowolne pomieszczenie</div>
                    <p className="text-gray-700 text-sm">Garaż, kotłownia lub mieszkalne</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-600 mb-1">6 miesięcy</div>
                    <p className="text-gray-700 text-sm">Ważność nagrody</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Link */}
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-4">
                Zobacz nagranie z losowania na naszym Instagramie!
              </p>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg px-8 py-6"
                asChild
              >
                <a
                  href="https://www.instagram.com/reel/DUJjZHnju4l/?igsh=MTIyeGlnOTF2bnNsZQ%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Instagram className="w-6 h-6" />
                  Zobacz losowanie na Instagram
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Section */}
      <div className="w-full py-12 lg:py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Dziękujemy za udział!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Dziękujemy wszystkim uczestnikom za wzięcie udziału w naszym konkursie. 
              Jeśli nie wygrałeś tym razem, nie martw się – będą jeszcze inne okazje!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="text-lg"
                asChild
              >
                <a href="/">Wróć do strony głównej</a>
              </Button>
              <Button
                size="lg"
                className="text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                asChild
              >
                <a href="/kontakt">Skontaktuj się z nami</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
