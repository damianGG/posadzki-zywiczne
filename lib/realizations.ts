import fs from "fs"
import path from "path"

export interface Realization {
  id: string
  title: string
  description: string
  content: string
  location: string
  area: string // m²
  realizationDate: string
  client?: string
  projectType: string // "garaż", "taras", "balkon", "przemysł", etc.
  surface: string // "epoksydowa", "poliuretanowa", etc.
  images: {
    url: string
    alt: string
    caption?: string
  }[]
  thumbnail: {
    url: string
    alt: string
  }
  tags: string[]
  featured: boolean
  status: "published" | "draft"
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    canonicalUrl: string
  }
}

const realizationsDirectory = path.join(process.cwd(), "data/realizacje")

export function getAllRealizations(): Realization[] {
  try {
    if (!fs.existsSync(realizationsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(realizationsDirectory)
    const allRealizations = fileNames
      .filter((fileName) => fileName.endsWith(".json"))
      .map((fileName) => {
        const id = fileName.replace(/\.json$/, "")
        const fullPath = path.join(realizationsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf8")
        const realizationData = JSON.parse(fileContents) as Realization

        return {
          ...realizationData,
          id,
        }
      })
      .filter((realization) => realization.status === "published")
      .sort((a, b) => new Date(b.realizationDate).getTime() - new Date(a.realizationDate).getTime())

    return allRealizations
  } catch (error) {
    console.error("Error reading realizations:", error)
    return []
  }
}

export function getRealizationBySlug(slug: string): Realization | null {
  try {
    const fullPath = path.join(realizationsDirectory, `${slug}.json`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const realizationData = JSON.parse(fileContents) as Realization

    if (realizationData.status !== "published") {
      return null
    }

    return {
      ...realizationData,
      id: slug,
    }
  } catch (error) {
    console.error(`Error reading realization ${slug}:`, error)
    return null
  }
}

export function getFeaturedRealizations(limit = 6): Realization[] {
  const allRealizations = getAllRealizations()
  return allRealizations.filter((realization) => realization.featured).slice(0, limit)
}

export function getRealizationsByType(projectType: string): Realization[] {
  const allRealizations = getAllRealizations()
  return allRealizations.filter((realization) => realization.projectType === projectType)
}

export function getAllProjectTypes(): string[] {
  const allRealizations = getAllRealizations()
  const types = allRealizations.map((realization) => realization.projectType)
  return Array.from(new Set(types))
}

export function getRealizationsByTag(tag: string): Realization[] {
  const allRealizations = getAllRealizations()
  return allRealizations.filter((realization) => realization.tags.includes(tag))
}

export function getAllGalleryImages(): { url: string; alt: string; caption?: string; realizationId: string; realizationTitle: string }[] {
  const allRealizations = getAllRealizations()
  const images: { url: string; alt: string; caption?: string; realizationId: string; realizationTitle: string }[] = []
  
  allRealizations.forEach((realization) => {
    realization.images.forEach((image) => {
      images.push({
        ...image,
        realizationId: realization.id,
        realizationTitle: realization.title,
      })
    })
  })
  
  return images
}
