"use client"

import { useEffect, useMemo, useState } from "react"

import AreaInput from "@/components/shop/area-input"
import ColorSwatch from "@/components/shop/color-swatch"
import FinishVariantCard from "@/components/shop/finish-variant-card"
import OptionCard from "@/components/shop/option-card"
import PlinthInput from "@/components/shop/plinth-input"
import ResultSummary from "@/components/shop/result-summary"
import StepProgress from "@/components/shop/step-progress"
import StickyBottomBar from "@/components/shop/sticky-bottom-bar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ShopCatalog, ShopConfiguratorSelections } from "@/types/shop"
import {
  getAccessoryOptions,
  getActiveCtas,
  getActiveRoomVariants,
  getConfiguratorConfig,
  getConfiguratorTotal,
  getFinishVariants,
  getFlakeColors,
  getFloorColors,
  getStepSettings,
  getSubstrateOptions,
  getVisibleKitItems,
  isRoomVariantSelectable,
  isStepComplete,
  resolveSelections,
} from "@/lib/shop-configurator"

interface KitConfiguratorProps {
  catalog: ShopCatalog
}

export default function KitConfigurator({ catalog }: KitConfiguratorProps) {
  const config = useMemo(() => getConfiguratorConfig(catalog), [catalog])
  const activeRoomVariants = useMemo(() => getActiveRoomVariants(config), [config])
  const [selections, setSelections] = useState<ShopConfiguratorSelections>({
    roomVariantId: null,
    substrateId: null,
    finishVariantId: null,
    floorColorId: null,
    flakeColorId: null,
    accessoryIds: [],
    area: config.area.quick_choices[0] ?? config.area.min,
    wantsPlinth: null,
    plinthLengthMb: 10,
  })
  const [activeStepId, setActiveStepId] = useState("room")
  const [mockMessage, setMockMessage] = useState<string | null>(null)

  const resolved = useMemo(() => resolveSelections(config, selections), [config, selections])
  const requiresFlakeColor = Boolean(resolved.finishVariant?.requires_flake_color)
  const steps = useMemo(() => getStepSettings(config, requiresFlakeColor), [config, requiresFlakeColor])
  const activeStepIndex = Math.max(steps.findIndex((step) => step.id === activeStepId), 0)
  const activeStep = steps[activeStepIndex] ?? steps[0]
  const total = useMemo(() => getConfiguratorTotal(config, selections), [config, selections])
  const accessories = useMemo(() => getAccessoryOptions(config), [config])
  const kitItems = useMemo(() => getVisibleKitItems(config, selections), [config, selections])
  const ctas = useMemo(() => getActiveCtas(config), [config])

  useEffect(() => {
    if (!requiresFlakeColor && selections.flakeColorId) {
      setSelections((current) => ({ ...current, flakeColorId: null }))
    }
  }, [requiresFlakeColor, selections.flakeColorId])

  useEffect(() => {
    if (!steps.some((step) => step.id === activeStepId)) {
      setActiveStepId(steps[0]?.id ?? "substrate")
    }
  }, [activeStepId, steps])

  if (!activeStep) {
    return null
  }

  const goToNextStep = () => {
    if (!activeStep || !isStepComplete(config, activeStep.id, selections)) {
      return
    }

    const nextStep = steps[activeStepIndex + 1]
    if (nextStep) {
      setActiveStepId(nextStep.id)
    }
  }

  const goToPreviousStep = () => {
    const previousStep = steps[activeStepIndex - 1]
    if (previousStep) {
      setActiveStepId(previousStep.id)
    }
  }

  return (
    <div className="bg-zinc-50 pb-28 pt-4 text-zinc-950 md:pt-6">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="space-y-4">
          <Badge className="rounded-full bg-zinc-900 px-3 py-1 text-white hover:bg-zinc-900">{config.messages.badge}</Badge>
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{config.messages.title}</h1>
            <p className="text-base leading-7 text-zinc-600 md:text-lg">{config.messages.description}</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <StepProgress steps={steps} activeStepId={activeStep.id} />

          {mockMessage ? (
            <Alert>
              <AlertDescription>{mockMessage}</AlertDescription>
            </Alert>
          ) : null}

          <Card className="rounded-[32px] border-zinc-200 shadow-sm">
            <CardContent className="space-y-6 p-5 md:p-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{activeStep.question}</h2>
                {activeStep.description ? <p className="text-sm leading-6 text-zinc-600">{activeStep.description}</p> : null}
                {activeStep.id === "room" ? <p className="text-sm leading-6 text-zinc-500">{config.messages.room_section_label}</p> : null}
                {activeStep.helper_text ? <p className="text-sm leading-6 text-zinc-500">{activeStep.helper_text}</p> : null}
              </div>

              {activeStep.id === "room" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {activeRoomVariants.map((roomVariant) => {
                    const isSelectable = isRoomVariantSelectable(roomVariant)
                    return (
                      <OptionCard
                        key={roomVariant.id}
                        title={roomVariant.label}
                        description={roomVariant.description}
                        badge={roomVariant.status_label}
                        selected={selections.roomVariantId === roomVariant.id}
                        disabled={!isSelectable}
                        className="min-h-[170px]"
                        onClick={() => {
                          if (!isSelectable) {
                            return
                          }
                          setSelections((current) => ({ ...current, roomVariantId: roomVariant.id }))
                        }}
                      />
                    )
                  })}
                </div>
              ) : null}

              {activeStep.id === "substrate" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {getSubstrateOptions(config).map((option) => (
                    <OptionCard
                      key={option.id}
                      title={option.label}
                      description={option.description}
                      selected={selections.substrateId === option.id}
                      className="min-h-[152px]"
                      onClick={() => setSelections((current) => ({ ...current, substrateId: option.id }))}
                    />
                  ))}
                </div>
              ) : null}

              {activeStep.id === "finish" ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {getFinishVariants(config).map((variant) => (
                    <FinishVariantCard
                      key={variant.id}
                      variant={variant}
                      selected={selections.finishVariantId === variant.id}
                      onSelect={() =>
                        setSelections((current) => ({
                          ...current,
                          finishVariantId: variant.id,
                          flakeColorId: variant.requires_flake_color ? current.flakeColorId : null,
                        }))
                      }
                    />
                  ))}
                </div>
              ) : null}

              {activeStep.id === "floor-color" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {getFloorColors(config).map((option) => (
                    <ColorSwatch
                      key={option.id}
                      option={option}
                      selected={selections.floorColorId === option.id}
                      onSelect={() => setSelections((current) => ({ ...current, floorColorId: option.id }))}
                    />
                  ))}
                </div>
              ) : null}

              {activeStep.id === "flake-color" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {getFlakeColors(config).map((option) => (
                    <ColorSwatch
                      key={option.id}
                      option={option}
                      selected={selections.flakeColorId === option.id}
                      onSelect={() => setSelections((current) => ({ ...current, flakeColorId: option.id }))}
                    />
                  ))}
                </div>
              ) : null}

              {activeStep.id === "area" ? (
                <AreaInput settings={config.area} value={selections.area} onChange={(value) => setSelections((current) => ({ ...current, area: value }))} />
              ) : null}

              {activeStep.id === "plinth" ? (
                <PlinthInput
                  settings={config.plinth}
                  wantsPlinth={selections.wantsPlinth}
                  plinthLengthMb={selections.plinthLengthMb}
                  onWantsPlinthChange={(value) => setSelections((current) => ({ ...current, wantsPlinth: value }))}
                  onLengthChange={(value) => setSelections((current) => ({ ...current, plinthLengthMb: value }))}
                />
              ) : null}

              {activeStep.id === "result" ? (
                <ResultSummary
                  config={config}
                  selections={selections}
                  resolved={resolved}
                  total={total}
                  accessories={accessories}
                  kitItems={kitItems}
                  ctas={ctas}
                  onAccessoryToggle={(accessoryId) =>
                    setSelections((current) => ({
                      ...current,
                      accessoryIds: current.accessoryIds.includes(accessoryId)
                        ? current.accessoryIds.filter((id) => id !== accessoryId)
                        : [...current.accessoryIds, accessoryId],
                    }))
                  }
                  onMockAction={(label) => setMockMessage(`${label}: ${config.messages.mock_cta_message}`)}
                />
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <StickyBottomBar
        canGoBack={activeStepIndex > 0}
        canGoNext={isStepComplete(config, activeStep.id, selections)}
        nextLabel={activeStep.next_label || "Dalej"}
        onBack={goToPreviousStep}
        onNext={goToNextStep}
        hideNext={activeStep.id === "result"}
      />
    </div>
  )
}
