import { ExternalLink } from "lucide-react"
import Link from "next/link"

import OptionCard from "@/components/shop/option-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ShopConfiguratorAccessoryOption,
  ShopConfiguratorConfig,
  ShopConfiguratorCtaButton,
  ShopConfiguratorKitItem,
  ShopConfiguratorSelections,
  ShopProduct,
} from "@/types/shop"
import { getConfiguratorMaterialEstimate, ResolvedOptionLookup } from "@/lib/shop-configurator"
import { formatProductPricing } from "@/lib/shop-engine"
import { getProductSlug } from "@/lib/shop-products"

interface ResultSummaryProps {
  config: ShopConfiguratorConfig
  selections: ShopConfiguratorSelections
  resolved: ResolvedOptionLookup
  total: number
  accessories: ShopConfiguratorAccessoryOption[]
  standaloneProducts: ShopProduct[]
  kitItems: ShopConfiguratorKitItem[]
  ctas: ShopConfiguratorCtaButton[]
  onAccessoryToggle: (accessoryId: string) => void
  onMockAction: (label: string) => void
}

export default function ResultSummary({
  config,
  selections,
  resolved,
  total,
  accessories,
  standaloneProducts,
  kitItems,
  ctas,
  onAccessoryToggle,
  onMockAction,
}: ResultSummaryProps) {
  const materialEstimate = getConfiguratorMaterialEstimate(selections)
  const formatOneDecimal = (value: number) => value.toFixed(1).replace(".", ",")
  const formatCurrency = (value: number) => value.toFixed(2).replace(".", ",")

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-zinc-200 shadow-sm">
        <CardHeader>
          <CardTitle>{config.messages.result_title}</CardTitle>
          <CardDescription>{config.messages.result_description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-zinc-700">
          <div className="flex justify-between gap-4"><span>Pomieszczenie</span><span className="font-medium text-zinc-950">{resolved.roomVariant?.label}</span></div>
          <div className="flex justify-between gap-4"><span>Rodzaj podłoża</span><span className="font-medium text-zinc-950">{resolved.substrate?.label}</span></div>
          <div className="flex justify-between gap-4"><span>Wariant wykończenia</span><span className="font-medium text-zinc-950">{resolved.finishVariant?.label}</span></div>
          <div className="flex justify-between gap-4"><span>Kolor posadzki</span><span className="font-medium text-zinc-950">{resolved.floorColor?.label}</span></div>
          {resolved.finishVariant?.requires_flake_color ? (
            <div className="flex justify-between gap-4"><span>Kolor płatków</span><span className="font-medium text-zinc-950">{resolved.flakeColor?.label}</span></div>
          ) : null}
          <div className="flex justify-between gap-4"><span>Powierzchnia</span><span className="font-medium text-zinc-950">{selections.area.toFixed(0)} m²</span></div>
          <div className="flex justify-between gap-4"><span>Cokół</span><span className="font-medium text-zinc-950">{selections.wantsPlinth ? "Tak" : "Nie"}</span></div>
          {selections.wantsPlinth ? (
            <div className="flex justify-between gap-4"><span>Metry bieżące cokołu</span><span className="font-medium text-zinc-950">{selections.plinthLengthMb.toFixed(0)} mb</span></div>
          ) : null}
          <div className="flex justify-between gap-4">
            <span>Akcesoria dodatkowe</span>
            <span className="text-right font-medium text-zinc-950">
              {resolved.accessories.length ? resolved.accessories.map((item) => item.label).join(", ") : "Brak"}
            </span>
          </div>
          <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-600">{config.messages.result_allowance_message}</div>
          <div className="space-y-3 rounded-2xl border border-zinc-200 px-4 py-4">
            <div>
              <p className="font-medium text-zinc-950">Orientacyjna ilość materiałów bazowych</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Przyjmujemy {formatOneDecimal(materialEstimate.primerKgPerM2)} kg/m² dla gruntu i {formatOneDecimal(materialEstimate.resinKgPerM2)} kg/m² dla posadzki żywicznej.
              </p>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                <div className="flex justify-between gap-4">
                  <span>{materialEstimate.primerLabel}</span>
                  <span className="font-medium text-zinc-950">{formatOneDecimal(materialEstimate.primerKg)} kg</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{materialEstimate.primerUnitPrice.toFixed(0)} zł/kg · razem {formatCurrency(materialEstimate.primerTotal)} zł</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                <div className="flex justify-between gap-4">
                  <span>{materialEstimate.resinLabel}</span>
                  <span className="font-medium text-zinc-950">{formatOneDecimal(materialEstimate.resinKg)} kg</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{materialEstimate.resinUnitPrice.toFixed(0)} zł/kg · razem {formatCurrency(materialEstimate.resinTotal)} zł</p>
              </div>
            </div>
            <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3">
              <span>Razem materiały bazowe</span>
              <span className="font-medium text-zinc-950">
                {formatOneDecimal(materialEstimate.totalKg)} kg · {formatCurrency(materialEstimate.totalValue)} zł
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-zinc-950 px-4 py-4 text-white">
            <span>Szacunkowa wartość</span>
            <span className="text-xl font-semibold">{formatCurrency(total)} zł</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-zinc-200 shadow-sm">
        <CardHeader>
          <CardTitle>Co zawiera zestaw</CardTitle>
          <CardDescription>Lista elementów jest pobierana z konfiguracji i zależy od wybranego wariantu.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {kitItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-zinc-200 px-4 py-3">
              <p className="font-medium text-zinc-950">{item.label}</p>
              {item.description ? <p className="mt-1 text-sm text-zinc-600">{item.description}</p> : null}
            </div>
          ))}
        </CardContent>
      </Card>

      {accessories.length ? (
        <Card className="rounded-3xl border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle>Dobierz akcesoria do zestawu</CardTitle>
            <CardDescription>Na końcu możesz od razu zaznaczyć akcesoria pomocne przy aplikacji. Pod każdą opcją pokazujemy krótką rekomendację.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {accessories.map((accessory) => (
              <OptionCard
                key={accessory.id}
                title={accessory.label}
                description={accessory.description}
                badge={accessory.recommended ? "Rekomendowane" : undefined}
                selected={selections.accessoryIds.includes(accessory.id)}
                className="min-h-[156px]"
                footer={
                  accessory.recommendation ? (
                    <p className="text-xs leading-5 text-zinc-500">{accessory.recommendation}</p>
                  ) : undefined
                }
                onClick={() => onAccessoryToggle(accessory.id)}
              />
            ))}
          </CardContent>
        </Card>
      ) : null}

      {standaloneProducts.length ? (
        <Card className="rounded-3xl border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle>Produkty dodatkowe na końcu konfiguracji</CardTitle>
            <CardDescription>Lista jest w pełni konfigurowana w panelu admin i może być dowolnie ukrywana lub sortowana.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {standaloneProducts.map((product) => (
              <div key={product.product_id} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-zinc-950">{product.name}</p>
                  <p className="text-sm text-zinc-600">{product.description}</p>
                  <p className="text-xs text-zinc-500">{formatProductPricing(product)}</p>
                </div>
                <Button asChild variant={product.result_display_type === "compact" ? "outline" : "default"}>
                  <Link href={`/sklep/${getProductSlug(product)}`}>
                    Zobacz produkt
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-3">
        {ctas.map((cta) => (
          <Button
            key={cta.id}
            variant={cta.variant || "default"}
            className="h-12 w-full justify-between rounded-2xl"
            onClick={() => onMockAction(cta.label)}
          >
            {cta.label}
            <ExternalLink className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  )
}
