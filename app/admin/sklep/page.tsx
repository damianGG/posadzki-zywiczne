"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Save, ShoppingBag } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ShopBundle, ShopProduct, ShopRecommendationRule } from "@/types/shop"

type ProductDraft = ShopProduct & {
  tagsText: string
  roomTypesText: string
}

type BundleDraft = ShopBundle & {
  highlightsText: string
  includedItemsText: string
  recommendedIdsText: string
}

type RuleDraft = ShopRecommendationRule & {
  recommendedIdsText: string
}

const stringifyJson = (value: unknown) => JSON.stringify(value ?? [], null, 2)
const parseCsv = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean)
const toNumber = (value: string | number | null | undefined) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}
const toNullableNumber = (value: string | number | null | undefined) => {
  if (value === "" || value === null || value === undefined) {
    return null
  }

  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

const mapProductDraft = (product: ShopProduct): ProductDraft => ({
  ...product,
  tagsText: (product.tags ?? []).join(", "),
  roomTypesText: (product.applicable_room_types ?? []).join(", "),
})

const mapBundleDraft = (bundle: ShopBundle): BundleDraft => ({
  ...bundle,
  highlightsText: (bundle.highlights ?? []).join(", "),
  includedItemsText: stringifyJson(bundle.included_items ?? []),
  recommendedIdsText: (bundle.recommended_product_ids ?? []).join(", "),
})

const mapRuleDraft = (rule: ShopRecommendationRule): RuleDraft => ({
  ...rule,
  recommendedIdsText: (rule.recommended_product_ids ?? []).join(", "),
})

export default function AdminShopPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [products, setProducts] = useState<ProductDraft[]>([])
  const [bundles, setBundles] = useState<BundleDraft[]>([])
  const [rules, setRules] = useState<RuleDraft[]>([])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/shop")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Nie udało się pobrać danych sklepu")
      }

      setProducts((data.products || []).map(mapProductDraft))
      setBundles((data.bundles || []).map(mapBundleDraft))
      setRules((data.recommendationRules || []).map(mapRuleDraft))
      setFallbackMode(Boolean(data.fallbackMode))
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Błąd ładowania danych" })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/realizacje/dodaj")
      return
    }

    setIsAuthenticated(true)
    void fetchData()
  }, [fetchData, router])

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
    [products]
  )
  const sortedBundles = useMemo(
    () => [...bundles].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
    [bundles]
  )
  const sortedRules = useMemo(
    () => [...rules].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
    [rules]
  )

  const updateProduct = (productId: string, patch: Partial<ProductDraft>) => {
    setProducts((current) => current.map((product) => (product.product_id === productId ? { ...product, ...patch } : product)))
  }

  const updateBundle = (bundleId: string, patch: Partial<BundleDraft>) => {
    setBundles((current) => current.map((bundle) => (bundle.variant_id === bundleId ? { ...bundle, ...patch } : bundle)))
  }

  const updateRule = (ruleId: string, patch: Partial<RuleDraft>) => {
    setRules((current) => current.map((rule) => (rule.rule_id === ruleId ? { ...rule, ...patch } : rule)))
  }

  const saveRecord = async (type: "product" | "bundle" | "recommendation-rule", id: string, updates: Record<string, unknown>) => {
    try {
      setSavingId(id)
      setMessage(null)
      const response = await fetch("/api/admin/shop", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, id, updates }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Nie udało się zapisać danych")
      }

      setMessage({ type: "success", text: "Zmiany zostały zapisane." })
      setFallbackMode(false)
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Błąd zapisu" })
    } finally {
      setSavingId(null)
    }
  }

  const handleSaveProduct = (product: ProductDraft) => {
    void saveRecord("product", product.product_id, {
      name: product.name,
      short_name: product.short_name || null,
      description: product.description,
      category: product.category,
      price: toNumber(product.price),
      pricing_model: product.pricing_model,
      unit_label: product.unit_label || null,
      image_url: product.image_url || null,
      tags: parseCsv(product.tagsText),
      applicable_room_types: parseCsv(product.roomTypesText),
      is_featured: Boolean(product.is_featured),
      is_active: Boolean(product.is_active),
      display_order: toNumber(product.display_order),
    })
  }

  const handleSaveBundle = (bundle: BundleDraft) => {
    try {
      const includedItems = JSON.parse(bundle.includedItemsText || "[]")
      void saveRecord("bundle", bundle.variant_id, {
        name: bundle.name,
        short_name: bundle.short_name || null,
        description: bundle.description,
        room_type: bundle.room_type,
        coverage_from_m2: toNumber(bundle.coverage_from_m2),
        coverage_to_m2: toNullableNumber(bundle.coverage_to_m2),
        base_price: toNumber(bundle.base_price),
        price_per_m2: toNumber(bundle.price_per_m2),
        image_url: bundle.image_url || null,
        highlights: parseCsv(bundle.highlightsText),
        included_items: includedItems,
        recommended_product_ids: parseCsv(bundle.recommendedIdsText),
        cta_label: bundle.cta_label || null,
        is_active: Boolean(bundle.is_active),
        display_order: toNumber(bundle.display_order),
      })
    } catch {
      setMessage({ type: "error", text: `Pole included_items dla ${bundle.name} musi być poprawnym JSON-em.` })
    }
  }

  const handleSaveRule = (rule: RuleDraft) => {
    void saveRecord("recommendation-rule", rule.rule_id, {
      name: rule.name,
      title: rule.title,
      description: rule.description || null,
      room_type: rule.room_type,
      min_area: toNumber(rule.min_area),
      max_area: toNullableNumber(rule.max_area),
      recommended_product_ids: parseCsv(rule.recommendedIdsText),
      is_active: Boolean(rule.is_active),
      display_order: toNumber(rule.display_order),
    })
  }

  const createRecord = async (type: "product" | "bundle" | "recommendation-rule") => {
    const timestamp = Date.now()

    const defaultPayload =
      type === "product"
        ? {
            product_id: `produkt-${timestamp}`,
            name: "Nowy produkt",
            description: "Opis produktu",
            category: "akcesoria",
            price: 0,
            pricing_model: "fixed",
            unit_label: "zł / zamówienie",
            tags: [],
            applicable_room_types: ["garaz"],
            is_featured: false,
            is_active: true,
            display_order: products.length + 1,
          }
        : type === "bundle"
          ? {
              variant_id: `wariant-${timestamp}`,
              name: "Nowy wariant",
              description: "Opis wariantu",
              room_type: "garaz",
              coverage_from_m2: 0,
              coverage_to_m2: null,
              base_price: 0,
              price_per_m2: 0,
              highlights: [],
              included_items: [],
              recommended_product_ids: [],
              cta_label: "Wybierz wariant",
              is_active: true,
              display_order: bundles.length + 1,
            }
          : {
              rule_id: `regula-${timestamp}`,
              name: "Nowa reguła",
              title: "Nowa rekomendacja",
              description: "Opis rekomendacji",
              room_type: "garaz",
              min_area: 0,
              max_area: null,
              recommended_product_ids: [],
              is_active: true,
              display_order: rules.length + 1,
            }

    try {
      setMessage(null)
      const response = await fetch("/api/admin/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, data: defaultPayload }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Nie udało się dodać rekordu")
      }

      await fetchData()
      setMessage({ type: "success", text: "Dodano nowy rekord." })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Błąd tworzenia rekordu" })
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
              <ArrowLeft className="w-4 h-4" />
              Powrót do panelu admina
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-900">Sklep MVP</h1>
                <p className="text-zinc-600">Produkty, zestawy i ręczne reguły rekomendacji.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/sklep">Zobacz storefront</Link>
            </Button>
            <Button onClick={() => createRecord("product")}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj produkt
            </Button>
            <Button variant="outline" onClick={() => createRecord("bundle")}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj zestaw
            </Button>
            <Button variant="outline" onClick={() => createRecord("recommendation-rule")}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj regułę
            </Button>
          </div>
        </div>

        {fallbackMode && (
          <Alert>
            <AlertDescription>
              Panel działa aktualnie na danych fallback. Aby zapisy były trwałe, uruchom migrację `003_shop_mvp.sql` i ustaw Supabase.
            </AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert className={message.type === "error" ? "border-red-200 text-red-700" : "border-emerald-200 text-emerald-700"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <Card>
            <CardContent className="py-16 text-center text-zinc-500">Ładowanie konfiguracji sklepu...</CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900">Produkty</h2>
                <p className="text-zinc-600">Produkty bazowe, dodatki i akcesoria, które mogą być polecane lub sprzedawane osobno.</p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {sortedProducts.map((product) => (
                  <Card key={product.product_id}>
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>ID: {product.product_id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Nazwa</Label>
                          <Input value={product.name} onChange={(event) => updateProduct(product.product_id, { name: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Skrót</Label>
                          <Input value={product.short_name || ""} onChange={(event) => updateProduct(product.product_id, { short_name: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Kategoria</Label>
                          <Input value={product.category} onChange={(event) => updateProduct(product.product_id, { category: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Model ceny</Label>
                          <Input value={product.pricing_model} onChange={(event) => updateProduct(product.product_id, { pricing_model: event.target.value as ShopProduct["pricing_model"] })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Cena</Label>
                          <Input type="number" value={product.price} onChange={(event) => updateProduct(product.product_id, { price: Number(event.target.value) })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Label ceny</Label>
                          <Input value={product.unit_label || ""} onChange={(event) => updateProduct(product.product_id, { unit_label: event.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Opis</Label>
                          <Textarea value={product.description} onChange={(event) => updateProduct(product.product_id, { description: event.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>URL obrazka</Label>
                          <Input value={product.image_url || ""} onChange={(event) => updateProduct(product.product_id, { image_url: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Tagi (CSV)</Label>
                          <Input value={product.tagsText} onChange={(event) => updateProduct(product.product_id, { tagsText: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Pomieszczenia (CSV)</Label>
                          <Input value={product.roomTypesText} onChange={(event) => updateProduct(product.product_id, { roomTypesText: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Kolejność</Label>
                          <Input type="number" value={product.display_order ?? 0} onChange={(event) => updateProduct(product.product_id, { display_order: Number(event.target.value) })} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">Aktywny</p>
                            <p className="text-sm text-zinc-500">Widoczny publicznie i w rekomendacjach.</p>
                          </div>
                          <Switch checked={product.is_active !== false} onCheckedChange={(checked) => updateProduct(product.product_id, { is_active: checked })} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">Polecany</p>
                            <p className="text-sm text-zinc-500">Dodatkowo wyróżniony w panelu.</p>
                          </div>
                          <Switch checked={product.is_featured === true} onCheckedChange={(checked) => updateProduct(product.product_id, { is_featured: checked })} />
                        </div>
                      </div>
                      <Button onClick={() => handleSaveProduct(product)} disabled={savingId === product.product_id}>
                        <Save className="w-4 h-4 mr-2" />
                        {savingId === product.product_id ? "Zapisywanie..." : "Zapisz produkt"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900">Zestawy</h2>
                <p className="text-zinc-600">Warianty oparte o metraż z listą elementów w zestawie i rekomendowanych dodatków.</p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {sortedBundles.map((bundle) => (
                  <Card key={bundle.variant_id}>
                    <CardHeader>
                      <CardTitle>{bundle.name}</CardTitle>
                      <CardDescription>ID: {bundle.variant_id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Nazwa</Label>
                          <Input value={bundle.name} onChange={(event) => updateBundle(bundle.variant_id, { name: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Skrót</Label>
                          <Input value={bundle.short_name || ""} onChange={(event) => updateBundle(bundle.variant_id, { short_name: event.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Opis</Label>
                          <Textarea value={bundle.description} onChange={(event) => updateBundle(bundle.variant_id, { description: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Pomieszczenie</Label>
                          <Input value={bundle.room_type} onChange={(event) => updateBundle(bundle.variant_id, { room_type: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA</Label>
                          <Input value={bundle.cta_label || ""} onChange={(event) => updateBundle(bundle.variant_id, { cta_label: event.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>URL obrazka</Label>
                          <Input value={bundle.image_url || ""} onChange={(event) => updateBundle(bundle.variant_id, { image_url: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Metraż od</Label>
                          <Input type="number" value={bundle.coverage_from_m2} onChange={(event) => updateBundle(bundle.variant_id, { coverage_from_m2: Number(event.target.value) })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Metraż do (puste = bez limitu)</Label>
                          <Input value={bundle.coverage_to_m2 ?? ""} onChange={(event) => updateBundle(bundle.variant_id, { coverage_to_m2: event.target.value === "" ? null : Number(event.target.value) })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Cena bazowa</Label>
                          <Input type="number" value={bundle.base_price} onChange={(event) => updateBundle(bundle.variant_id, { base_price: Number(event.target.value) })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Cena za m²</Label>
                          <Input type="number" value={bundle.price_per_m2} onChange={(event) => updateBundle(bundle.variant_id, { price_per_m2: Number(event.target.value) })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Highlighty (CSV)</Label>
                          <Input value={bundle.highlightsText} onChange={(event) => updateBundle(bundle.variant_id, { highlightsText: event.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Produktowe rekomendacje (CSV)</Label>
                          <Input value={bundle.recommendedIdsText} onChange={(event) => updateBundle(bundle.variant_id, { recommendedIdsText: event.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>included_items (JSON)</Label>
                          <Textarea value={bundle.includedItemsText} onChange={(event) => updateBundle(bundle.variant_id, { includedItemsText: event.target.value })} className="min-h-[180px] font-mono text-xs" />
                        </div>
                        <div className="space-y-2">
                          <Label>Kolejność</Label>
                          <Input type="number" value={bundle.display_order ?? 0} onChange={(event) => updateBundle(bundle.variant_id, { display_order: Number(event.target.value) })} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">Aktywny</p>
                            <p className="text-sm text-zinc-500">Widoczny w sklepie.</p>
                          </div>
                          <Switch checked={bundle.is_active !== false} onCheckedChange={(checked) => updateBundle(bundle.variant_id, { is_active: checked })} />
                        </div>
                      </div>
                      <Button onClick={() => handleSaveBundle(bundle)} disabled={savingId === bundle.variant_id}>
                        <Save className="w-4 h-4 mr-2" />
                        {savingId === bundle.variant_id ? "Zapisywanie..." : "Zapisz zestaw"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900">Reguły rekomendacji</h2>
                <p className="text-zinc-600">Proste, ręczne reguły zależne od pomieszczenia i progu metrażu.</p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {sortedRules.map((rule) => (
                  <Card key={rule.rule_id}>
                    <CardHeader>
                      <CardTitle>{rule.name}</CardTitle>
                      <CardDescription>ID: {rule.rule_id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Nazwa</Label>
                          <Input value={rule.name} onChange={(event) => updateRule(rule.rule_id, { name: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Pomieszczenie</Label>
                          <Input value={rule.room_type} onChange={(event) => updateRule(rule.rule_id, { room_type: event.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Tytuł bloku rekomendacji</Label>
                          <Input value={rule.title} onChange={(event) => updateRule(rule.rule_id, { title: event.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Opis</Label>
                          <Textarea value={rule.description || ""} onChange={(event) => updateRule(rule.rule_id, { description: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Metraż od</Label>
                          <Input type="number" value={rule.min_area} onChange={(event) => updateRule(rule.rule_id, { min_area: Number(event.target.value) })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Metraż do (puste = bez limitu)</Label>
                          <Input value={rule.max_area ?? ""} onChange={(event) => updateRule(rule.rule_id, { max_area: event.target.value === "" ? null : Number(event.target.value) })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Produkty rekomendowane (CSV)</Label>
                          <Input value={rule.recommendedIdsText} onChange={(event) => updateRule(rule.rule_id, { recommendedIdsText: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Kolejność</Label>
                          <Input type="number" value={rule.display_order ?? 0} onChange={(event) => updateRule(rule.rule_id, { display_order: Number(event.target.value) })} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">Aktywna reguła</p>
                            <p className="text-sm text-zinc-500">Wyłączenie ukryje rekomendacje publiczne.</p>
                          </div>
                          <Switch checked={rule.is_active !== false} onCheckedChange={(checked) => updateRule(rule.rule_id, { is_active: checked })} />
                        </div>
                      </div>
                      <Button onClick={() => handleSaveRule(rule)} disabled={savingId === rule.rule_id}>
                        <Save className="w-4 h-4 mr-2" />
                        {savingId === rule.rule_id ? "Zapisywanie..." : "Zapisz regułę"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
