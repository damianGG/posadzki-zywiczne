import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShopConfiguratorAreaSettings } from "@/types/shop"

interface AreaInputProps {
  value: number
  settings: ShopConfiguratorAreaSettings
  onChange: (nextValue: number) => void
}

export default function AreaInput({ value, settings, onChange }: AreaInputProps) {
  const clamp = (nextValue: number) => Math.min(settings.max, Math.max(settings.min, nextValue))

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="icon" onClick={() => onChange(clamp(value - settings.step))}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min={settings.min}
            max={settings.max}
            step={settings.step}
            value={value}
            onChange={(event) => onChange(clamp(Number(event.target.value) || settings.min))}
            className="h-14 text-center text-lg font-semibold"
          />
          <Button type="button" variant="outline" size="icon" onClick={() => onChange(clamp(value + settings.step))}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-3 text-center text-sm text-zinc-500">{settings.label}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {settings.quick_choices.map((choice) => (
          <Button key={choice} type="button" variant={choice === value ? "default" : "outline"} onClick={() => onChange(choice)}>
            {choice} m²
          </Button>
        ))}
      </div>

      <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-600">{settings.allowance_message}</div>
    </div>
  )
}
