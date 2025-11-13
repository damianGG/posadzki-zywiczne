import type { Metadata } from "next"
import { getAllRealizations, getFeaturedRealizations, getAllProjectTypes } from "@/lib/realizations"
import RealizationsGallery from "@/components/realizations-gallery"

export const metadata: Metadata = {
  title: "Nasze Realizacje | Posadzki Żywiczne",
  description: "Zobacz nasze zrealizowane projekty posadzek żywicznych - garaże, tarasy, balkony i obiekty przemysłowe. Portfolio wykonanych prac.",
  keywords: "realizacje posadzek, portfolio, garaże, tarasy, balkony, posadzki epoksydowe, posadzki poliuretanowe",
  openGraph: {
    title: "Nasze Realizacje | Posadzki Żywiczne",
    description: "Zobacz nasze zrealizowane projekty posadzek żywicznych - garaże, tarasy, balkony i obiekty przemysłowe.",
    type: "website",
    url: "https://posadzkizywiczne.com/realizacje",
  },
  alternates: {
    canonical: "https://posadzkizywiczne.com/realizacje",
  },
}

export const dynamic = "force-static"

export default function RealizationsPage() {
  const allRealizations = getAllRealizations()
  const featuredRealizations = getFeaturedRealizations()
  const projectTypes = getAllProjectTypes()

  return (
    <main>
      <RealizationsGallery
        allRealizations={allRealizations}
        featuredRealizations={featuredRealizations}
        projectTypes={projectTypes}
      />
    </main>
  )
}
