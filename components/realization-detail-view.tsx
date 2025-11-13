"use client"

import { Realization } from "@/lib/realizations"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, Ruler, Tag } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface RealizationDetailViewProps {
  realization: Realization
}

export default function RealizationDetailView({ realization }: RealizationDetailViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={realization.thumbnail.url}
          alt={realization.thumbnail.alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl font-bold text-white md:text-5xl">{realization.title}</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* Info Cards */}
        <div className="mb-12 grid gap-4 md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Lokalizacja</p>
              <p className="font-semibold">{realization.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <Ruler className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Powierzchnia</p>
              <p className="font-semibold">{realization.area}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Data realizacji</p>
              <p className="font-semibold">
                {new Date(realization.realizationDate).toLocaleDateString("pl-PL", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <Tag className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Rodzaj</p>
              <p className="font-semibold capitalize">{realization.projectType}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-12">
          <p className="text-lg text-muted-foreground">{realization.description}</p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert mb-12 max-w-none">
          <ReactMarkdown>{realization.content}</ReactMarkdown>
        </div>

        {/* Image Gallery */}
        <div className="mb-12">
          <h2 className="mb-6 text-3xl font-bold">Galeria zdjęć</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {realization.images.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg border bg-card">
                <div className="relative aspect-video">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                {image.caption && (
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Tagi</h3>
          <div className="flex flex-wrap gap-2">
            {realization.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="mb-4 text-2xl font-bold">Zainteresowany podobnym projektem?</h3>
          <p className="mb-6 text-muted-foreground">
            Skontaktuj się z nami, aby omówić szczegóły Twojej realizacji
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Skontaktuj się
          </Link>
        </div>
      </div>
    </div>
  )
}
