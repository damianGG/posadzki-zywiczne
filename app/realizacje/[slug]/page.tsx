import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRealizationBySlug, getAllRealizations } from "@/lib/realizations"
import RealizationDetailView from "@/components/realization-detail-view"

interface RealizationPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const realizations = getAllRealizations()
  return realizations.map((realization) => ({
    slug: realization.id,
  }))
}

export async function generateMetadata({ params }: RealizationPageProps): Promise<Metadata> {
  const { slug } = await params
  const realization = getRealizationBySlug(slug)

  if (!realization) {
    return {
      title: "Realizacja nie znaleziona",
    }
  }

  return {
    title: realization.seo.metaTitle,
    description: realization.seo.metaDescription,
    keywords: realization.seo.keywords.join(", "),
    openGraph: {
      title: realization.title,
      description: realization.description,
      type: "article",
      url: realization.seo.canonicalUrl,
      images: [
        {
          url: realization.thumbnail.url,
          width: 1200,
          height: 630,
          alt: realization.thumbnail.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: realization.title,
      description: realization.description,
      images: [realization.thumbnail.url],
    },
    alternates: {
      canonical: realization.seo.canonicalUrl,
    },
  }
}

export const dynamic = "force-static"

export default async function RealizationPage({ params }: RealizationPageProps) {
  const { slug } = await params
  const realization = getRealizationBySlug(slug)

  if (!realization) {
    notFound()
  }

  return (
    <main>
      <RealizationDetailView realization={realization} />
    </main>
  )
}
