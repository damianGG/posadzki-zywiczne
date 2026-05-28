import {
  ShopCatalog,
  ShopConfiguratorColorOption,
  ShopConfiguratorConfig,
  ShopConfiguratorFinishVariant,
  ShopConfiguratorFlakeColorOption,
  ShopConfiguratorKitItem,
  ShopConfiguratorRoomVariant,
  ShopConfiguratorSelections,
  ShopConfiguratorStepId,
  ShopConfiguratorStepSetting,
  ShopConfiguratorSubstrateOption,
} from "@/types/shop"

const roundCurrency = (value: number) => Math.round(value * 100) / 100

function sortByOrder<T extends { sort_order?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

export function getConfiguratorConfig(catalog: ShopCatalog) {
  return catalog.configuratorConfig
}

export function getActiveRoomVariants(config: ShopConfiguratorConfig) {
  return sortByOrder(config.room_variants.filter((item) => item.is_active !== false || item.status === "coming-soon"))
}

export function getPrimaryRoomVariant(config: ShopConfiguratorConfig) {
  return getActiveRoomVariants(config).find((item) => item.is_active !== false && item.status !== "coming-soon") ?? config.room_variants[0]
}

export function getStepSettings(config: ShopConfiguratorConfig, requiresFlakeColor: boolean) {
  return sortByOrder(config.steps)
    .filter((step) => step.is_active !== false)
    .filter((step) => step.id !== "flake-color" || requiresFlakeColor)
    .filter((step) => step.id !== "plinth" || config.plinth.enabled)
}

export function getSubstrateOptions(config: ShopConfiguratorConfig) {
  return sortByOrder(config.substrate_options.filter((item) => item.is_active !== false))
}

export function getFinishVariants(config: ShopConfiguratorConfig) {
  return sortByOrder(config.finish_variants.filter((item) => item.is_active !== false))
}

export function getFloorColors(config: ShopConfiguratorConfig) {
  return sortByOrder(config.floor_colors.filter((item) => item.is_active !== false))
}

export function getFlakeColors(config: ShopConfiguratorConfig) {
  return sortByOrder(config.flake_colors.filter((item) => item.is_active !== false))
}

export function getActiveCtas(config: ShopConfiguratorConfig) {
  return sortByOrder(config.cta_buttons.filter((item) => item.is_active !== false))
}

export function findSubstrate(config: ShopConfiguratorConfig, substrateId: string | null) {
  return getSubstrateOptions(config).find((item) => item.id === substrateId) ?? null
}

export function findFinishVariant(config: ShopConfiguratorConfig, finishVariantId: string | null) {
  return getFinishVariants(config).find((item) => item.id === finishVariantId) ?? null
}

export function findFloorColor(config: ShopConfiguratorConfig, floorColorId: string | null) {
  return getFloorColors(config).find((item) => item.id === floorColorId) ?? null
}

export function findFlakeColor(config: ShopConfiguratorConfig, flakeColorId: string | null) {
  return getFlakeColors(config).find((item) => item.id === flakeColorId) ?? null
}

export function getConfiguratorTotal(config: ShopConfiguratorConfig, selections: ShopConfiguratorSelections) {
  const finishVariant = findFinishVariant(config, selections.finishVariantId)
  const finishTotal = finishVariant ? finishVariant.price_from * selections.area : 0
  const plinthTotal = selections.wantsPlinth ? config.plinth.price_per_mb * selections.plinthLengthMb : 0
  return roundCurrency(finishTotal + plinthTotal)
}

export function getVisibleKitItems(config: ShopConfiguratorConfig, selections: ShopConfiguratorSelections) {
  const finishVariant = findFinishVariant(config, selections.finishVariantId)
  const finishVariantId = finishVariant?.id
  const requiresFlakes = Boolean(finishVariant?.requires_flake_color)

  return sortByOrder(config.kit_items.filter((item) => item.is_active !== false)).filter((item) => {
    switch (item.visibility) {
      case "with-flakes":
        return requiresFlakes
      case "with-plinth":
        return selections.wantsPlinth === true
      case "variant-match":
        return Boolean(finishVariantId && item.finish_variant_ids?.includes(finishVariantId))
      case "always":
      default:
        return true
    }
  })
}

export function isStepComplete(config: ShopConfiguratorConfig, stepId: ShopConfiguratorStepId, selections: ShopConfiguratorSelections) {
  const finishVariant = findFinishVariant(config, selections.finishVariantId)

  switch (stepId) {
    case "substrate":
      return Boolean(selections.substrateId)
    case "finish":
      return Boolean(selections.finishVariantId)
    case "floor-color":
      return Boolean(selections.floorColorId)
    case "flake-color":
      return finishVariant?.requires_flake_color ? Boolean(selections.flakeColorId) : true
    case "area":
      return selections.area >= config.area.min
    case "plinth":
      if (selections.wantsPlinth === null) {
        return false
      }
      return selections.wantsPlinth ? selections.plinthLengthMb > 0 : true
    case "result":
      return true
    default:
      return false
  }
}

export function getPreviewHeading(step: ShopConfiguratorStepSetting, selections: ShopConfiguratorSelections, config: ShopConfiguratorConfig) {
  const substrate = findSubstrate(config, selections.substrateId)
  const finish = findFinishVariant(config, selections.finishVariantId)
  const floorColor = findFloorColor(config, selections.floorColorId)
  const flakeColor = findFlakeColor(config, selections.flakeColorId)

  switch (step.id) {
    case "substrate":
      return substrate?.label || step.question
    case "finish":
      return finish?.label || step.question
    case "floor-color":
      return floorColor?.label || step.question
    case "flake-color":
      return flakeColor?.label || step.question
    case "area":
      return `${selections.area.toFixed(0)} m²`
    case "plinth":
      return selections.wantsPlinth ? `Cokół: ${selections.plinthLengthMb.toFixed(0)} mb` : step.question
    case "result":
      return config.messages.result_title
    default:
      return step.question
  }
}

export function getRoomVariantName(config: ShopConfiguratorConfig, roomVariantId: string) {
  const roomVariant = getActiveRoomVariants(config).find((item) => item.id === roomVariantId)
  return roomVariant?.label ?? roomVariantId
}

export type ResolvedOptionLookup = {
  roomVariant: ShopConfiguratorRoomVariant | undefined
  substrate: ShopConfiguratorSubstrateOption | null
  finishVariant: ShopConfiguratorFinishVariant | null
  floorColor: ShopConfiguratorColorOption | null
  flakeColor: ShopConfiguratorFlakeColorOption | null
}

export function resolveSelections(config: ShopConfiguratorConfig, selections: ShopConfiguratorSelections): ResolvedOptionLookup {
  return {
    roomVariant: getActiveRoomVariants(config).find((item) => item.id === selections.roomVariantId),
    substrate: findSubstrate(config, selections.substrateId),
    finishVariant: findFinishVariant(config, selections.finishVariantId),
    floorColor: findFloorColor(config, selections.floorColorId),
    flakeColor: findFlakeColor(config, selections.flakeColorId),
  }
}
