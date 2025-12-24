"use client"

import { Gift, Snowflake, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ContestHero() {
  return (
    <div className="w-full py-16 lg:py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <Snowflake className="absolute top-10 left-10 w-12 h-12 text-white animate-pulse" aria-hidden="true" />
        <Snowflake className="absolute top-20 right-20 w-16 h-16 text-white animate-pulse [animation-delay:0.5s]" aria-hidden="true" />
        <Snowflake className="absolute bottom-20 left-1/4 w-10 h-10 text-white animate-pulse [animation-delay:1s]" aria-hidden="true" />
        <Snowflake className="absolute bottom-10 right-1/3 w-14 h-14 text-white animate-pulse [animation-delay:1.5s]" aria-hidden="true" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10 px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <Snowflake className="w-12 h-12 text-white animate-pulse" aria-hidden="true" />
            <Gift className="w-16 h-16 text-white" aria-hidden="true" />
            <Snowflake className="w-12 h-12 text-white animate-pulse" aria-hidden="true" />
          </div>
          
          <Badge className="text-lg px-6 py-2 bg-white text-purple-600 hover:bg-white/90">
            Noworoczny Konkurs 2025/2026
          </Badge>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl">
            <span className="block">Wygraj Posadzkę Żywiczną</span>
            <span className="block text-yellow-300">o wartości 5000 zł!</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
            <span aria-label="Fajerwerki">🎆</span> Wejdź w Nowy Rok z szansą na wymarzoną posadzkę <span aria-label="Fajerwerki">🎇</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/konkurs">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-white/90">
                <Gift className="w-5 h-5 mr-2" />
                Weź udział w konkursie
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4">
              <Calendar className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm font-medium">Losowanie:</div>
                <div className="text-lg font-bold">10 stycznia 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
