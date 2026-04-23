"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Package,
  Palette,
  ShoppingCart,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  calculateBundleTotal,
  calculateProductTotal,
  formatProductPricing,
  getAvailableBundles,
  getCartSummary,
  getRecommendedProducts,
  getRoomTypeLabel,
  resolveBundleItems,
} from "@/lib/shop-engine"
import { ShopCatalog } from "@/types/shop"

interface StorefrontClientProps {
  initialCatalog: ShopCatalog
}

type ConfigStepId = "system" | "color" | "flakes" | "accessories" | "contact"

interface VisualOption {
  id: string
  name: string
  description: string
  hex: string
  gradient: string
  textClass: string
}

const formatCurrency = (value: number) => `${value.toFixed(2)} zł`

const CONFIG_STEPS: Array<{
  id: ConfigStepId
  title: string
  shortTitle: string
  description: string
  icon: typeof Palette
}> = [
  {
    id: "system",
    title: "Rodzaj systemu żywicy",
    shortTitle: "System",
    description: "Wybierz wariant zestawu i bazowy zakres metrażu.",
    icon: Droplets,
  },
  {
    id: "color",
    title: "Kolor bazowy posadzki",
    shortTitle: "Kolor",
    description: "Tak jak w konfiguratorze Tesli — zmiana opcji od razu zmienia wizualizację po lewej stronie.",
    icon: Palette,
  },
  {
    id: "flakes",
    title: "Kolor płatków dekoracyjnych",
    shortTitle: "Płatki",
    description: "Dodaj płatki i zobacz na podglądzie, jak zmienia się finalny charakter posadzki.",
    icon: Sparkles,
  },
  {
    id: "accessories",
    title: "Akcesoria dodatkowe",
    shortTitle: "Akcesoria",
    description: "Dobierz dodatki techniczne i wykończeniowe bez naruszania obecnego CMS-a.",
    icon: ShoppingCart,
  },
  {
    id: "contact",
    title: "Podsumowanie i zapytanie",
    shortTitle: "Kontakt",
    description: "Na końcu klient wysyła gotową konfigurację jako zapytanie zakupowe.",
    icon: Package,
  },
]

const BASE_COLORS: VisualOption[] = [
  {
    id: "jasny-szary",
    name: "Jasny szary",
    description: "Najbezpieczniejsza opcja do garaży domowych i piwnic.",
    hex: "#D7DCE2",
    gradient: "linear-gradient(135deg, #f2f4f7 0%, #d7dce2 55%, #bcc5cf 100%)",
    textClass: "text-zinc-900",
  },
  {
    id: "stalowy",
    name: "Stalowy szary",
    description: "Bardziej techniczny wygląd z lekkim kontrastem zabrudzeń.",
    hex: "#AAB5C2",
    gradient: "linear-gradient(135deg, #d7dde6 0%, #aab5c2 50%, #7d8896 100%)",
    textClass: "text-zinc-900",
  },
  {
    id: "grafit",
    name: "Grafit",
    description: "Wyrazisty, ciemniejszy wariant dobrze pasujący do premium.",
    hex: "#545C67",
    gradient: "linear-gradient(135deg, #7a838f 0%, #545c67 50%, #2d3238 100%)",
    textClass: "text-white",
  },
]

const FLAKE_COLORS: VisualOption[] = [
  {
    id: "bez-platkow",
    name: "Bez płatków",
    description: "Gładka, jednolita posadzka bez dekoracyjnego wysypu.",
    hex: "transparent",
    gradient: "transparent",
    textClass: "text-zinc-900",
  },
  {
    id: "srebrne",
    name: "Srebrne płatki",
    description: "Neutralne płatki dobrze współgrające z klasycznymi szarościami.",
    hex: "#F2F4F8",
    gradient: "linear-gradient(135deg, #ffffff 0%, #f2f4f8 100%)",
    textClass: "text-zinc-900",
  },
  {
    id: "grafitowe",
    name: "Grafitowe płatki",
    description: "Mocniejszy, bardziej kontrastowy efekt techniczny.",
    hex: "#3C4653",
    gradient: "linear-gradient(135deg, #5f6978 0%, #3c4653 100%)",
    textClass: "text-white",
  },
  {
    id: "piaskowe",
    name: "Piaskowe płatki",
    description: "Cieplejsza dekoracja do bardziej mieszkalnego charakteru przestrzeni.",
    hex: "#D8C3A5",
    gradient: "linear-gradient(135deg, #efe3d1 0%, #d8c3a5 100%)",
    textClass: "text-zinc-900",
  },
]

