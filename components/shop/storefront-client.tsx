"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Package, ShoppingCart, Sparkles } from "lucide-react"

import {
  calculateBundleTotal,
  calculateProductTotal,
  formatProductPricing,
  getAvailableBundles,
  getCartSummary,
  getRecommendationCopy,
  getRecommendedProducts,
  getRoomTypeLabel,
  resolveBundleItems,
} from "@/lib/shop-engine"
import { ShopCatalog } from "@/types/shop"

interface StorefrontClientProps {
  initialCatalog: ShopCatalog
}

const formatCurrency = (value: number) => `${value.toFixed(2)} zł`

const formatCoverage = (from: number, to?: number | null) => {
  if (to == null) {
    return `od ${from} m²`
  }

  return `${from}–${to} m²`
}

export default function StorefrontClient({ initialCatalog }: StorefrontClientProps) {
  const roomTypes = useMemo(() => {
    const unique = Array.from(new Set(initialCatalog.bundles.map((bundle) => bundle.room_type)))
    return unique.length ? unique : ["garaz"]
  }, [initialCatalog.bundles])

  const [roomType, setRoomType] = useState(roomTypes[0] ?? "garaz")
  const [area, setArea] = useState(24)
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null)
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

  const recommendationCopy = useMemo(
    () => getRecommendationCopy(initialCatalog, roomType, area),
    [area, initialCatalog, roomType]
  )

  const recommendedProducts = useMemo(
    () => getRecommendedProducts(initialCatalog, roomType, area, selectedBundleId),
    [area, initialCatalog, roomType, selectedBundleId]
  )

  const cartSummary = useMemo(
    () => getCartSummary(initialCatalog, roomType, area, selectedBundleId, selectedAddOnIds),
    [area, initialCatalog, roomType, selectedAddOnIds, selectedBundleId]
  )

  useEffect(() => {
    if (!availableBundles.length) {
      setSelectedBundleId(null)
      return
    }

    if (!selectedBundleId || !availableBundles.some((bundle) => bundle.variant_id === selectedBundleId)) {
      setSelectedBundleId(availableBundles[0].variant_id)
    }
  }, [availableBundles, selectedBundleId])

  useEffect(() => {
    const allowed = new Set(recommendedProducts.map((product) => product.product_id))
    setSelectedAddOnIds((current) => current.filter((id) => allowed.has(id)))
  }, [recommendedProducts])

  const handleAddOnToggle = (productId: string) => {
    setSelectedAddOnIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    )
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
    <div className="bg-zinc-50 pt-10 pb-20">
      <div className="container mx-auto px-4 space-y-10">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start pt-8">
          <div className="space-y-5">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Sklep MVP</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
              Dobierz zestaw do garażu lub piwnicy bez zewnętrznego silnika e-commerce
            </h1>
            <p className="text-lg text-zinc-600 max-w-2xl">
              Wykorzystujemy logikę podobną do kalkulatora: wybierasz pomieszczenie i metraż, a system pokazuje gotowe
              warianty zestawów oraz ręcznie ustawione rekomendacje dodatkowych produktów.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">1. Metraż</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-600">Dobór zestawu zaczyna się od wielkości garażu.</CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">2. Wariant</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-600">Porównujesz 2–3 warianty pod kątem trwałości i ceny.</CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">3. Zapytanie</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-600">Zamiast pełnego checkoutu wysyłasz koszyk do kontaktu.</CardContent>
              </Card>
            </div>
          </div>

          <Card className="shadow-lg border-purple-100">
            <CardHeader>
              <CardTitle>Konfigurator zestawu</CardTitle>
              <CardDescription>Zmiana metrażu i typu pomieszczenia natychmiast przelicza warianty.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  <span className="text-sm text-zinc-500 whitespace-nowrap">m²</span>
                </div>
              </div>

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

              <div className="rounded-xl bg-zinc-900 text-white p-5 space-y-2">
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Podsumowanie</p>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-300">Wybrany metraż</p>
                    <p className="text-3xl font-semibold">{area.toFixed(1)} m²</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-300">Szacowana wartość koszyka</p>
                    <p className="text-3xl font-semibold">{formatCurrency(cartSummary.total)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900">Dostępne zestawy</h2>
              <p className="text-zinc-600">Warianty są filtrowane według pomieszczenia i progu metrażu.</p>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Otwórz koszyk zapytaniowy
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Koszyk zapytaniowy</SheetTitle>
                  <SheetDescription>
                    To etap MVP — klient wysyła zapytanie, a finalne potwierdzenie i integracje dopinamy później.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-8 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Zakres zapytania</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-zinc-600">
                      <div className="flex justify-between gap-4">
                        <span>Pomieszczenie</span>
                        <span className="font-medium text-zinc-900">{getRoomTypeLabel(roomType)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Metraż</span>
                        <span className="font-medium text-zinc-900">{area.toFixed(1)} m²</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Zestaw</span>
                        <span className="font-medium text-zinc-900">{cartSummary.selectedBundle?.name || "Brak"}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Wartość zestawu</span>
                        <span className="font-medium text-zinc-900">{formatCurrency(cartSummary.selectedBundleTotal)}</span>
                      </div>
                      <Separator />
                      {cartSummary.selectedAddOns.length ? (
                        cartSummary.selectedAddOns.map((item) => (
                          <div key={item.product.product_id} className="flex justify-between gap-4">
                            <span>{item.product.name}</span>
                            <span className="font-medium text-zinc-900">{formatCurrency(item.total)}</span>
                          </div>
                        ))
                      ) : (
                        <p>Brak dodatków wybranych do zapytania.</p>
                      )}
                      <Separator />
                      <div className="flex justify-between gap-4 text-base">
                        <span className="font-semibold text-zinc-900">Razem orientacyjnie</span>
                        <span className="font-semibold text-zinc-900">{formatCurrency(cartSummary.total)}</span>
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
                        placeholder="Np. dodatkowe pytania o dostawę, wykończenie lub termin realizacji"
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
                      {submitting ? "Wysyłanie..." : "Wyślij zapytanie o zestaw"}
                    </Button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {!availableBundles.length && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="py-6 flex items-start gap-3 text-amber-800">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-medium">Brak wariantu dla podanego progu.</p>
                  <p className="text-sm">Zmień metraż albo dodaj kolejny zestaw w panelu admina sklepu.</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-5 lg:grid-cols-3">
            {availableBundles.map((bundle) => {
              const isSelected = bundle.variant_id === selectedBundleId
              const items = resolveBundleItems(bundle, initialCatalog.products, area)
              return (
                <Card
                  key={bundle.variant_id}
                  className={isSelected ? "border-purple-400 shadow-xl shadow-purple-100" : "border-zinc-200"}
                >
                  <div className="relative h-44 overflow-hidden rounded-t-xl bg-zinc-100">
                    <Image
                      src={bundle.image_url || "/placeholder.svg"}
                      alt={bundle.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle>{bundle.name}</CardTitle>
                        <CardDescription>{bundle.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{formatCoverage(bundle.coverage_from_m2, bundle.coverage_to_m2)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                      {(bundle.highlights ?? []).map((highlight) => (
                        <Badge key={highlight} variant="outline">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                    <div className="rounded-xl bg-zinc-100 p-4">
                      <p className="text-sm text-zinc-500">Cena dla {area.toFixed(1)} m²</p>
                      <p className="text-3xl font-semibold text-zinc-900">{formatCurrency(calculateBundleTotal(bundle, area))}</p>
                      <p className="text-sm text-zinc-500">{bundle.price_per_m2.toFixed(0)} zł / m² + baza {bundle.base_price.toFixed(0)} zł</p>
                    </div>
                    <div className="space-y-3">
                      <p className="font-medium text-zinc-900">Co wchodzi w zestaw</p>
                      <div className="space-y-2 text-sm text-zinc-600">
                        {items.map((item) => (
                          <div key={`${bundle.variant_id}-${item.product_id}`} className="flex items-start justify-between gap-4">
                            <span>{item.product?.name || item.product_id}</span>
                            <span className="text-right whitespace-nowrap">
                              {item.quantity.toFixed(1)} {item.unit_label || item.product?.unit_label || ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" variant={isSelected ? "default" : "outline"} onClick={() => setSelectedBundleId(bundle.variant_id)}>
                      {isSelected ? "Wybrany wariant" : bundle.cta_label || "Wybierz wariant"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="bg-zinc-900 text-white">
            <CardHeader>
              <div className="flex items-center gap-2 text-zinc-300 text-sm uppercase tracking-[0.15em]">
                <Sparkles className="w-4 h-4" />
                Rekomendacje ręczne
              </div>
              <CardTitle className="text-white text-2xl">Produkty sugerowane do obecnej konfiguracji</CardTitle>
              <CardDescription className="text-zinc-300">
                {recommendationCopy?.description || "Dobierane ręcznie w panelu admina w zależności od pomieszczenia i metrażu."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <p className="font-medium text-white">{recommendationCopy?.title || "Produkty najczęściej dobierane razem"}</p>
              <p>
                Dzięki temu MVP możesz już teraz ręcznie sterować upsellem bez AI i bez zewnętrznej platformy e-commerce.
              </p>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-zinc-300 mb-2">Aktualny koszyk</p>
                <p className="text-3xl font-semibold text-white">{formatCurrency(cartSummary.total)}</p>
                <p className="text-zinc-300">Zestaw + produkty dodatkowe liczone na podstawie metrażu.</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {recommendedProducts.map((product) => {
              const checked = selectedAddOnIds.includes(product.product_id)
              return (
                <Card key={product.product_id}>
                  <CardContent className="py-5 flex gap-4 items-start">
                    <Checkbox checked={checked} onCheckedChange={() => handleAddOnToggle(product.product_id)} className="mt-1" />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-zinc-900">{product.name}</p>
                          <p className="text-sm text-zinc-600">{product.description}</p>
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

            {!recommendedProducts.length && (
              <Card>
                <CardContent className="py-10 text-center text-zinc-500">
                  Brak dodatkowych rekomendacji dla obecnego typu pomieszczenia i progu metrażu.
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold">Architektura gotowa na rozwój</h3>
            <p className="text-zinc-600">
              Dane sklepu są wydzielone od UI, więc później łatwo przepiąć sklep na pełny checkout albo zewnętrzny silnik.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold">Koszyk zamiast checkoutu</h3>
            <p className="text-zinc-600">
              MVP kończy się na zapytaniu. To pozwala uruchomić sprzedaż bez integracji płatności i dostaw w pierwszym kroku.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold">Rekomendacje bez AI</h3>
            <p className="text-zinc-600">
              Reguły rekomendacji są ręczne, więc można je kontrolować biznesowo bez dodatkowego kosztu i ryzyka jakości.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
