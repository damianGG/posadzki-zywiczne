import { ShopConfiguratorStepSetting } from "@/types/shop"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface StepProgressProps {
  steps: ShopConfiguratorStepSetting[]
  activeStepId: string
}

export default function StepProgress({ steps, activeStepId }: StepProgressProps) {
  const activeIndex = Math.max(
    steps.findIndex((step) => step.id === activeStepId),
    0
  )
  const progressValue = steps.length <= 1 ? 100 : (activeIndex / (steps.length - 1)) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-zinc-600">
        <span>
          Krok {activeIndex + 1} z {steps.length}
        </span>
        <span>{steps[activeIndex]?.title}</span>
      </div>
      <Progress value={progressValue} className="h-2 bg-zinc-200 [&>div]:bg-zinc-950" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId
          const isDone = index < activeIndex
          return (
            <div
              key={step.id}
              className={cn(
                "min-w-max rounded-full px-3 py-1.5 text-xs font-medium",
                isActive ? "bg-zinc-950 text-white" : isDone ? "bg-zinc-200 text-zinc-900" : "bg-zinc-100 text-zinc-500"
              )}
            >
              {step.title}
            </div>
          )
        })}
      </div>
    </div>
  )
}