const PREVIEW_PARTICLES = [
  { top: "12%", left: "18%", size: 12 },
  { top: "18%", left: "72%", size: 8 },
  { top: "24%", left: "38%", size: 10 },
  { top: "30%", left: "84%", size: 6 },
  { top: "36%", left: "16%", size: 9 },
  { top: "42%", left: "56%", size: 12 },
  { top: "48%", left: "76%", size: 7 },
  { top: "54%", left: "28%", size: 8 },
  { top: "62%", left: "66%", size: 10 },
  { top: "70%", left: "18%", size: 7 },
  { top: "76%", left: "48%", size: 11 },
  { top: "82%", left: "80%", size: 8 },
] as const

function getOptionById(options: VisualOption[], id: string) {
  return options.find((option) => option.id === id) ?? options[0]
}

export default function StorefrontClient({ initialCatalog }: StorefrontClientProps) {
  const roomTypes = useMemo(() => {
    const unique = Array.from(new Set(initialCatalog.bundles.map((bundle) => bundle.room_type)))
    return unique.length ? unique : ["garaz"]
  }, [initialCatalog.bundles])

  const [roomType, setRoomType] = useState(roomTypes[0] ?? "garaz")
  const [area, setArea] = useState(24)
  const [activeStep, setActiveStep] = useState<ConfigStepId>("system")
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null)
  const [selectedBaseColorId, setSelectedBaseColorId] = useState(BASE_COLORS[0].id)
  const [selectedFlakeColorId, setSelectedFlakeColorId] = useState(FLAKE_COLORS[0].id)
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([])
  const [formState, setFormState] = useState({
    customerName: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [submitState, setSubmitState] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const availableBundles = useMemo(
    () => getAvailableBundles(initialCatalog, roomType, area),
    [area, initialCatalog, roomType]
  )

  const bundleProductIds = useMemo(
    () => new Set((availableBundles.find((bundle) => bundle.variant_id === selectedBundleId)?.included_items ?? []).map((item) => item.product_id)),
    [availableBundles, selectedBundleId]
  )

  const recommendedAddOnIds = useMemo(
    () => new Set(getRecommendedProducts(initialCatalog, roomType, area, selectedBundleId).map((product) => product.product_id)),
    [area, initialCatalog, roomType, selectedBundleId]
  )

  const availableAddOns = useMemo(
    () =>
      initialCatalog.products
        .filter((product) => product.is_active !== false)
        .filter((product) => !bundleProductIds.has(product.product_id))
        .filter(
          (product) =>
            !product.applicable_room_types || product.applicable_room_types.length === 0 || product.applicable_room_types.includes(roomType)
        )
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
    [bundleProductIds, initialCatalog.products, roomType]
  )

  const decorativeFlakesProduct = useMemo(
    () => initialCatalog.products.find((product) => product.product_id === "platki-dekoracyjne") ?? null,
    [initialCatalog.products]
  )

  const accessoryProducts = useMemo(
    () => availableAddOns.filter((product) => product.product_id !== decorativeFlakesProduct?.product_id),
    [availableAddOns, decorativeFlakesProduct?.product_id]
  )

  const cartSummary = useMemo(
    () => getCartSummary(initialCatalog, roomType, area, selectedBundleId, selectedAddOnIds),
    [area, initialCatalog, roomType, selectedAddOnIds, selectedBundleId]
  )

  const selectedBundle = cartSummary.selectedBundle
  const selectedBaseColor = getOptionById(BASE_COLORS, selectedBaseColorId)
  const selectedFlakeColor = getOptionById(FLAKE_COLORS, selectedFlakeColorId)
  const activeStepIndex = CONFIG_STEPS.findIndex((step) => step.id === activeStep)
  const currentStep = CONFIG_STEPS[activeStepIndex] ?? CONFIG_STEPS[0]
  const flakesIncludedInBundle = bundleProductIds.has("platki-dekoracyjne")
  const visibleFlakeOptions = flakesIncludedInBundle ? FLAKE_COLORS.filter((option) => option.id !== "bez-platkow") : FLAKE_COLORS
  const selectedAddOnProducts = availableAddOns.filter((product) => selectedAddOnIds.includes(product.product_id))
  const canGoNext = activeStep !== "contact" && (activeStep !== "system" || Boolean(selectedBundleId))
  const hasPreviewImage = Boolean(selectedBundle?.image_url && selectedBundle.image_url !== "/placeholder.svg")

  useEffect(() => {
    if (!availableBundles.length) {
      setSelectedBundleId(null)
      setActiveStep("system")
      return
    }

    if (!selectedBundleId || !availableBundles.some((bundle) => bundle.variant_id === selectedBundleId)) {
      setSelectedBundleId(availableBundles[0].variant_id)
    }
  }, [availableBundles, selectedBundleId])

  useEffect(() => {
    const allowed = new Set(availableAddOns.map((product) => product.product_id))
    setSelectedAddOnIds((current) => current.filter((id) => allowed.has(id)))
  }, [availableAddOns])

  useEffect(() => {
    if (flakesIncludedInBundle && selectedFlakeColorId === "bez-platkow") {
      setSelectedFlakeColorId(FLAKE_COLORS[1].id)
    }

    if (!decorativeFlakesProduct || flakesIncludedInBundle) {
      return
    }

    setSelectedAddOnIds((current) => {
      const hasFlakes = current.includes(decorativeFlakesProduct.product_id)
      const shouldHaveFlakes = selectedFlakeColorId !== "bez-platkow"

      if (shouldHaveFlakes && !hasFlakes) {
        return [...current, decorativeFlakesProduct.product_id]
      }

      if (!shouldHaveFlakes && hasFlakes) {
        return current.filter((id) => id !== decorativeFlakesProduct.product_id)
      }

      return current
    })
  }, [decorativeFlakesProduct, flakesIncludedInBundle, selectedFlakeColorId])

  const handleAddOnToggle = (productId: string) => {
    setSelectedAddOnIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    )
  }

  const goToNextStep = () => {
    if (!canGoNext) {
      return
    }

    setActiveStep(CONFIG_STEPS[Math.min(activeStepIndex + 1, CONFIG_STEPS.length - 1)].id)
  }

  const goToPreviousStep = () => {
    setActiveStep(CONFIG_STEPS[Math.max(activeStepIndex - 1, 0)].id)
  }

  const handleBundleSelect = (bundleId: string) => {
    setSelectedBundleId(bundleId)
    if (activeStep === "system") {
      setActiveStep("color")
    }
  }

  const handleSubmitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedBundleId) {
      setSubmitState({ type: "error", message: "Najpierw wybierz zestaw." })
      return
    }

    setSubmitting(true)
    setSubmitState(null)

    try {
      const response = await fetch("/api/shop/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          roomType,
          area,
          bundleId: selectedBundleId,
          addOnProductIds: selectedAddOnIds,
          baseColorId: selectedBaseColor.id,
          baseColorName: selectedBaseColor.name,
          flakeColorId: selectedFlakeColor.id,
          flakeColorName: selectedFlakeColor.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Nie udało się wysłać zapytania")
      }

      setSubmitState({ type: "success", message: data.message || "Zapytanie zostało wysłane." })
      setFormState({ customerName: "", email: "", phone: "", notes: "" })
      setSelectedAddOnIds([])
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "Nie udało się wysłać zapytania",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-zinc-950 text-white pb-20 pt-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 max-w-4xl space-y-4">
          <Badge className="bg-white/10 text-white hover:bg-white/10">Nowy konfigurator zakupowy</Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Skonfiguruj zestaw żywicy w układzie krok po kroku — jak przy zakupie auta
          </h1>
          <p className="text-lg text-zinc-300">
            Po lewej stronie podgląd zmienia się razem z etapem konfiguracji. Po prawej klient przechodzi przez wybór
            systemu, koloru, płatków, akcesoriów i finalnego zapytania.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] xl:gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Podgląd konfiguracji</p>
                  <p className="mt-2 text-2xl font-semibold">{currentStep.title}</p>
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white">
                  Krok {activeStepIndex + 1} / {CONFIG_STEPS.length}
                </Badge>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                <div className="absolute inset-0" style={{ background: selectedBaseColor.gradient }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.32),_transparent_45%)]" />
                {hasPreviewImage && selectedBundle?.image_url ? (
                  <Image
                    src={selectedBundle.image_url}
                    alt={selectedBundle.name}
                    fill
                    className="object-cover opacity-20 mix-blend-soft-light"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                ) : null}
                {(selectedFlakeColor.id !== "bez-platkow" || flakesIncludedInBundle) && (
                  <div className="absolute inset-0">
                    {PREVIEW_PARTICLES.map((particle, index) => (
                      <span
                        key={`${particle.top}-${particle.left}-${index}`}
                        className="absolute rounded-full opacity-80 shadow-[0_0_18px_rgba(255,255,255,0.2)]"
                        style={{
                          top: particle.top,
                          left: particle.left,
                          width: `${particle.size}px`,
                          height: `${particle.size}px`,
                          backgroundColor: selectedFlakeColor.id === "bez-platkow" ? "#ffffff" : selectedFlakeColor.hex,
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="absolute left-5 right-5 top-5 rounded-2xl border border-white/15 bg-black/30 px-4 py-3 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-300">Etap aktywny</p>
                  <p className="mt-1 text-lg font-semibold">{currentStep.shortTitle}</p>
                </div>

                <div className="absolute bottom-5 left-5 right-5 space-y-4 rounded-[24px] border border-white/15 bg-black/45 p-5 backdrop-blur-md">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/10 text-white hover:bg-white/10">{selectedBundle?.short_name || "Wybierz system"}</Badge>
                    <Badge className="bg-white/10 text-white hover:bg-white/10">{selectedBaseColor.name}</Badge>
                    <Badge className="bg-white/10 text-white hover:bg-white/10">
                      {selectedFlakeColor.id === "bez-platkow" && !flakesIncludedInBundle ? "Bez płatków" : selectedFlakeColor.name}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-2xl font-semibold">{selectedBundle?.name || "Brak wybranego zestawu"}</p>
                    <p className="mt-1 text-sm text-zinc-300">
                      {selectedBundle?.description || "Zacznij od wyboru systemu żywicy, aby zobaczyć kompletny podgląd."}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-zinc-300">Metraż</p>
                      <p className="mt-2 text-xl font-semibold">{area.toFixed(1)} m²</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-zinc-300">Szacowana wartość</p>
                      <p className="mt-2 text-xl font-semibold">{formatCurrency(cartSummary.total)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-zinc-200">
                    {selectedAddOnProducts.length ? (
                      selectedAddOnProducts.map((product) => (
                        <span key={product.product_id} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                          {product.name}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                        Dodatki dobierzesz w kolejnym kroku
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-3">
              <div className="grid gap-3 md:grid-cols-5">
                {CONFIG_STEPS.map((step, index) => {
                  const Icon = step.icon
                  const isActive = step.id === activeStep
                  const isDone = index < activeStepIndex

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStep(step.id)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        isActive
                          ? "border-white/30 bg-white text-zinc-950"
                          : isDone
                            ? "border-emerald-400/40 bg-emerald-500/10 text-white"
                            : "border-white/10 bg-transparent text-zinc-300 hover:border-white/20 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10">
                          {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.25em]">0{index + 1}</span>
                      </div>
                      <p className="font-semibold">{step.shortTitle}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <Card className="rounded-[32px] border-white/10 bg-white text-zinc-950 shadow-2xl shadow-black/10">
              <CardHeader className="space-y-3 border-b border-zinc-200/70 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-3xl">{currentStep.title}</CardTitle>
                    <CardDescription className="mt-2 max-w-2xl text-base text-zinc-600">{currentStep.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-zinc-300 text-zinc-600">
                    {currentStep.shortTitle}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-6 md:p-8">
                {activeStep === "system" && (
                  <div className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
                      <div className="space-y-3">
                        <Label>Typ pomieszczenia</Label>
                        <div className="flex flex-wrap gap-2">
                          {roomTypes.map((entry) => {
                            const active = entry === roomType
                            return (
                              <Button
                                key={entry}
                                type="button"
                                variant={active ? "default" : "outline"}
                                onClick={() => setRoomType(entry)}
                              >
                                {getRoomTypeLabel(entry)}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="shop-area">Metraż</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="shop-area"
                            type="number"
                            min={1}
                            value={area}
                            onChange={(event) => setArea(Math.max(1, Number(event.target.value) || 1))}
                          />
                          <span className="whitespace-nowrap text-sm text-zinc-500">m²</span>
                        </div>
                      </div>
                    </div>

                    {!availableBundles.length && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        Brak wariantu dla podanego progu. Zmień metraż albo dodaj kolejny zestaw w panelu admina sklepu.
                      </div>
                    )}

                    <div className="grid gap-5 xl:grid-cols-3">
                      {availableBundles.map((bundle) => {
                        const isSelected = bundle.variant_id === selectedBundleId
                        const items = resolveBundleItems(bundle, initialCatalog.products, area)
                        return (
                          <Card
                            key={bundle.variant_id}
                            className={`overflow-hidden border-2 transition ${
                              isSelected ? "border-zinc-950 shadow-xl" : "border-zinc-200"
                            }`}
                          >
                            <div className="relative h-44 overflow-hidden bg-zinc-100">
                              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500" />
                              {bundle.image_url && bundle.image_url !== "/placeholder.svg" ? (
                                <Image
                                  src={bundle.image_url}
                                  alt={bundle.name}
                                  fill
                                  className="object-cover mix-blend-multiply opacity-80"
                                  sizes="(max-width: 1280px) 100vw, 33vw"
                                />
                              ) : null}
                              <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                                {bundle.short_name || bundle.name}
                              </div>
                            </div>
                            <CardHeader>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <CardTitle>{bundle.name}</CardTitle>
                                  <CardDescription>{bundle.description}</CardDescription>
                                </div>
                                <Badge variant="secondary">
                                  {bundle.coverage_to_m2 == null ? `od ${bundle.coverage_from_m2} m²` : `${bundle.coverage_from_m2}–${bundle.coverage_to_m2} m²`}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-5">
                              <div className="rounded-2xl bg-zinc-100 p-4">
                                <p className="text-sm text-zinc-500">Cena dla {area.toFixed(1)} m²</p>
                                <p className="text-3xl font-semibold text-zinc-900">{formatCurrency(calculateBundleTotal(bundle, area))}</p>
                                <p className="text-sm text-zinc-500">
                                  {bundle.price_per_m2.toFixed(0)} zł / m² + baza {bundle.base_price.toFixed(0)} zł
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(bundle.highlights ?? []).map((highlight) => (
                                  <Badge key={highlight} variant="outline">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                              <div className="space-y-2 text-sm text-zinc-600">
                                {items.slice(0, 4).map((item) => (
                                  <div key={`${bundle.variant_id}-${item.product_id}`} className="flex justify-between gap-3">
                                    <span>{item.product?.name || item.product_id}</span>
                                    <span className="whitespace-nowrap">
                                      {item.quantity.toFixed(1)} {item.unit_label || item.product?.unit_label || ""}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <Button
                                className="w-full"
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => handleBundleSelect(bundle.variant_id)}
                              >
                                {isSelected ? "Wybrany system" : bundle.cta_label || "Wybierz wariant"}
                              </Button>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeStep === "color" && (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      {BASE_COLORS.map((color) => {
                        const isSelected = color.id === selectedBaseColor.id
                        return (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => setSelectedBaseColorId(color.id)}
                            className={`rounded-[28px] border-2 p-4 text-left transition ${
                              isSelected ? "border-zinc-950 shadow-xl" : "border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            <div className="mb-4 h-40 rounded-[20px] border border-black/5" style={{ background: color.gradient }} />
                            <p className="text-xl font-semibold">{color.name}</p>
                            <p className="mt-2 text-sm text-zinc-600">{color.description}</p>
                          </button>
                        )
                      })}
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
                      Kolor bazowy nie zmienia ceny w MVP — służy do lepszego przygotowania oferty i wizualizacji.
                    </div>
                  </div>
                )}

                {activeStep === "flakes" && (
                  <div className="space-y-6">
                    {flakesIncludedInBundle ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                        W wybranym systemie płatki dekoracyjne są już w cenie. Na tym etapie wybierasz jedynie ich wygląd.
                      </div>
                    ) : decorativeFlakesProduct ? (
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                        Wybranie płatków automatycznie doda do zapytania produkt „{decorativeFlakesProduct.name}” ({formatProductPricing(decorativeFlakesProduct)}).
                      </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {visibleFlakeOptions.map((color) => {
                        const isSelected = color.id === selectedFlakeColor.id
                        return (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => setSelectedFlakeColorId(color.id)}
                            className={`rounded-[28px] border-2 p-4 text-left transition ${
                              isSelected ? "border-zinc-950 shadow-xl" : "border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            <div
                              className="relative mb-4 h-36 overflow-hidden rounded-[20px] border border-black/5"
                              style={{ background: selectedBaseColor.gradient }}
                            >
                              {color.id !== "bez-platkow" && (
                                <>
                                  {PREVIEW_PARTICLES.slice(0, 8).map((particle, index) => (
                                    <span
                                      key={`${color.id}-${particle.top}-${particle.left}-${index}`}
                                      className="absolute rounded-full opacity-80"
                                      style={{
                                        top: particle.top,
                                        left: particle.left,
                                        width: `${particle.size}px`,
                                        height: `${particle.size}px`,
                                        backgroundColor: color.hex,
                                      }}
                                    />
                                  ))}
                                </>
                              )}
                            </div>
                            <p className="text-lg font-semibold">{color.name}</p>
                            <p className="mt-2 text-sm text-zinc-600">{color.description}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeStep === "accessories" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                      Płatki dekoracyjne są sterowane w poprzednim kroku. Tutaj zostawiamy akcesoria i dodatki techniczne.
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      {accessoryProducts.map((product) => {
                        const checked = selectedAddOnIds.includes(product.product_id)
                        const recommended = recommendedAddOnIds.has(product.product_id)

                        return (
                          <Card key={product.product_id} className={checked ? "border-zinc-950 shadow-lg" : "border-zinc-200"}>
                            <CardContent className="flex gap-4 py-5">
                              <Checkbox checked={checked} onCheckedChange={() => handleAddOnToggle(product.product_id)} className="mt-1" />
                              <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="font-semibold text-zinc-900">{product.name}</p>
                                      {recommended ? <Badge variant="outline">Polecane</Badge> : null}
                                    </div>
                                    <p className="mt-2 text-sm text-zinc-600">{product.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-zinc-900">{formatCurrency(calculateProductTotal(product, area))}</p>
                                    <p className="text-xs text-zinc-500">{formatProductPricing(product)}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500">
                                  <span>Kategoria: {product.category}</span>
                                  <span>{checked ? "Dodano do zapytania" : "Opcjonalny dodatek"}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                    {!accessoryProducts.length && (
                      <Card>
                        <CardContent className="py-10 text-center text-zinc-500">
                          Brak dodatkowych akcesoriów dla obecnej konfiguracji.
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {activeStep === "contact" && (
                  <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card className="border-zinc-200 bg-zinc-50">
                      <CardHeader>
                        <CardTitle className="text-xl">Podsumowanie konfiguracji</CardTitle>
                        <CardDescription>To jest finalna wersja, którą wyślesz do wyceny/zamówienia.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm text-zinc-700">
                        <div className="flex justify-between gap-4">
                          <span>Pomieszczenie</span>
                          <span className="font-medium text-zinc-950">{getRoomTypeLabel(roomType)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Metraż</span>
                          <span className="font-medium text-zinc-950">{area.toFixed(1)} m²</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>System żywicy</span>
                          <span className="font-medium text-zinc-950">{selectedBundle?.name || "Brak"}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Kolor bazowy</span>
                          <span className="font-medium text-zinc-950">{selectedBaseColor.name}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Płatki dekoracyjne</span>
                          <span className="font-medium text-zinc-950">
                            {selectedFlakeColor.id === "bez-platkow" && !flakesIncludedInBundle ? "Bez płatków" : selectedFlakeColor.name}
                          </span>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                          <p className="font-medium text-zinc-950">Dodatki i akcesoria</p>
                          {selectedAddOnProducts.length ? (
                            selectedAddOnProducts.map((product) => (
                              <div key={product.product_id} className="flex justify-between gap-4">
                                <span>{product.name}</span>
                                <span className="font-medium text-zinc-950">{formatCurrency(calculateProductTotal(product, area))}</span>
                              </div>
                            ))
                          ) : (
                            <p>Brak dodatkowych akcesoriów.</p>
                          )}
                        </div>
                        <Separator />
                        <div className="flex justify-between gap-4 text-base font-semibold text-zinc-950">
                          <span>Orientacyjna wartość</span>
                          <span>{formatCurrency(cartSummary.total)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <form className="space-y-4" onSubmit={handleSubmitInquiry}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="customerName">Imię i nazwisko</Label>
                          <Input
                            id="customerName"
                            value={formState.customerName}
                            onChange={(event) => setFormState((current) => ({ ...current, customerName: event.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formState.email}
                            onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefon</Label>
                          <Input
                            id="phone"
                            value={formState.phone}
                            onChange={(event) => setFormState((current) => ({ ...current, phone: event.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Uwagi</Label>
                        <Textarea
                          id="notes"
                          value={formState.notes}
                          onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
                          placeholder="Np. termin realizacji, preferencja wykończenia albo pytanie o dostawę"
                        />
                      </div>
                      {submitState && (
                        <div
                          className={`rounded-lg border p-3 text-sm ${
                            submitState.type === "success"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-red-200 bg-red-50 text-red-700"
                          }`}
                        >
                          {submitState.message}
                        </div>
                      )}
                      <Button className="w-full" type="submit" disabled={submitting || !selectedBundleId}>
                        {submitting ? "Wysyłanie..." : "Wyślij zapytanie o skonfigurowany zestaw"}
                      </Button>
                    </form>
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="button" variant="ghost" className="gap-2" onClick={goToPreviousStep} disabled={activeStepIndex === 0}>
                    <ChevronLeft className="h-4 w-4" />
                    Wstecz
                  </Button>
                  {activeStep !== "contact" ? (
                    <Button type="button" className="gap-2" onClick={goToNextStep} disabled={!canGoNext}>
                      Dalej
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
