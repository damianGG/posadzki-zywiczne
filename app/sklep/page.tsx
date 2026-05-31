import type { Metadata } from "next"

import StorefrontClient from "@/components/shop/storefront-client"
import {
  getActiveRoomVariants,
  getConfiguratorConfig,
  getFinishVariants,
  getStepSettings,
  getSubstrateOptions,
} from "@/lib/shop-configurator"
import { getBreadcrumbSchema } from "@/lib/structured-data"
import { getShopCatalog } from "@/lib/supabase-shop"

const defaultBaseUrl = "https://posadzkizywiczne.com"
const baseUrl = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? defaultBaseUrl)
  } catch {
    return new URL(defaultBaseUrl)
  }
})()
const shopUrl = new URL("/sklep", baseUrl).toString()

export const metadata: Metadata = {
  title: "Sklep z zestawami do posadzek żywicznych | Garaż, kotłownia, piwnica",
  description:
    "Skonfiguruj zestaw do posadzki żywicznej do garażu, kotłowni lub piwnicy. Wybierz podłoże, wariant wykończenia, kolor, metraż i od razu poznaj rekomendowany zestaw.",
  keywords: [
    "zestawy do posadzek żywicznych",
    "posadzka żywiczna do garażu",
    "zestaw żywicy do piwnicy",
    "zestaw żywicy do kotłowni",
    "konfigurator posadzki żywicznej",
  ],
  alternates: {
    canonical: "/sklep",
  },
  openGraph: {
    title: "Sklep z zestawami do posadzek żywicznych | Garaż, kotłownia, piwnica",
    description:
      "Skonfiguruj zestaw do posadzki żywicznej do garażu, kotłowni lub piwnicy. Dobierz wykończenie, kolor i metraż w prostym konfiguratorze.",
    url: "/sklep",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sklep z zestawami do posadzek żywicznych",
    description:
      "Dobierz zestaw do garażu, kotłowni lub piwnicy na podstawie podłoża, wykończenia, koloru i metrażu.",
  },
}

export default async function ShopPage() {
  const catalog = await getShopCatalog()
  const config = getConfiguratorConfig(catalog)
  const roomVariants = getActiveRoomVariants(config)
  const finishVariants = getFinishVariants(config)
  const substrateOptions = getSubstrateOptions(config)
  const visibleSteps = getStepSettings(config, true).filter((step) => step.id !== "result")
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Strona główna", url: baseUrl.toString() },
    { name: "Sklep", url: shopUrl },
  ])
  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sklep z zestawami do posadzek żywicznych",
    description: metadata.description,
    url: shopUrl,
    mainEntity: {
      "@type": "OfferCatalog",
      name: "Konfigurowalne zestawy do posadzek żywicznych",
      itemListElement: finishVariants.map((variant, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Offer",
          price: variant.price_from,
          priceCurrency: "PLN",
          availability: "https://schema.org/InStock",
          url: shopUrl,
          itemOffered: {
            "@type": "Product",
            name: variant.label,
            description: variant.description,
            category: "Zestawy do posadzek żywicznych",
          },
        },
      })),
    },
  }
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Jak dobrać zestaw do posadzki żywicznej?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Konfigurator prowadzi krok po kroku przez wybór pomieszczenia, podłoża, wariantu wykończenia, koloru, metrażu i cokołu, a na końcu pokazuje rekomendowany zestaw.",
        },
      },
      {
        "@type": "Question",
        name: "Czy zestaw uwzględnia zapas materiału?",
        acceptedAnswer: {
          "@type": "Answer",
          text: config.messages.result_allowance_message,
        },
      },
      {
        "@type": "Question",
        name: "Jakie pomieszczenia obsługuje konfigurator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: roomVariants.map((variant) => variant.label).join(", "),
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <StorefrontClient initialCatalog={catalog} />

      <section className="border-t border-zinc-200 bg-white py-14">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="space-y-10">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Zestawy do posadzek żywicznych do garażu, kotłowni i piwnicy
              </h2>
              <p className="text-base leading-7 text-zinc-600">
                Sklep pomaga dobrać zestaw do posadzki żywicznej w prostym, krokowym procesie. Użytkownik wybiera
                pomieszczenie, stan podłoża, wariant wykończenia, kolor i metraż, a następnie otrzymuje rekomendowany
                zestaw materiałów z informacją o orientacyjnym zużyciu.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 rounded-3xl border border-zinc-200 p-6">
                <h3 className="text-xl font-semibold">Dostępne warianty pomieszczeń</h3>
                <ul className="space-y-3 text-sm leading-6 text-zinc-600">
                  {roomVariants.map((variant) => (
                    <li key={variant.id}>
                      <span className="font-medium text-zinc-950">{variant.label}</span>
                      {variant.status_label ? ` — ${variant.status_label}. ` : ". "}
                      {variant.description}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 rounded-3xl border border-zinc-200 p-6">
                <h3 className="text-xl font-semibold">Warianty wykończenia posadzki</h3>
                <ul className="space-y-3 text-sm leading-6 text-zinc-600">
                  {finishVariants.map((variant) => (
                    <li key={variant.id}>
                      <span className="font-medium text-zinc-950">{variant.label}</span>
                      {` — od ${variant.price_from} ${variant.price_unit_label ?? "zł/m²"}. `}
                      {variant.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-zinc-200 p-6">
              <h3 className="text-xl font-semibold">Jak działa dobór zestawu</h3>
              <ol className="space-y-3 text-sm leading-6 text-zinc-600">
                {visibleSteps.map((step, index) => (
                  <li key={step.id}>
                    <span className="font-medium text-zinc-950">
                      {index + 1}. {step.question}
                    </span>
                    {step.description ? ` ${step.description}` : null}
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-4 rounded-3xl border border-zinc-200 p-6">
              <h3 className="text-xl font-semibold">Najczęściej wybierane typy podłoża</h3>
              <p className="text-sm leading-6 text-zinc-600">
                Konfigurator uwzględnia różne punkty startowe, w tym:{" "}
                {substrateOptions.map((option) => option.label.toLowerCase()).join(", ")}. Dzięki temu łatwiej dopasować
                zestaw do nowego betonu, starej posadzki, płytek lub powierzchni wymagającej bezpiecznego wariantu.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
