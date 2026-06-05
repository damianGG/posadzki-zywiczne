"use client"

import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react"
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
import { ShopBundle, ShopConfiguratorConfig, ShopProduct, ShopRecommendationRule } from "@/types/shop"

type ProductDraft = ShopProduct & {
  tagsText: string
  roomTypesText: string
  galleryText: string
  variantsText: string
  specificationsText: string
}

type BundleDraft = ShopBundle & {
  highlightsText: string
  includedItemsText: string
  recommendedIdsText: string
}

type RuleDraft = ShopRecommendationRule & {
  recommendedIdsText: string
}

type ConfigDraft = ShopConfiguratorConfig & {
  roomVariantsText: string
  stepSettingsText: string
  substrateOptionsText: string
  finishVariantsText: string
  floorColorsText: string
  flakeColorsText: string
  accessoryOptionsText: string
  kitItemsText: string
  ctaButtonsText: string
  quickChoicesText: string
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
  galleryText: stringifyJson(product.gallery ?? []),
  variantsText: stringifyJson(product.variants ?? []),
  specificationsText: stringifyJson(product.specifications ?? []),
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

const mapConfigDraft = (config: ShopConfiguratorConfig): ConfigDraft => ({
  ...config,
  roomVariantsText: stringifyJson(config.room_variants),
  stepSettingsText: stringifyJson(config.steps),
  substrateOptionsText: stringifyJson(config.substrate_options),
  finishVariantsText: stringifyJson(config.finish_variants),
  floorColorsText: stringifyJson(config.floor_colors),
  flakeColorsText: stringifyJson(config.flake_colors),
  accessoryOptionsText: stringifyJson(config.accessory_options),
  kitItemsText: stringifyJson(config.kit_items),
  ctaButtonsText: stringifyJson(config.cta_buttons),
  quickChoicesText: (config.area.quick_choices ?? []).join(", "),
})

type SaveRecordPayloadMap = {
  product: Record<string, unknown>
  bundle: Record<string, unknown>
  "recommendation-rule": Record<string, unknown>
  config: ShopConfiguratorConfig
}

type AdminSectionId = "configurator" | "products" | "bundles" | "rules"

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
  const [configDraft, setConfigDraft] = useState<ConfigDraft | null>(null)
  const [activeSection, setActiveSection] = useState<AdminSectionId>("configurator")

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
      setConfigDraft(mapConfigDraft(data.configuratorConfig))
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
  const sectionTabs = useMemo(
    () => [
      { id: "configurator" as const, label: "Konfigurator", count: configDraft ? 1 : 0 },
      { id: "products" as const, label: "Produkty", count: sortedProducts.length },
      { id: "bundles" as const, label: "Zestawy", count: sortedBundles.length },
      { id: "rules" as const, label: "Reguły", count: sortedRules.length },
    ],
    [configDraft, sortedBundles.length, sortedProducts.length, sortedRules.length]
  )
  const handleSectionTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentTabId: AdminSectionId) => {
    const currentIndex = sectionTabs.findIndex((tab) => tab.id === currentTabId)
    if (currentIndex < 0) {
      return
    }

    let nextIndex: number | null = null
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % sectionTabs.length
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + sectionTabs.length) % sectionTabs.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = sectionTabs.length - 1
    }

    if (nextIndex === null) {
      return
    }
    event.preventDefault()
    const nextTabId = sectionTabs[nextIndex].id

    requestAnimationFrame(() => {
      const nextTab = document.getElementById(`shop-tab-${nextTabId}`)
      nextTab?.focus()
    })
  }

  const updateProduct = (productId: string, patch: Partial<ProductDraft>) => {
    setProducts((current) => current.map((product) => (product.product_id === productId ? { ...product, ...patch } : product)))
  }

  const updateBundle = (bundleId: string, patch: Partial<BundleDraft>) => {
    setBundles((current) => current.map((bundle) => (bundle.variant_id === bundleId ? { ...bundle, ...patch } : bundle)))
  }

  const updateRule = (ruleId: string, patch: Partial<RuleDraft>) => {
    setRules((current) => current.map((rule) => (rule.rule_id === ruleId ? { ...rule, ...patch } : rule)))
  }

  const updateConfigDraft = (patch: Partial<ConfigDraft>) => {
    setConfigDraft((current) => (current ? { ...current, ...patch } : current))
  }

  const saveRecord = async <TType extends keyof SaveRecordPayloadMap>(
    type: TType,
    id: string,
    updates: SaveRecordPayloadMap[TType]
  ) => {
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
      if (type === "config") {
        setConfigDraft(mapConfigDraft(data.data))
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Błąd zapisu" })
    } finally {
      setSavingId(null)
    }
  }

  const handleSaveProduct = (product: ProductDraft) => {
    try {
      let gallery
      let variants
      let specifications

      try {
        gallery = JSON.parse(product.galleryText || "[]")
      } catch {
        throw new Error('Pole Galeria (JSON) ma niepoprawny format. Oczekiwany format: [{"url":"...","alt":"..."}].')
      }

      try {
        variants = JSON.parse(product.variantsText || "[]")
      } catch {
        throw new Error('Pole Warianty produktu (JSON) ma niepoprawny format. Oczekiwany format: [{"id":"...","name":"...","price":0}].')
      }

      try {
        specifications = JSON.parse(product.specificationsText || "[]")
      } catch {
        throw new Error('Pole Dane techniczne (JSON) ma niepoprawny format. Oczekiwany format: [{"label":"...","value":"..."}].')
      }

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
        show_in_configurator_result: Boolean(product.show_in_configurator_result),
        result_display_order: toNumber(product.result_display_order),
        result_display_type: product.result_display_type || "card",
        slug: product.slug || null,
        page_title: product.page_title || null,
        page_description: product.page_description || null,
        meta_title: product.meta_title || null,
        meta_description: product.meta_description || null,
        gallery,
        variants,
        specifications,
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: `Błąd zapisu dla ${product.name}. ${error instanceof Error ? error.message : "Sprawdź format JSON."}`.trim(),
      })
    }
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
    } catch (error) {
      setMessage({
        type: "error",
        text: `Pole included_items dla ${bundle.name} musi być poprawnym JSON-em. ${error instanceof Error ? error.message : ""}`.trim(),
      })
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

  const handleSaveConfig = () => {
    if (!configDraft) {
      return
    }

    try {
      const nextConfig: ShopConfiguratorConfig = {
        room_variants: JSON.parse(configDraft.roomVariantsText || "[]"),
        steps: JSON.parse(configDraft.stepSettingsText || "[]"),
        substrate_options: JSON.parse(configDraft.substrateOptionsText || "[]"),
        finish_variants: JSON.parse(configDraft.finishVariantsText || "[]"),
        floor_colors: JSON.parse(configDraft.floorColorsText || "[]"),
        flake_colors: JSON.parse(configDraft.flakeColorsText || "[]"),
        accessory_options: JSON.parse(configDraft.accessoryOptionsText || "[]"),
        kit_items: JSON.parse(configDraft.kitItemsText || "[]"),
        cta_buttons: JSON.parse(configDraft.ctaButtonsText || "[]"),
        area: {
          ...configDraft.area,
          quick_choices: parseCsv(configDraft.quickChoicesText).map((item) => Number(item)).filter((item) => Number.isFinite(item)),
          min: toNumber(configDraft.area.min),
          max: toNumber(configDraft.area.max),
          step: toNumber(configDraft.area.step),
        },
        plinth: {
          ...configDraft.plinth,
          price_per_mb: toNumber(configDraft.plinth.price_per_mb),
        },
        messages: {
          ...configDraft.messages,
        },
      }

      void saveRecord("config", "kit-configurator", nextConfig)
    } catch (error) {
      setMessage({
        type: "error",
        text: `Konfiguracja konfiguratora musi mieć poprawny JSON. ${error instanceof Error ? error.message : ""}`.trim(),
      })
    }
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
            show_in_configurator_result: true,
            result_display_order: products.length + 1,
            result_display_type: "card",
            slug: `produkt-${timestamp}`,
            page_title: "Nowy produkt",
            page_description: "Krótki opis produktu.",
            meta_title: "Nowy produkt | Sklep",
            meta_description: "Meta opis nowego produktu.",
            gallery: [],
            variants: [],
            specifications: [],
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-orange-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
              <ArrowLeft className="h-4 w-4" />
              Powrót do panelu admina
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-900">Sklep MVP</h1>
                <p className="text-zinc-600">Produkty, zestawy, reguły oraz konfiguracja nowego konfiguratora.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/sklep">Zobacz storefront</Link>
            </Button>
            <Button onClick={() => createRecord("product")}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj produkt
            </Button>
            <Button variant="outline" onClick={() => createRecord("bundle")}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj zestaw
            </Button>
            <Button variant="outline" onClick={() => createRecord("recommendation-rule")}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj regułę
            </Button>
          </div>
        </div>

        {fallbackMode && (
          <Alert>
            <AlertDescription>
              Panel działa aktualnie na danych fallback. Aby zapisy były trwałe, uruchom migracje `003_shop_mvp.sql` oraz `004_shop_configurator_config.sql` i ustaw Supabase.
              Dla rozszerzonych funkcji produktów uruchom również migrację `005_shop_products_content_and_variants.sql` (po `003_shop_mvp.sql` i `004_shop_configurator_config.sql`).
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
            <Card>
              <CardHeader>
                <CardTitle>Zakładki konfiguracji</CardTitle>
                <CardDescription>Przełączaj sekcje, żeby nie przewijać całej strony.</CardDescription>
              </CardHeader>
              <CardContent>
                <nav aria-label="Sekcje edycji sklepu">
                  <div className="flex flex-wrap gap-2" role="tablist">
                    {sectionTabs.map((tab) => (
                      <Button
                        key={tab.id}
                        id={`shop-tab-${tab.id}`}
                        role="tab"
                        aria-controls={`shop-panel-${tab.id}`}
                        aria-selected={activeSection === tab.id}
                        tabIndex={activeSection === tab.id ? 0 : -1}
                        variant={activeSection === tab.id ? "default" : "outline"}
                        onClick={() => setActiveSection(tab.id)}
                        onKeyDown={(event) => handleSectionTabKeyDown(event, tab.id)}
                      >
                        {tab.label} ({tab.count})
                      </Button>
                    ))}
                  </div>
                </nav>
              </CardContent>
            </Card>

            {configDraft && activeSection === "configurator" ? (
              <section className="space-y-4" role="tabpanel" id="shop-panel-configurator" aria-labelledby="shop-tab-configurator">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-900">Konfigurator krok po kroku</h2>
                  <p className="text-zinc-600">Tutaj administrator zarządza krokami, wariantami wykończenia, kolorami, komunikatami, CTA i aktywnością całego flow.</p>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Treści i ustawienia główne</CardTitle>
                    <CardDescription>Najważniejsze pola tekstowe oraz ustawienia metrażu i cokołu.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Badge</Label>
                        <Input value={configDraft.messages.badge} onChange={(event) => updateConfigDraft({ messages: { ...configDraft.messages, badge: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Etykieta sekcji pomieszczenia</Label>
                        <Input value={configDraft.messages.room_section_label} onChange={(event) => updateConfigDraft({ messages: { ...configDraft.messages, room_section_label: event.target.value } })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Tytuł</Label>
                        <Input value={configDraft.messages.title} onChange={(event) => updateConfigDraft({ messages: { ...configDraft.messages, title: event.target.value } })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Opis hero</Label>
                        <Textarea value={configDraft.messages.description} onChange={(event) => updateConfigDraft({ messages: { ...configDraft.messages, description: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Tytuł wyniku</Label>
                        <Input value={configDraft.messages.result_title} onChange={(event) => updateConfigDraft({ messages: { ...configDraft.messages, result_title: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Opis wyniku</Label>
                        <Input value={configDraft.messages.result_description} onChange={(event) => updateConfigDraft({ messages: { ...configDraft.messages, result_description: event.target.value } })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Komunikat o naddatku materiału</Label>
                        <Textarea value={configDraft.messages.result_allowance_message} onChange={(event) => updateConfigDraft({ messages: { ...configDraft.messages, result_allowance_message: event.target.value } })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Komunikat CTA mock</Label>
                        <Textarea value={configDraft.messages.mock_cta_message} onChange={(event) => updateConfigDraft({ messages: { ...configDraft.messages, mock_cta_message: event.target.value } })} />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Label pola metrażu</Label>
                        <Input value={configDraft.area.label} onChange={(event) => updateConfigDraft({ area: { ...configDraft.area, label: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Szybkie wybory m² (CSV)</Label>
                        <Input value={configDraft.quickChoicesText} onChange={(event) => updateConfigDraft({ quickChoicesText: event.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Minimalny metraż</Label>
                        <Input type="number" value={configDraft.area.min} onChange={(event) => updateConfigDraft({ area: { ...configDraft.area, min: Number(event.target.value) } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Maksymalny metraż</Label>
                        <Input type="number" value={configDraft.area.max} onChange={(event) => updateConfigDraft({ area: { ...configDraft.area, max: Number(event.target.value) } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Krok inputa</Label>
                        <Input type="number" value={configDraft.area.step} onChange={(event) => updateConfigDraft({ area: { ...configDraft.area, step: Number(event.target.value) } })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Opis kroku metrażu</Label>
                        <Textarea value={configDraft.area.helper_text} onChange={(event) => updateConfigDraft({ area: { ...configDraft.area, helper_text: event.target.value } })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Komunikat pod inputem metrażu</Label>
                        <Textarea value={configDraft.area.allowance_message} onChange={(event) => updateConfigDraft({ area: { ...configDraft.area, allowance_message: event.target.value } })} />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Pytanie o cokół</Label>
                        <Input value={configDraft.plinth.question} onChange={(event) => updateConfigDraft({ plinth: { ...configDraft.plinth, question: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Etykieta opcji NIE</Label>
                        <Input value={configDraft.plinth.no_option_label} onChange={(event) => updateConfigDraft({ plinth: { ...configDraft.plinth, no_option_label: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Etykieta opcji TAK</Label>
                        <Input value={configDraft.plinth.yes_option_label} onChange={(event) => updateConfigDraft({ plinth: { ...configDraft.plinth, yes_option_label: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Opis opcji NIE</Label>
                        <Textarea value={configDraft.plinth.no_option_description} onChange={(event) => updateConfigDraft({ plinth: { ...configDraft.plinth, no_option_description: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Opis opcji TAK</Label>
                        <Textarea value={configDraft.plinth.yes_option_description} onChange={(event) => updateConfigDraft({ plinth: { ...configDraft.plinth, yes_option_description: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Label pola długości cokołu</Label>
                        <Input value={configDraft.plinth.length_label} onChange={(event) => updateConfigDraft({ plinth: { ...configDraft.plinth, length_label: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Podpowiedź dla długości</Label>
                        <Input value={configDraft.plinth.length_hint} onChange={(event) => updateConfigDraft({ plinth: { ...configDraft.plinth, length_hint: event.target.value } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Cena za mb</Label>
                        <Input type="number" value={configDraft.plinth.price_per_mb} onChange={(event) => updateConfigDraft({ plinth: { ...configDraft.plinth, price_per_mb: Number(event.target.value) } })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Jednostka cokołu</Label>
                        <Input value={configDraft.plinth.unit_label} onChange={(event) => updateConfigDraft({ plinth: { ...configDraft.plinth, unit_label: event.target.value } })} />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3 md:col-span-2">
                        <div>
                          <p className="font-medium">Aktywny krok cokołu</p>
                          <p className="text-sm text-zinc-500">Pozwala chwilowo wyłączyć cały krok.</p>
                        </div>
                        <Switch checked={configDraft.plinth.enabled} onCheckedChange={(checked) => updateConfigDraft({ plinth: { ...configDraft.plinth, enabled: checked } })} />
                      </div>
                    </div>

                    <Button onClick={handleSaveConfig} disabled={savingId === "kit-configurator"}>
                      <Save className="mr-2 h-4 w-4" />
                      {savingId === "kit-configurator" ? "Zapisywanie..." : "Zapisz ustawienia konfiguratora"}
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-2">
                  {[
                    ["roomVariantsText", "Warianty pomieszczeń (JSON)"],
                    ["stepSettingsText", "Kroki konfiguratora (JSON)"],
                    ["substrateOptionsText", "Opcje podłoża (JSON)"],
                    ["finishVariantsText", "Warianty wykończenia (JSON)"],
                    ["floorColorsText", "Kolory posadzki (JSON)"],
                    ["flakeColorsText", "Kolory płatków (JSON)"],
                    ["accessoryOptionsText", "Akcesoria dodatkowe (JSON)"],
                    ["kitItemsText", "Elementy zestawu (JSON)"],
                    ["ctaButtonsText", "CTA (JSON)"],
                  ].map(([field, label]) => (
                    <Card key={field}>
                      <CardHeader>
                        <CardTitle>{label}</CardTitle>
                        <CardDescription>Edytowalne dane źródłowe dla storefrontu.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={configDraft[field as keyof ConfigDraft] as string}
                          onChange={(event) => updateConfigDraft({ [field]: event.target.value } as Partial<ConfigDraft>)}
                          className="min-h-[260px] font-mono text-xs"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            {activeSection === "products" ? (
              <section className="space-y-4" role="tabpanel" id="shop-panel-products" aria-labelledby="shop-tab-products">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-900">Produkty</h2>
                  <p className="text-zinc-600">Produkty bazowe, dodatki i akcesoria z konfiguracją publikacji w wyniku flow, treści SEO, galerii i wariantów.</p>
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
                          <Label>Slug strony produktu</Label>
                          <Input value={product.slug || ""} onChange={(event) => updateProduct(product.product_id, { slug: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Typ prezentacji w wyniku</Label>
                          <select
                            value={product.result_display_type || "card"}
                            onChange={(event) => updateProduct(product.product_id, { result_display_type: event.target.value as ShopProduct["result_display_type"] })}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="card">card</option>
                            <option value="compact">compact</option>
                          </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Tytuł strony produktu</Label>
                          <Input value={product.page_title || ""} onChange={(event) => updateProduct(product.product_id, { page_title: event.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Opis strony produktu</Label>
                          <Textarea value={product.page_description || ""} onChange={(event) => updateProduct(product.product_id, { page_description: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Meta title</Label>
                          <Input value={product.meta_title || ""} onChange={(event) => updateProduct(product.product_id, { meta_title: event.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Meta description</Label>
                          <Textarea value={product.meta_description || ""} onChange={(event) => updateProduct(product.product_id, { meta_description: event.target.value })} />
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
                        <div className="space-y-2">
                          <Label>Kolejność w wyniku konfiguratora</Label>
                          <Input
                            type="number"
                            value={product.result_display_order ?? 0}
                            onChange={(event) => updateProduct(product.product_id, { result_display_order: Number(event.target.value) })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Galeria (JSON)</Label>
                          <Textarea
                            value={product.galleryText}
                            onChange={(event) => updateProduct(product.product_id, { galleryText: event.target.value })}
                            className="min-h-[120px] font-mono text-xs"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Warianty produktu (JSON)</Label>
                          <Textarea
                            value={product.variantsText}
                            onChange={(event) => updateProduct(product.product_id, { variantsText: event.target.value })}
                            className="min-h-[120px] font-mono text-xs"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Dane techniczne (JSON)</Label>
                          <Textarea
                            value={product.specificationsText}
                            onChange={(event) => updateProduct(product.product_id, { specificationsText: event.target.value })}
                            className="min-h-[120px] font-mono text-xs"
                          />
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
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">Pokaż na końcu flow</p>
                            <p className="text-sm text-zinc-500">Produkt może pojawić się w ostatnim kroku konfiguratora.</p>
                          </div>
                          <Switch
                            checked={product.show_in_configurator_result === true}
                            onCheckedChange={(checked) => updateProduct(product.product_id, { show_in_configurator_result: checked })}
                          />
                        </div>
                      </div>
                      <Button onClick={() => handleSaveProduct(product)} disabled={savingId === product.product_id}>
                        <Save className="mr-2 h-4 w-4" />
                        {savingId === product.product_id ? "Zapisywanie..." : "Zapisz produkt"}
                      </Button>
                    </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            {activeSection === "bundles" ? (
              <section className="space-y-4" role="tabpanel" id="shop-panel-bundles" aria-labelledby="shop-tab-bundles">
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
                        <Save className="mr-2 h-4 w-4" />
                        {savingId === bundle.variant_id ? "Zapisywanie..." : "Zapisz zestaw"}
                      </Button>
                    </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            {activeSection === "rules" ? (
              <section className="space-y-4" role="tabpanel" id="shop-panel-rules" aria-labelledby="shop-tab-rules">
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
                        <Save className="mr-2 h-4 w-4" />
                        {savingId === rule.rule_id ? "Zapisywanie..." : "Zapisz regułę"}
                      </Button>
                    </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
