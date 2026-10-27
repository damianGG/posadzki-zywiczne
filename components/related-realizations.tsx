import Image from "next/image"
import Link from "next/link"
import { getAllRealizacje } from "@/lib/realizacje"
import type { Realizacja, RealizacjaCategory } from "@/types/realizacje"

interface RelatedRealizationsProps {
  category?: RealizacjaCategory
  city?: string
  title?: string
  limit?: number
}

/** Match only explicitly documented city names, not guessed travel radii. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\bmlp\.?\b/g, "malopolski")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function isInCity(project: Realizacja, city: string): boolean {
  const actual = normalize(project.location)
  const requested = normalize(city)
  // Compare the municipality/locality at the start of the provided location.
  // "pod Rzeszowem" and "okolice Rzeszowa" are NOT precise city matches.
  return actual === requested || actual.startsWith(requested + " ") ||
    actual.startsWith(requested + ",")
}

export default async function RelatedRealizations({
  category, city, title, limit = 3,
}: RelatedRealizationsProps) {
  const projects = await getAllRealizacje()
  const matching = projects
    .filter(project =>
      Boolean(project.slug && project.images.main) &&
      (!category || project.category === category) &&
      (!city || isInCity(project, city)),
    )
    .slice(0, Math.min(Math.max(limit, 1), 6))

  if (matching.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-12" aria-label="Powiązane realizacje">
      <div className="mb-6">
        <h2 className="text-2xl font-bold md:text-3xl">
          {title || (city ? "Udokumentowane realizacje — " + city : "Zobacz nasze realizacje")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Zdjęcia wykonanych prac z naszego portfolio. Szczegóły systemu i zakresu znajdują się w opisach projektów.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {matching.map(project => (
          <Link
            key={project.slug}
            href={"/realizacje/" + project.slug}
            className="group overflow-hidden rounded-xl border bg-background hover:border-primary"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={project.images.main}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="space-y-2 p-4">
              <h3 className="font-semibold leading-snug group-hover:text-primary">{project.title}</h3>
              <p className="text-sm text-muted-foreground">
                {project.location}
                {project.details.surface ? " · " + project.details.surface : ""}
              </p>
              {project.details.system && <p className="text-sm">{project.details.system}</p>}
            </div>
          </Link>
        ))}
      </div>
      <Link className="mt-6 inline-block font-semibold text-primary hover:underline" href="/realizacje">
        Wszystkie udokumentowane realizacje
      </Link>
    </section>
  )
}
