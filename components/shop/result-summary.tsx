import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ShopConfiguratorConfig,
  ShopConfiguratorCtaButton,
  ShopConfiguratorKitItem,
  ShopConfiguratorSelections,
} from "@/types/shop"
import { ResolvedOptionLookup } from "@/lib/shop-configurator"

interface ResultSummaryProps {
  config: ShopConfiguratorConfig
  selections: ShopConfiguratorSelections
  resolved: ResolvedOptionLookup
  total: number
  kitItems: ShopConfiguratorKitItem[]
  ctas: ShopConfiguratorCtaButton[]
  onMockAction: (label: string) => void
}

export default function ResultSummary({ config, selections, resolved, total, kitItems, ctas, onMockAction }: ResultSummaryProps) {
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
          <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-600">{config.messages.result_allowance_message}</div>
          <div className="flex items-center justify-between rounded-2xl bg-zinc-950 px-4 py-4 text-white">
            <span>Szacunkowa wartość</span>
            <span className="text-xl font-semibold">{total.toFixed(2)} zł</span>
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
