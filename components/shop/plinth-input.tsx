import OptionCard from "@/components/shop/option-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShopConfiguratorPlinthSettings } from "@/types/shop"

interface PlinthInputProps {
  settings: ShopConfiguratorPlinthSettings
  wantsPlinth: boolean | null
  plinthLengthMb: number
  onWantsPlinthChange: (value: boolean) => void
  onLengthChange: (value: number) => void
}

export default function PlinthInput({
  settings,
  wantsPlinth,
  plinthLengthMb,
  onWantsPlinthChange,
  onLengthChange,
}: PlinthInputProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <OptionCard
          title={settings.no_option_label}
          description={settings.no_option_description}
          selected={wantsPlinth === false}
          onClick={() => onWantsPlinthChange(false)}
        />
        <OptionCard
          title={settings.yes_option_label}
          description={`${settings.yes_option_description} (+${settings.price_per_mb.toFixed(0)} ${settings.unit_label})`}
          selected={wantsPlinth === true}
          onClick={() => onWantsPlinthChange(true)}
        />
      </div>

      {wantsPlinth ? (
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 space-y-3">
          <Label htmlFor="plinth-length">{settings.length_label}</Label>
          <Input
            id="plinth-length"
            type="number"
            min={1}
            step={1}
            value={plinthLengthMb}
            onChange={(event) => onLengthChange(Math.max(1, Number(event.target.value) || 1))}
          />
          <p className="text-sm leading-6 text-zinc-500">{settings.length_hint}</p>
        </div>
      ) : null}
    </div>
  )
}
