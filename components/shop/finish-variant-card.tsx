import { ShopConfiguratorFinishVariant } from "@/types/shop"

import OptionCard from "@/components/shop/option-card"

interface FinishVariantCardProps {
  variant: ShopConfiguratorFinishVariant
  selected: boolean
  onSelect: () => void
}

export default function FinishVariantCard({ variant, selected, onSelect }: FinishVariantCardProps) {
  return (
    <OptionCard
      title={variant.label}
      description={variant.description}
      badge={variant.badge}
      selected={selected}
      onClick={onSelect}
      footer={
        <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700">
          od {variant.price_from.toFixed(0)} {variant.price_unit_label || "zł/m²"}
        </div>
      }
    />
  )
}
