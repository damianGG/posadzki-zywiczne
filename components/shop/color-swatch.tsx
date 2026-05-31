import { ShopConfiguratorColorOption, ShopConfiguratorFlakeColorOption } from "@/types/shop"

import { cn } from "@/lib/utils"

interface ColorSwatchProps {
  option: ShopConfiguratorColorOption | ShopConfiguratorFlakeColorOption
  selected: boolean
  onSelect: () => void
}

function isFloorColor(option: ShopConfiguratorColorOption | ShopConfiguratorFlakeColorOption): option is ShopConfiguratorColorOption {
  return "hex" in option
}

export default function ColorSwatch({ option, selected, onSelect }: ColorSwatchProps) {
  const swatches = isFloorColor(option) ? [option.hex] : option.swatch_colors?.length ? option.swatch_colors : ["#d4d4d8", "#71717a"]

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-3xl border bg-white p-4 text-left transition-all",
        selected ? "border-zinc-950 shadow-lg shadow-zinc-200" : "border-zinc-200 hover:border-zinc-300"
      )}
    >
      <div className="mb-4 flex h-20 items-center gap-2 rounded-2xl bg-zinc-50 p-3">
        {swatches.map((color) => (
          <span key={`${option.id}-${color}`} className="h-full flex-1 rounded-2xl border border-black/5" style={{ backgroundColor: color }} />
        ))}
      </div>
      <p className="font-semibold text-zinc-950">{option.label}</p>
      {option.description ? <p className="mt-2 text-sm leading-6 text-zinc-600">{option.description}</p> : null}
    </button>
  )
}
