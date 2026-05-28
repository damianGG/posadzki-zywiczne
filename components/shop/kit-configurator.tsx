"use client"

import { useEffect, useMemo, useState } from "react"
import { Home, Layers3, Palette, Sparkles, SquareStack } from "lucide-react"

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
  getActiveCtas,
  getActiveRoomVariants,
  getConfiguratorConfig,
  getConfiguratorTotal,
  getFinishVariants,
  getFlakeColors,
  getFloorColors,
  getPreviewHeading,
  getPrimaryRoomVariant,
  getStepSettings,
  getSubstrateOptions,
  getVisibleKitItems,
  isStepComplete,
  resolveSelections,
} from "@/lib/shop-configurator"

interface KitConfiguratorProps {
  catalog: ShopCatalog
}

const previewIcons = {
  substrate: Layers3,
  finish: SquareStack,
  "floor-color": Palette,
  "flake-color": Sparkles,
  area: Home,
  plinth: Layers3,
  result: Sparkles,
}

export default function KitConfigurator({ catalog }: KitConfiguratorProps) {
  const config = useMemo(() => getConfiguratorConfig(catalog), [catalog])
  const primaryRoomVariant = useMemo(() => getPrimaryRoomVariant(config), [config])
  const activeRoomVariants = useMemo(() => getActiveRoomVariants(config), [config])
  const [selections, setSelections] = useState<ShopConfiguratorSelections>({
    roomVariantId: primaryRoomVariant?.id ?? "garage-utility",
    substrateId: null,
    finishVariantId: null,
    floorColorId: null,
    flakeColorId: null,
    area: config.area.quick_choices[0] ?? config.area.min,
    wantsPlinth: null,
    plinthLengthMb: 10,
  })
  const [activeStepId, setActiveStepId] = useState("substrate")
  const [mockMessage, setMockMessage] = useState<string | null>(null)

  const resolved = useMemo(() => resolveSelections(config, selections), [config, selections])
  const requiresFlakeColor = Boolean(resolved.finishVariant?.requires_flake_color)
  const steps = useMemo(() => getStepSettings(config, requiresFlakeColor), [config, requiresFlakeColor])
  const activeStepIndex = Math.max(steps.findIndex((step) => step.id === activeStepId), 0)
  const activeStep = steps[activeStepIndex] ?? steps[0]
  const total = useMemo(() => getConfiguratorTotal(config, selections), [config, selections])
  const kitItems = useMemo(() => getVisibleKitItems(config, selections), [config, selections])
  const ctas = useMemo(() => getActiveCtas(config), [config])
  const previewHeading = useMemo(() => getPreviewHeading(activeStep, selections, config), [activeStep, config, selections])

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

  const floorColorHex = resolved.floorColor?.hex || "#E5E7EB"
  const flakeColors = resolved.flakeColor?.swatch_colors || ["rgba(255,255,255,0.65)", "rgba(17,24,39,0.35)"]

  return (
    <div className="bg-zinc-50 pb-28 pt-6 text-zinc-950">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="space-y-4">
          <Badge className="rounded-full bg-zinc-900 px-3 py-1 text-white hover:bg-zinc-900">{config.messages.badge}</Badge>
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{config.messages.title}</h1>
            <p className="text-base leading-7 text-zinc-600 md:text-lg">{config.messages.description}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="overflow-hidden rounded-[32px] border-none bg-zinc-950 text-white shadow-xl">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Podgląd</p>
                    <p className="mt-2 text-2xl font-semibold">{previewHeading}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                    {activeStepIndex + 1}/{steps.length}
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-[28px] p-6" style={{ backgroundColor: floorColorHex }}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_45%)]" />
                  {Array.from({ length: requiresFlakeColor ? 10 : 4 }).map((_, index) => (
                    <span
                      key={index}
                      className="absolute rounded-full opacity-80"
                      style={{
                        top: `${12 + index * 7}%`,
                        left: `${8 + (index % 4) * 22}%`,
                        width: `${requiresFlakeColor ? 10 : 6}px`,
                        height: `${requiresFlakeColor ? 10 : 6}px`,
                        backgroundColor: flakeColors[index % flakeColors.length],
                      }}
                    />
                  ))}
                  <div className="relative rounded-[24px] border border-white/20 bg-black/30 p-5 backdrop-blur">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = previewIcons[activeStep.id]
                        return <Icon className="h-5 w-5" />
                      })()}
                      <div>
                        <p className="text-sm text-zinc-200">{activeStep.title}</p>
                        <p className="text-lg font-semibold text-white">{activeStep.question}</p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-3 text-sm text-zinc-100">
                      <div className="flex justify-between gap-4"><span>Pomieszczenie</span><span>{resolved.roomVariant?.label}</span></div>
                      <div className="flex justify-between gap-4"><span>Wykończenie</span><span>{resolved.finishVariant?.label || "Jeszcze nie wybrano"}</span></div>
                      <div className="flex justify-between gap-4"><span>Kolor</span><span>{resolved.floorColor?.label || "Jeszcze nie wybrano"}</span></div>
                      <div className="flex justify-between gap-4"><span>Metraż</span><span>{selections.area.toFixed(0)} m²</span></div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <p className="text-sm font-medium text-zinc-200">{config.messages.room_section_label}</p>
                  <div className="grid gap-3">
                    {activeRoomVariants.map((roomVariant) => (
                      <div key={roomVariant.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-white">{roomVariant.label}</p>
                          {roomVariant.status_label ? <Badge className="bg-white/10 text-white hover:bg-white/10">{roomVariant.status_label}</Badge> : null}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-zinc-300">{roomVariant.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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
                  {activeStep.helper_text ? <p className="text-sm leading-6 text-zinc-500">{activeStep.helper_text}</p> : null}
                </div>

                {activeStep.id === "substrate" ? (
                  <div className="grid gap-4">
                    {getSubstrateOptions(config).map((option) => (
                      <OptionCard
                        key={option.id}
                        title={option.label}
                        description={option.description}
                        selected={selections.substrateId === option.id}
                        onClick={() => setSelections((current) => ({ ...current, substrateId: option.id }))}
                      />
                    ))}
                  </div>
                ) : null}

                {activeStep.id === "finish" ? (
                  <div className="grid gap-4">
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                    kitItems={kitItems}
                    ctas={ctas}
                    onMockAction={(label) => setMockMessage(`${label}: ${config.messages.mock_cta_message}`)}
                  />
                ) : null}
              </CardContent>
            </Card>
          </div>
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
