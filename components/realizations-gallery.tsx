"use client"

import { Realization } from "@/lib/realizations"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { MapPin, Calendar, Ruler } from "lucide-react"

interface RealizationsGalleryProps {
  allRealizations: Realization[]
  featuredRealizations: Realization[]
  projectTypes: string[]
}

export default function RealizationsGallery({
  allRealizations,
  featuredRealizations,
  projectTypes,
}: RealizationsGalleryProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredRealizations = selectedType
    ? allRealizations.filter((r) => r.projectType === selectedType)
    : allRealizations

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Nasze Realizacje</h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Zobacz przykłady naszych prac - posadzki żywiczne w garażach, na tarasach, balkonach i
            obiektach przemysłowych
          </p>
        </div>
      </div>

      {/* Featured Section */}
      {featuredRealizations.length > 0 && (
        <div className="border-b bg-muted/30 py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-8 text-3xl font-bold">Wyróżnione realizacje</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredRealizations.map((realization) => (
                <RealizationCard key={realization.id} realization={realization} featured />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Gallery Section */}
      <div className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedType === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Wszystkie
              </button>
              {projectTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRealizations.map((realization) => (
              <RealizationCard key={realization.id} realization={realization} />
            ))}
          </div>

          {filteredRealizations.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                Brak realizacji dla wybranej kategorii
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface RealizationCardProps {
  realization: Realization
  featured?: boolean
}

function RealizationCard({ realization, featured = false }: RealizationCardProps) {
  return (
    <Link
      href={`/realizacje/${realization.id}`}
      className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={realization.thumbnail.url}
          alt={realization.thumbnail.alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {featured && (
          <div className="absolute right-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Wyróżnione
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">{realization.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{realization.description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{realization.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ruler className="h-4 w-4" />
            <span>{realization.area}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(realization.realizationDate).toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
            {realization.projectType}
          </span>
        </div>
      </div>
    </Link>
  )
}
