"use client"

import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useMediaQuery } from 'react-responsive'
import { cn } from "@/lib/utils"

export const Case2 = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const isMobile = useMediaQuery({ maxWidth: 768 })

  useEffect(() => {
    if (!api) {
      return
    }

    const scrollNext = () => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        api.scrollTo(0)
        setCurrent(0)
      } else {
        api.scrollNext()
        setCurrent((prev) => prev + 1)
      }
    }

    const intervalId = setInterval(scrollNext, 3000)

    return () => clearInterval(intervalId)
  }, [api])

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <h3 className="text-xl tracking-tighter lg:max-w-xl font-regular text-left mb-12">
          Współpracujemy z najlepszymi
        </h3>
        <div className="gap-10 items-center">
          <div className="relative w-full col-span-4">
            <div className="bg-gradient-to-r from-background via-white/0 to-background z-10 absolute left-0 top-0 right-0 bottom-0 w-full h-full"></div>
            <Carousel
              setApi={setApi}
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {Array.from({ length: 25 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className={cn(
                      "basis-full md:basis-1/4 lg:basis-1/6",
                      isMobile ? "pl-4" : "pl-2"
                    )}
                  >
                    <div className="flex rounded-md aspect-square bg-muted items-center justify-center p-2">
                      <span className="text-sm">Logo {index + 1}</span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  )
}